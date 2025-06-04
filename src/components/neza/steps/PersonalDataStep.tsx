
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2, Sparkles, Heart, AlertCircle, CheckCircle } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface PersonalData {
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  email: string;
  phone: string;
  isValidated: boolean;
  otpVerified: boolean;
}

interface PersonalDataStepProps {
  data: PersonalData;
  onUpdate: (data: PersonalData) => void;
  onNext: () => void;
  isReturningUser: boolean;
}

export const PersonalDataStep = ({ data, onUpdate, onNext, isReturningUser }: PersonalDataStepProps) => {
  const [currentField, setCurrentField] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [validationMessages, setValidationMessages] = useState<{ [key: string]: string }>({});
  const [isDuplicateUser, setIsDuplicateUser] = useState(false);

  const fields = [
    { 
      key: 'firstName', 
      label: 'Nombres', 
      placeholder: 'Juan Carlos', 
      emoji: '👋',
      motivationalText: '¡Hola! Me encanta conocerte 😊'
    },
    { 
      key: 'lastName', 
      label: 'Apellidos', 
      placeholder: 'García López', 
      emoji: '✨',
      motivationalText: '¡Perfecto! Sigamos conociendo más de ti'
    },
    { 
      key: 'dni', 
      label: 'DNI', 
      placeholder: '12345678', 
      emoji: '🆔',
      motivationalText: 'Ahora necesito validar tu identidad de forma segura 🔒'
    },
    { 
      key: 'birthDate', 
      label: 'Fecha de nacimiento', 
      placeholder: '1990-01-15', 
      emoji: '🎂',
      motivationalText: '¡Genial! Ya casi te conozco completamente'
    },
    { 
      key: 'email', 
      label: 'Correo electrónico', 
      placeholder: 'juan@email.com', 
      emoji: '📧',
      motivationalText: 'Tu correo es importante para mantenerte informado 📨'
    },
    { 
      key: 'phone', 
      label: 'Número de celular', 
      placeholder: '987654321', 
      emoji: '📱',
      motivationalText: '¡Último paso! Confirmemos tu celular para mayor seguridad 🛡️'
    }
  ];

  const currentFieldData = fields[currentField];

  const checkDuplicateUser = (dni: string): boolean => {
    const existingUsers = Object.keys(localStorage).filter(key => 
      key.startsWith('neza-onboarding-') && key !== `neza-onboarding-${dni}`
    );
    return existingUsers.length > 0;
  };

  const validateField = (key: string, value: string): boolean => {
    switch (key) {
      case 'dni':
        if (!/^\d{8}$/.test(value)) {
          setValidationMessages(prev => ({ ...prev, [key]: 'El DNI debe tener exactamente 8 dígitos' }));
          return false;
        }
        // Verificar duplicados
        if (checkDuplicateUser(value)) {
          setIsDuplicateUser(true);
          setValidationMessages(prev => ({ 
            ...prev, 
            [key]: '¡Este DNI ya está registrado! ¿Quieres continuar con tu registro anterior?' 
          }));
          return false;
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setValidationMessages(prev => ({ ...prev, [key]: 'Por favor ingresa un correo válido' }));
          return false;
        }
        break;
      case 'phone':
        if (!/^9\d{8}$/.test(value)) {
          setValidationMessages(prev => ({ 
            ...prev, 
            [key]: 'El celular debe empezar con 9 y tener 9 dígitos (ej: 987654321)' 
          }));
          return false;
        }
        break;
      case 'birthDate':
        const date = new Date(value);
        const age = new Date().getFullYear() - date.getFullYear();
        if (age < 18 || age > 80) {
          setValidationMessages(prev => ({ 
            ...prev, 
            [key]: 'Debes tener entre 18 y 80 años para acceder a productos financieros' 
          }));
          return false;
        }
        break;
      case 'firstName':
      case 'lastName':
        if (value.trim().length < 2) {
          setValidationMessages(prev => ({ 
            ...prev, 
            [key]: 'Este campo debe tener al menos 2 caracteres' 
          }));
          return false;
        }
        break;
    }
    
    setValidationMessages(prev => ({ ...prev, [key]: '' }));
    setIsDuplicateUser(false);
    return true;
  };

  const simulateReniecValidation = async (dni: string): Promise<boolean> => {
    setIsValidating(true);
    setValidationMessages(prev => ({ ...prev, dni: 'Validando con RENIEC...' }));
    
    // Simular consulta a RENIEC
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsValidating(false);
    
    // Simulación: DNIs que empiecen con 1-7 son válidos
    const isValid = ['1', '2', '3', '4', '5', '6', '7'].includes(dni[0]);
    
    if (isValid) {
      setValidationMessages(prev => ({ 
        ...prev, 
        dni: '¡DNI validado exitosamente con RENIEC! ✅' 
      }));
      return true;
    } else {
      setValidationMessages(prev => ({ 
        ...prev, 
        dni: 'DNI no encontrado en la base de datos de RENIEC. Verifica que sea correcto.' 
      }));
      return false;
    }
  };

  const sendOTP = async () => {
    setOtpSent(true);
    setValidationMessages(prev => ({ 
      ...prev, 
      phone: '¡Código enviado! Revisa tu celular 📱' 
    }));
    console.log(`Código OTP enviado al ${data.phone}`);
  };

  const verifyOTP = () => {
    if (otp === "1234" || otp === "0000") { // Códigos de prueba
      onUpdate({ ...data, otpVerified: true });
      setValidationMessages(prev => ({ 
        ...prev, 
        otp: '¡Celular verificado correctamente! 🎉' 
      }));
      setTimeout(() => {
        onNext();
      }, 1500);
    } else {
      setValidationMessages(prev => ({ 
        ...prev, 
        otp: 'Código incorrecto. El código de prueba es 1234 o 0000' 
      }));
    }
  };

  const handleFieldUpdate = (value: string) => {
    const key = currentFieldData.key as keyof PersonalData;
    onUpdate({ ...data, [key]: value });
  };

  const handleContinueWithExisting = () => {
    // Encontrar y cargar datos existentes
    const existingKey = Object.keys(localStorage).find(key => 
      key.startsWith('neza-onboarding-') && key.includes(data.dni)
    );
    
    if (existingKey) {
      const existingData = JSON.parse(localStorage.getItem(existingKey) || '{}');
      onUpdate(existingData.personalData);
      onNext();
    }
  };

  const nextField = async () => {
    const key = currentFieldData.key as keyof PersonalData;
    const value = data[key] as string;
    
    if (!value.trim()) return;
    
    if (!validateField(key, value)) {
      if (isDuplicateUser) {
        return; // Se muestra el botón de continuar con existente
      }
      return;
    }

    // Validación especial para DNI
    if (key === 'dni') {
      const isValid = await simulateReniecValidation(value);
      if (isValid) {
        onUpdate({ ...data, isValidated: true });
      } else {
        return;
      }
    }

    if (currentField < fields.length - 1) {
      setCurrentField(prev => prev + 1);
    } else {
      // Último campo, enviar OTP
      await sendOTP();
    }
  };

  const canProceed = () => {
    const key = currentFieldData.key as keyof PersonalData;
    const value = data[key] as string;
    return value.trim().length > 0 && !validationMessages[key] && !isDuplicateUser;
  };

  const getFieldIcon = () => {
    const key = currentFieldData.key;
    if (validationMessages[key] && !validationMessages[key].includes('✅') && !validationMessages[key].includes('Validando')) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    if (validationMessages[key] && validationMessages[key].includes('✅')) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return null;
  };

  if (otpSent && !data.otpVerified) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-3xl">📱</span>
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Ya casi terminamos!
          </h3>
          <p className="text-gray-600 mb-6">
            Ingresa el código de 4 dígitos que enviamos a tu celular <br/>
            <span className="font-semibold text-emerald-600">{data.phone}</span>
          </p>
          
          <div className="mb-6">
            <InputOTP value={otp} onChange={setOtp} maxLength={4}>
              <InputOTPGroup className="justify-center">
                <InputOTPSlot index={0} className="w-14 h-14 text-xl" />
                <InputOTPSlot index={1} className="w-14 h-14 text-xl" />
                <InputOTPSlot index={2} className="w-14 h-14 text-xl" />
                <InputOTPSlot index={3} className="w-14 h-14 text-xl" />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          {validationMessages.otp && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm mb-4 ${
                validationMessages.otp.includes('correctamente') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {validationMessages.otp}
            </motion.p>
          )}
          
          <Button 
            onClick={verifyOTP} 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
            disabled={otp.length !== 4}
          >
            {otp.length === 4 ? '¡Verificar! 🚀' : 'Ingresa el código'}
          </Button>
          
          <p className="text-xs text-gray-500 mt-4">
            💡 Código de prueba: 1234 o 0000
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Mensaje motivacional dinámico */}
      <motion.div
        key={`motivation-${currentField}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
          className="text-4xl mb-3"
        >
          {currentFieldData.emoji}
        </motion.div>
        <motion.p 
          className="text-xl text-gray-700 font-medium leading-relaxed"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {currentFieldData.motivationalText}
        </motion.p>
        {data.firstName && currentField > 0 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-emerald-600 font-semibold mt-2"
          >
            ¡Vamos muy bien, {data.firstName}! 💪
          </motion.p>
        )}
      </motion.div>

      {/* Progreso visual mejorado */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-3">
          {fields.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentField ? 1.3 : 1,
                backgroundColor: index <= currentField ? '#10b981' : '#e5e7eb',
                boxShadow: index === currentField ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none'
              }}
              className="w-4 h-4 rounded-full transition-all duration-300"
            />
          ))}
        </div>
      </div>

      {/* Campo actual mejorado */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`field-${currentField}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <Label 
                  htmlFor={currentFieldData.key} 
                  className="text-lg font-semibold text-gray-700 mb-3 block"
                >
                  {currentFieldData.label}
                </Label>
                
                <div className="relative">
                  <Input
                    id={currentFieldData.key}
                    type={currentFieldData.key === 'birthDate' ? 'date' : 'text'}
                    value={data[currentFieldData.key as keyof PersonalData] as string}
                    onChange={(e) => handleFieldUpdate(e.target.value)}
                    placeholder={currentFieldData.placeholder}
                    className="text-lg py-6 pr-12 border-2 border-gray-200 focus:border-emerald-500 transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && canProceed() && nextField()}
                    disabled={isValidating}
                  />
                  {getFieldIcon() && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getFieldIcon()}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mensajes de validación mejorados */}
              {validationMessages[currentFieldData.key] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 p-3 rounded-lg text-sm ${
                    validationMessages[currentFieldData.key].includes('✅') || 
                    validationMessages[currentFieldData.key].includes('correctamente')
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : validationMessages[currentFieldData.key].includes('Validando')
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {validationMessages[currentFieldData.key]}
                </motion.div>
              )}
              
              {/* Indicador de validación RENIEC */}
              {isValidating && currentFieldData.key === 'dni' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    Consultando base de datos RENIEC...
                  </span>
                </motion.div>
              )}
              
              {/* Botón especial para usuarios duplicados */}
              {isDuplicateUser && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200"
                >
                  <p className="text-amber-800 mb-3">
                    ¡Parece que ya tienes un registro! ¿Quieres continuar desde donde lo dejaste?
                  </p>
                  <Button
                    onClick={handleContinueWithExisting}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    Sí, continuar con mi registro anterior 📋
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Botones de navegación mejorados */}
          <div className="flex gap-4 mt-8">
            {currentField > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentField(prev => prev - 1)}
                className="flex-1 py-6 text-lg border-2"
              >
                ← Anterior
              </Button>
            )}
            
            <Button
              onClick={nextField}
              disabled={!canProceed() || isValidating}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-lg py-6 shadow-lg"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Validando...
                </>
              ) : currentField === fields.length - 1 ? (
                '¡Verificar celular! 📱'
              ) : (
                'Continuar →'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Indicador de progreso textual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-6 text-sm text-gray-500"
      >
        Paso {currentField + 1} de {fields.length} • Datos personales
      </motion.div>
    </div>
  );
};
