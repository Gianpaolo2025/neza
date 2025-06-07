
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

interface PersonalData {
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  isValidated: boolean;
  otpVerified: boolean;
}

interface PersonalDataStepProps {
  data: PersonalData;
  onUpdate: (data: PersonalData) => void;
  onNext: () => void;
  onPrev?: () => void;
  isReturningUser?: boolean;
}

export const PersonalDataStep = ({ data, onUpdate, onNext, onPrev, isReturningUser }: PersonalDataStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.firstName.trim()) newErrors.firstName = "Nombre es requerido";
    if (!data.lastName.trim()) newErrors.lastName = "Apellido es requerido";
    if (!data.dni.trim() || data.dni.length !== 8) newErrors.dni = "DNI debe tener 8 dígitos";
    if (!data.email.trim() || !data.email.includes('@')) newErrors.email = "Email válido es requerido";
    if (!data.phone.trim() || data.phone.length < 9) newErrors.phone = "Teléfono debe tener al menos 9 dígitos";
    if (!data.birthDate) newErrors.birthDate = "Fecha de nacimiento es requerida";
    if (!data.address.trim()) newErrors.address = "Dirección es requerida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate({ ...data, isValidated: true, otpVerified: true });
      onNext();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl mb-4"
        >
          👤
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Datos Personales
        </h2>
        <p className="text-lg text-slate-700">
          {isReturningUser ? "Actualiza tus datos si es necesario" : "Necesitamos conocerte mejor para encontrar las mejores opciones financieras"}
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Nombres */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <Label className="text-lg font-medium text-slate-700">
                Nombres *
              </Label>
            </div>
            <Input
              value={data.firstName}
              onChange={(e) => onUpdate({ ...data, firstName: e.target.value })}
              placeholder="Ej: Juan Carlos"
              className={`text-lg py-6 ${errors.firstName ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-2">{errors.firstName}</p>
            )}
          </CardContent>
        </Card>

        {/* Apellidos */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <Label className="text-lg font-medium text-slate-700">
                Apellidos *
              </Label>
            </div>
            <Input
              value={data.lastName}
              onChange={(e) => onUpdate({ ...data, lastName: e.target.value })}
              placeholder="Ej: Pérez García"
              className={`text-lg py-6 ${errors.lastName ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-2">{errors.lastName}</p>
            )}
          </CardContent>
        </Card>

        {/* DNI */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <Label className="text-lg font-medium text-slate-700">
                DNI *
              </Label>
            </div>
            <Input
              value={data.dni}
              onChange={(e) => onUpdate({ ...data, dni: e.target.value.replace(/\D/g, '').slice(0, 8) })}
              placeholder="12345678"
              maxLength={8}
              className={`text-lg py-6 ${errors.dni ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
            />
            {errors.dni && (
              <p className="text-red-500 text-sm mt-2">{errors.dni}</p>
            )}
          </CardContent>
        </Card>

        {/* Fecha de nacimiento */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <Label className="text-lg font-medium text-slate-700">
                Fecha de Nacimiento *
              </Label>
            </div>
            <Input
              type="date"
              value={data.birthDate}
              onChange={(e) => onUpdate({ ...data, birthDate: e.target.value })}
              className={`text-lg py-6 ${errors.birthDate ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.birthDate && (
              <p className="text-red-500 text-sm mt-2">{errors.birthDate}</p>
            )}
          </CardContent>
        </Card>

        {/* Email */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-blue-600" />
              <Label className="text-lg font-medium text-slate-700">
                Correo Electrónico *
              </Label>
            </div>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => onUpdate({ ...data, email: e.target.value })}
              placeholder="juan@ejemplo.com"
              className={`text-lg py-6 ${errors.email ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </CardContent>
        </Card>

        {/* Teléfono */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-5 h-5 text-blue-600" />
              <Label className="text-lg font-medium text-slate-700">
                Teléfono *
              </Label>
            </div>
            <Input
              value={data.phone}
              onChange={(e) => onUpdate({ ...data, phone: e.target.value.replace(/\D/g, '').slice(0, 9) })}
              placeholder="987654321"
              maxLength={9}
              className={`text-lg py-6 ${errors.phone ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dirección completa */}
      <Card className="border-blue-200 bg-white/80 mt-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <Label className="text-lg font-medium text-slate-700">
              Dirección Completa *
            </Label>
          </div>
          <Input
            value={data.address}
            onChange={(e) => onUpdate({ ...data, address: e.target.value })}
            placeholder="Av. Ejemplo 123, Distrito, Provincia, Departamento"
            className={`text-lg py-6 ${errors.address ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-2">{errors.address}</p>
          )}
        </CardContent>
      </Card>

      {/* Botones de navegación */}
      <div className="flex gap-4 mt-8">
        {onPrev && (
          <Button 
            variant="outline" 
            onClick={onPrev} 
            className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            Anterior
          </Button>
        )}
        <Button 
          onClick={handleNext} 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
