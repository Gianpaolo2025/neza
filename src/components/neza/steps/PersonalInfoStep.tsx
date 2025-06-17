
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, FileText, Calendar, Mail, Phone, AlertCircle } from "lucide-react";
import { DateSelector } from "../components/DateSelector";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  birthDate: string;
}

interface PersonalInfoStepProps {
  personalInfo: PersonalInfo;
  onPersonalInfoChange: (field: keyof PersonalInfo, value: string) => void;
  onBirthDateChange: (type: 'year' | 'month' | 'day', value: string) => void;
  validationErrors: Record<string, string>;
  calculateAge: (birthDate: string) => number;
}

export const PersonalInfoStep = ({ 
  personalInfo, 
  onPersonalInfoChange, 
  onBirthDateChange,
  validationErrors,
  calculateAge 
}: PersonalInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium text-slate-700 mb-3 block">
          📝 Información Personal Básica
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="flex items-center gap-2 text-slate-700 mb-2">
            <User className="w-4 h-4" />
            Nombres *
          </Label>
          <Input
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) => onPersonalInfoChange('firstName', e.target.value)}
            placeholder="Ej: Juan Carlos"
            className={`border-blue-300 focus:border-blue-500 ${validationErrors.firstName ? 'border-red-500' : ''}`}
          />
          {validationErrors.firstName && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
              <AlertCircle className="w-4 h-4" />
              {validationErrors.firstName}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="lastName" className="flex items-center gap-2 text-slate-700 mb-2">
            <User className="w-4 h-4" />
            Apellidos *
          </Label>
          <Input
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) => onPersonalInfoChange('lastName', e.target.value)}
            placeholder="Ej: Pérez García"
            className={`border-blue-300 focus:border-blue-500 ${validationErrors.lastName ? 'border-red-500' : ''}`}
          />
          {validationErrors.lastName && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
              <AlertCircle className="w-4 h-4" />
              {validationErrors.lastName}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="dni" className="flex items-center gap-2 text-slate-700 mb-2">
            <FileText className="w-4 h-4" />
            DNI *
          </Label>
          <Input
            id="dni"
            value={personalInfo.dni}
            onChange={(e) => onPersonalInfoChange('dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="12345678"
            maxLength={8}
            className={`border-blue-300 focus:border-blue-500 ${validationErrors.dni ? 'border-red-500' : ''}`}
          />
          {validationErrors.dni && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
              <AlertCircle className="w-4 h-4" />
              {validationErrors.dni}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <DateSelector
            birthDate={personalInfo.birthDate}
            onBirthDateChange={onBirthDateChange}
            validationError={validationErrors.birthDate}
            calculateAge={calculateAge}
            isOptional={true}
          />
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 mb-2">
            <Mail className="w-4 h-4" />
            Correo Electrónico *
          </Label>
          <Input
            id="email"
            type="email"
            value={personalInfo.email}
            onChange={(e) => onPersonalInfoChange('email', e.target.value)}
            placeholder="juan@ejemplo.com"
            className={`border-blue-300 focus:border-blue-500 ${validationErrors.email ? 'border-red-500' : ''}`}
          />
          {validationErrors.email && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
              <AlertCircle className="w-4 h-4" />
              {validationErrors.email}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700 mb-2">
            <Phone className="w-4 h-4" />
            Teléfono *
          </Label>
          <Input
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => onPersonalInfoChange('phone', e.target.value.replace(/\D/g, '').slice(0, 9))}
            placeholder="987654321"
            maxLength={9}
            className={`border-blue-300 focus:border-blue-500 ${validationErrors.phone ? 'border-red-500' : ''}`}
          />
          {validationErrors.phone && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
              <AlertCircle className="w-4 h-4" />
              {validationErrors.phone}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
