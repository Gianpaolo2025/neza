
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";

interface PersonalData {
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  workYears: number;
  workMonths: number;
  preferredCurrency: string;
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

  const occupationOptions = [
    "Empleado público",
    "Empleado privado",
    "Médico",
    "Abogado",
    "Ingeniero",
    "Contador",
    "Profesor/Docente",
    "Comerciante",
    "Empresario",
    "Trabajador independiente",
    "Jubilado/Pensionista",
    "Estudiante",
    "Otro"
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.firstName.trim()) newErrors.firstName = "Nombre es requerido";
    if (!data.lastName.trim()) newErrors.lastName = "Apellido es requerido";
    if (!data.dni.trim() || data.dni.length !== 8) newErrors.dni = "DNI debe tener 8 dígitos";
    if (!data.email.trim() || !data.email.includes('@')) newErrors.email = "Email válido es requerido";
    if (!data.phone.trim() || data.phone.length < 9) newErrors.phone = "Teléfono debe tener al menos 9 dígitos";
    if (!data.birthDate) newErrors.birthDate = "Fecha de nacimiento es requerida";
    if (!data.address.trim()) newErrors.address = "Dirección es requerida";
    if (!data.occupation) newErrors.occupation = "Ocupación es requerida";
    if (!data.preferredCurrency) newErrors.preferredCurrency = "Moneda preferida es requerida";

