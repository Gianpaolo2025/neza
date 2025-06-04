
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2, Sparkles, Heart } from "lucide-react";
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

  const fields = [
    { key: 'firstName', label: 'Nombres', placeholder: 'Juan Carlos', emoji: '👋' },
    { key: 'lastName', label: 'Apellidos', placeholder: 'García López', emoji: '✨' },
    { key: 'dni', label: 'DNI', placeholder: '12345678', emoji: '🆔' },
    { key: 'birthDate', label: 'Fecha de nacimiento', placeholder: '1990-01-15', emoji: '🎂' },
    { key: 'email', label: 'Correo electrónico', placeholder: 'juan@email.com', emoji: '📧' },
    { key: 'phone', label: 'Número de celular', placeholder: '987654321', emoji: '📱' }
  ];

  const currentFieldData = fields[currentField];

  const validateField = (key: string, value: string): boolean => {
    switch (key) {
      case 'dni':
        if (!/^\d{8}$/.test(value)) {
          setValidationMessages(prev => ({ ...prev, [key]: 'El DNI debe tener 8 dígitos' }));
          return false;
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setValidationMessages(prev => ({ ...prev, [key]: 'Formato de correo inválido' }));
          return false;
        }
        break;
      case 'phone':
        if (!/^9\d{8}$/.test(value)) {
          setValidationMessages(prev => ({ ...prev, [key]: 'El celular debe empezar con 9 y tener 9 dígitos' }));
          return false;
        }
        break;
      case 'birthDate':
        const date = new Date(value);
        const age = new Date().getFullYear() - date.getFullYear();
        if (age < 18 || age > 80) {
          setValidationMessages(prev => ({ ...prev, [key]: 'Debes tener entre 18 y 80 años' }));
          return false;
        }
        break;
    }
    
    setValidationMessages(prev => ({ ...prev, [key]: '' }));
    return true;
  };

  const simulateReniecValidation = async (dni: string): Promise<boolean> => {
    setIsValidating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsValidating(false);
    return dni.length === 8; // Simulación simple
  };

  const sendOTP = async () => {
    setOtpSent(true);
    // Simular envío de OTP
    console.log(`OTP enviado a ${data.phone}`);
  };

  const verifyOTP = () => {
    if (otp === "1234") { // OTP simulado
      onUpdate({ ...data, otpVerified: true });
      setValidationMessages(prev => ({ ...prev, otp: '¡Verificado! 🎉' }));
      setTimeout(() => onNext(), 1000);
    } else {
      setValidationMessages(prev => ({ ...prev, otp: 'Código incorrecto' }));
    }
  };

  const handleFieldUpdate = (value: string) => {
    const key = currentFieldData.key as keyof PersonalData;
    onUpdate({ ...data, [key]: value });
  };

  const nextField = async () => {
    const key = currentFieldData.key as keyof PersonalData;
    const value = data[key] as string;
    
    if (!value.trim()) return;
    
    if (!validateField(key, value)) return;

    // Validación especial para DNI
    if (key === 'dni') {
      const isValid = await simulateReniecValidation(value);
      if (isValid) {
        onUpdate({ ...data, isValidated: true });
        setValidationMessages(prev => ({ ...prev, dni: '¡DNI validado con RENIEC! ✅' }));
      } else {
        setValidationMessages(prev => ({ ...prev, dni: 'DNI no encontrado en RENIEC' }));
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
    return value.trim().length > 0 && !validationMessages[key];
  };

  const getMotivationalMessage = () => {
    const messages = [
      `¡Hola! Me encanta conocerte 😊`,
      `¡Perfecto, ${data.firstName}! Sigamos...`,
      `Excelente, necesito validar tu identidad 🔒`,
      `¡Genial! Ya casi te conozco completamente`,
      `Tu correo es importante para mantenerte informado 📨`,
      `¡Último paso! Confirmemos tu celular 📱`
    ];
    return messages[currentField] || "¡Casi listo!";
  };

  if (otpSent && !data.otpVerified) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-2xl">📱</span>
          </motion.div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            ¡Código enviado!
          </h3>
          <p className="text-gray-600 mb-6">
            Ingresa el código de 4 dígitos que enviamos a {data.phone}
          </p>
          
          <div className="mb-6">
            <InputOTP value={otp} onChange={setOtp} maxLength={4}>
              <InputOTPGroup className="justify-center">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          
          {validationMessages.otp && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm mb-4 ${
                validationMessages.otp.includes('Verificado') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {validationMessages.otp}
            </motion.p>
          )}
          
          <Button 
            onClick={verifyOTP} 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={otp.length !== 4}
          >
            Verificar código
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Mensaje motivacional */}
      <motion.div
        key={currentField}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-3xl mb-2"
        >
          {currentFieldData.emoji}
        </motion.div>
        <p className="text-lg text-gray-700 font-medium">
          {getMotivationalMessage()}
        </p>
      </motion.div>

      {/* Progreso de campos */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2">
          {fields.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentField ? 1.2 : 1,
                backgroundColor: index <= currentField ? '#10b981' : '#e5e7eb'
              }}
              className="w-3 h-3 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Campo actual */}
      <Card>
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentField}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Label htmlFor={currentFieldData.key} className="text-lg font-medium text-gray-700">
                {currentFieldData.label}
              </Label>
              
              <Input
                id={currentFieldData.key}
                type={currentFieldData.key === 'birthDate' ? 'date' : 'text'}
                value={data[currentFieldData.key as keyof PersonalData] as string}
                onChange={(e) => handleFieldUpdate(e.target.value)}
                placeholder={currentFieldData.placeholder}
                className="mt-3 text-lg py-6"
                onKeyPress={(e) => e.key === 'Enter' && canProceed() && nextField()}
              />
              
              {/* Validación en tiempo real */}
              {validationMessages[currentFieldData.key] && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-sm mt-2 ${
                    validationMessages[currentFieldData.key].includes('✅') || 
                    validationMessages[currentFieldData.key].includes('validado')
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}
                >
                  {validationMessages[currentFieldData.key]}
                </motion.p>
              )}
              
              {/* Validación RENIEC en progreso */}
              {isValidating && currentFieldData.key === 'dni' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 mt-3 text-blue-600"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Validando con RENIEC...</span>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="flex gap-3 mt-6">
            {currentField > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentField(prev => prev - 1)}
                className="flex-1"
              >
                Anterior
              </Button>
            )}
            
            <Button
              onClick={nextField}
              disabled={!canProceed() || isValidating}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {isValidating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : currentField === fields.length - 1 ? (
                'Verificar celular'
              ) : (
                'Continuar'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
