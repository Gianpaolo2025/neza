
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, Shield, User, Mail, Phone, IdCard } from "lucide-react";

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
  const [validationStatus, setValidationStatus] = useState<{
    dni: 'pending' | 'validating' | 'valid' | 'invalid';
    email: 'pending' | 'valid' | 'invalid';
    phone: 'pending' | 'valid' | 'invalid';
  }>({
    dni: 'pending',
    email: 'pending',
    phone: 'pending'
  });

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');

  // Simulate DNI validation
  const validateDNI = async (dni: string) => {
    if (dni.length !== 8) return;
    
    setValidationStatus(prev => ({ ...prev, dni: 'validating' }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock validation (in real app, call actual API)
    const isValid = /^[0-9]{8}$/.test(dni);
    setValidationStatus(prev => ({ ...prev, dni: isValid ? 'valid' : 'invalid' }));
    
    if (isValid) {
      onUpdate({ ...data, isValidated: true });
    }
  };

  const validateEmail = (email: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setValidationStatus(prev => ({ ...prev, email: isValid ? 'valid' : 'invalid' }));
  };

  const validatePhone = (phone: string) => {
    const isValid = /^9[0-9]{8}$/.test(phone);
    setValidationStatus(prev => ({ ...prev, phone: isValid ? 'valid' : 'invalid' }));
  };

  const handleFieldChange = (field: keyof PersonalData, value: string) => {
    const updatedData = { ...data, [field]: value };
    onUpdate(updatedData);

    // Trigger validations
    if (field === 'dni' && value.length === 8) {
      validateDNI(value);
    }
    if (field === 'email') {
      validateEmail(value);
    }
    if (field === 'phone') {
      validatePhone(value);
    }
  };

  const sendOTP = () => {
    if (validationStatus.phone === 'valid') {
      setShowOTP(true);
      // Simulate sending OTP
    }
  };

  const verifyOTP = () => {
    if (otp === '123456') { // Mock OTP
      onUpdate({ ...data, otpVerified: true });
      setShowOTP(false);
    }
  };

  const canProceed = data.firstName && data.lastName && validationStatus.dni === 'valid' && 
                    validationStatus.email === 'valid' && validationStatus.phone === 'valid' && data.otpVerified;

  const inputFields = [
    {
      key: 'firstName',
      label: 'Nombres',
      placeholder: 'Ingresa tus nombres',
      icon: User,
      type: 'text'
    },
    {
      key: 'lastName',
      label: 'Apellidos',
      placeholder: 'Ingresa tus apellidos',
      icon: User,
      type: 'text'
    },
    {
      key: 'dni',
      label: 'Documento Nacional de Identidad',
      placeholder: '12345678',
      icon: IdCard,
      type: 'text',
      maxLength: 8
    },
    {
      key: 'email',
      label: 'Correo Electrónico',
      placeholder: 'ejemplo@correo.com',
      icon: Mail,
      type: 'email'
    },
    {
      key: 'phone',
      label: 'Número de Celular',
      placeholder: '987654321',
      icon: Phone,
      type: 'tel',
      maxLength: 9
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-4">
          {isReturningUser ? "¡Hola de nuevo!" : "¡Empecemos!"}
        </h2>
        <p className="text-lg text-slate-600">
          {isReturningUser ? 
            "Verifica que tus datos estén actualizados" : 
            "Ingresa tus datos personales de forma segura"
          }
        </p>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full inline-flex">
          <Shield className="w-4 h-4" />
          <span>Información 100% segura y encriptada</span>
        </div>
      </motion.div>

      <Card className="shadow-xl border-0 bg-gradient-to-b from-white to-gray-50">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-slate-800">Datos Personales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {inputFields.map((field, index) => {
            const Icon = field.icon;
            const fieldKey = field.key as keyof PersonalData;
            const value = data[fieldKey] as string;
            
            let status = 'default';
            if (field.key === 'dni') status = validationStatus.dni;
            if (field.key === 'email') status = validationStatus.email;
            if (field.key === 'phone') status = validationStatus.phone;

            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor={field.key} className="text-slate-700 font-medium flex items-center gap-2">
                  <Icon className="w-4 h-4 text-blue-600" />
                  {field.label}
                </Label>
                
                <div className="relative">
                  <Input
                    id={field.key}
                    type={field.type}
                    value={value}
                    onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    className={`
                      pl-12 pr-12 h-12 text-lg border-2 transition-all duration-300
                      ${status === 'valid' ? 'border-green-400 bg-green-50' : ''}
                      ${status === 'invalid' ? 'border-red-400 bg-red-50' : ''}
                      ${status === 'validating' ? 'border-blue-400 bg-blue-50' : ''}
                      ${status === 'default' ? 'border-slate-200 focus:border-blue-400' : ''}
                    `}
                  />
                  
                  {/* Icon */}
                  <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  
                  {/* Status indicator */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {status === 'valid' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {status === 'invalid' && <AlertCircle className="w-5 h-5 text-red-500" />}
                    {status === 'validating' && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                      />
                    )}
                  </div>
                </div>

                {/* Status messages */}
                {status === 'invalid' && field.key === 'dni' && (
                  <p className="text-sm text-red-600">DNI inválido. Debe tener 8 dígitos.</p>
                )}
                {status === 'invalid' && field.key === 'email' && (
                  <p className="text-sm text-red-600">Formato de correo inválido.</p>
                )}
                {status === 'invalid' && field.key === 'phone' && (
                  <p className="text-sm text-red-600">Debe empezar con 9 y tener 9 dígitos.</p>
                )}
                {status === 'validating' && field.key === 'dni' && (
                  <p className="text-sm text-blue-600">Validando DNI con RENIEC...</p>
                )}
              </motion.div>
            );
          })}

          {/* OTP Verification */}
          {validationStatus.phone === 'valid' && !data.otpVerified && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t pt-6 mt-6"
            >
              <div className="text-center">
                <h3 className="font-semibold text-slate-800 mb-2">Verificación de Celular</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Te enviaremos un código para verificar tu número
                </p>
                
                {!showOTP ? (
                  <Button 
                    onClick={sendOTP}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Enviar código de verificación
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Ingresa el código (123456)"
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                    <Button 
                      onClick={verifyOTP}
                      disabled={otp.length !== 6}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Verificar código
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Continue button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-6"
          >
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className={`
                w-full h-14 text-lg font-semibold transition-all duration-300
                ${canProceed 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl' 
                  : 'bg-slate-300 cursor-not-allowed'
                }
              `}
            >
              {canProceed ? '¡Continuar con información financiera! 💰' : 'Completa todos los campos'}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};