    // Validar años de trabajo (máximo 40)
    if (data.workYears > 40) newErrors.workYears = "Máximo 40 años de experiencia";
    if (data.workMonths > 11) newErrors.workMonths = "Máximo 11 meses";

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
    <div className="max-w-4xl mx-auto px-4">
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
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-4">
          Datos Personales
        </h2>
        <p className="text-base md:text-lg text-slate-700 mb-4">
          {isReturningUser ? "Actualiza tus datos si es necesario" : "Necesitamos conocerte mejor para encontrar las mejores opciones financieras"}
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <strong>📍 Importante:</strong> No nos mientas. Mientras más precisa sea tu información, más rápido podremos ofrecerte tu mejor alternativa bancaria.
        </div>
      </motion.div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        {/* Nombres */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <Label className="text-base md:text-lg font-medium text-slate-700">
                Nombres *
              </Label>
            </div>
            <Input
              value={data.firstName}
              onChange={(e) => onUpdate({ ...data, firstName: e.target.value })}
              placeholder="Ej: Juan Carlos"
              className={`text-base md:text-lg py-4 md:py-6 ${errors.firstName ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-2">{errors.firstName}</p>
            )}
          </CardContent>
        </Card>

        {/* Apellidos */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <Label className="text-base md:text-lg font-medium text-slate-700">
                Apellidos *
              </Label>
            </div>
            <Input
              value={data.lastName}
              onChange={(e) => onUpdate({ ...data, lastName: e.target.value })}
              placeholder="Ej: Pérez García"
              className={`text-base md:text-lg py-4 md:py-6 ${errors.lastName ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-2">{errors.lastName}</p>
            )}
          </CardContent>
        </Card>

        {/* DNI */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <Label className="text-base md:text-lg font-medium text-slate-700">
                DNI *
              </Label>
            </div>
            <Input
              value={data.dni}
              onChange={(e) => onUpdate({ ...data, dni: e.target.value.replace(/\D/g, '').slice(0, 8) })}
              placeholder="12345678"
              maxLength={8}
              className={`text-base md:text-lg py-4 md:py-6 ${errors.dni ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
            />
            {errors.dni && (
              <p className="text-red-500 text-sm mt-2">{errors.dni}</p>
            )}
          </CardContent>
        </Card>

        {/* Fecha de nacimiento */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <Label className="text-base md:text-lg font-medium text-slate-700">
                Fecha de Nacimiento *
              </Label>
            </div>
            <Input
              type="date"
              value={data.birthDate}
              onChange={(e) => onUpdate({ ...data, birthDate: e.target.value })}
              className={`text-base md:text-lg py-4 md:py-6 ${errors.birthDate ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.birthDate && (
              <p className="text-red-500 text-sm mt-2">{errors.birthDate}</p>
            )}
          </CardContent>
        </Card>

        {/* Email */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-5 h-5 text-blue-600" />
              <Label className="text-base md:text-lg font-medium text-slate-700">
                Correo Electrónico *
              </Label>
            </div>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => onUpdate({ ...data, email: e.target.value })}
              placeholder="juan@ejemplo.com"
              className={`text-base md:text-lg py-4 md:py-6 ${errors.email ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </CardContent>
        </Card>

        {/* Teléfono */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-5 h-5 text-blue-600" />
              <Label className="text-base md:text-lg font-medium text-slate-700">
                Teléfono *
              </Label>
            </div>
            <Input
              value={data.phone}
              onChange={(e) => onUpdate({ ...data, phone: e.target.value.replace(/\D/g, '').slice(0, 9) })}
              placeholder="987654321"
              maxLength={9}
              className={`text-base md:text-lg py-4 md:py-6 ${errors.phone ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
            )}
          </CardContent>
        </Card>

        {/* Ocupación */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <Label className="text-base md:text-lg font-medium text-slate-700">
                Ocupación *
              </Label>
            </div>
            <Select onValueChange={(value) => onUpdate({ ...data, occupation: value })}>
              <SelectTrigger className={`text-base md:text-lg py-4 md:py-6 ${errors.occupation ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}>
                <SelectValue placeholder="Selecciona tu ocupación" />
              </SelectTrigger>
              <SelectContent>
                {occupationOptions.map((occupation) => (
                  <SelectItem key={occupation} value={occupation}>
                    {occupation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.occupation && (
              <p className="text-red-500 text-sm mt-2">{errors.occupation}</p>
            )}
          </CardContent>
        </Card>

        {/* Experiencia Laboral */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <Label className="text-base md:text-lg font-medium text-slate-700">
                Experiencia Laboral *
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  value={data.workYears || ""}
                  onChange={(e) => onUpdate({ ...data, workYears: Number(e.target.value) })}
                  placeholder="Años"
                  min="0"
                  max="40"
                  className={`text-base py-3 ${errors.workYears ? 'border-red-500' : 'border-blue-300'}`}
                />
                <span className="text-xs text-gray-500">Años (máx. 40)</span>
              </div>
              <div>
                <Input
                  type="number"
                  value={data.workMonths || ""}
                  onChange={(e) => onUpdate({ ...data, workMonths: Number(e.target.value) })}
                  placeholder="Meses"
                  min="0"
                  max="11"
                  className={`text-base py-3 ${errors.workMonths ? 'border-red-500' : 'border-blue-300'}`}
                />
                <span className="text-xs text-gray-500">Meses (máx. 11)</span>
              </div>
            </div>
            {(errors.workYears || errors.workMonths) && (
              <p className="text-red-500 text-sm mt-2">{errors.workYears || errors.workMonths}</p>
            )}
          </CardContent>
        </Card>

        {/* Moneda Preferida */}
        <Card className="border-blue-200 bg-white/80">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">💰</span>
              <Label className="text-base md:text-lg font-medium text-slate-700">
                Moneda Preferida *
              </Label>
            </div>
            <Select onValueChange={(value) => onUpdate({ ...data, preferredCurrency: value })}>
              <SelectTrigger className={`text-base md:text-lg py-4 md:py-6 ${errors.preferredCurrency ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}>
                <SelectValue placeholder="Selecciona la moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PEN">S/. Soles Peruanos</SelectItem>
                <SelectItem value="USD">$ Dólares Americanos</SelectItem>
              </SelectContent>
            </Select>
            {errors.preferredCurrency && (
              <p className="text-red-500 text-sm mt-2">{errors.preferredCurrency}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dirección completa */}
      <Card className="border-blue-200 bg-white/80 mt-4 md:mt-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <Label className="text-base md:text-lg font-medium text-slate-700">
              Dirección Completa *
            </Label>
          </div>
          <Input
            value={data.address}
            onChange={(e) => onUpdate({ ...data, address: e.target.value })}
            placeholder="Av. Ejemplo 123, Distrito, Provincia, Departamento"
            className={`text-base md:text-lg py-4 md:py-6 ${errors.address ? 'border-red-500' : 'border-blue-300'} focus:border-blue-500`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-2">{errors.address}</p>
          )}
        </CardContent>
      </Card>

      {/* Botones de navegación */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-8">
        {onPrev && (
          <Button 
            variant="outline" 
            onClick={onPrev} 
            className="w-full md:flex-1 border-blue-300 text-blue-700 hover:bg-blue-50 py-3 md:py-4"
          >
            Anterior
          </Button>
        )}
        <Button 
          onClick={handleNext} 
          className="w-full md:flex-1 bg-blue-600 hover:bg-blue-700 py-3 md:py-4 text-base md:text-lg"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
