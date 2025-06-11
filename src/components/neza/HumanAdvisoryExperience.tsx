import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, ArrowRight, User, Briefcase, DollarSign, Lightbulb, FileText, Calendar, Phone, MapPin, Mail, ChevronRight, Target, School, Building, Zap, AlertCircle } from "lucide-react";
import { InteractiveTutorial } from "./InteractiveTutorial";
import { userTrackingService } from "@/services/userTracking";

interface HumanAdvisoryExperienceProps {
  onComplete: (data: any) => void;
  onBack: () => void;
  forceFlow?: boolean;
  isReturningUser?: boolean;
}

interface FormData {
  goal: string;
  amount: number;
  workSituation: string;
  workDetails: string;
  hasPayslips: string;
  monthlyIncome: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    phone: string;
    birthDate: string;
  };
  preferredBank: string;
  documents: {
    dni: File | null;
    payslips: File | null;
    others: File | null;
  };
  // Campos adicionales para diferentes tipos de trabajo
  carrera?: string;
  ciclo?: string;
  hacePracticas?: string;
  empresaPracticas?: string;
  empresaTrabajo?: string;
  nombreNegocio?: string;
  rubroNegocio?: string;
  actividadPrincipal?: string;
  trabajoEnPlanilla?: string;
  otroTrabajo?: string;
}

export const HumanAdvisoryExperience = ({ onComplete, onBack, forceFlow = false, isReturningUser = false }: HumanAdvisoryExperienceProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTutorial, setShowTutorial] = useState(false);
  const [uploadedPayslips, setUploadedPayslips] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<FormData>({
    goal: "",
    amount: 0,
    workSituation: "",
    workDetails: "",
    hasPayslips: "",
    monthlyIncome: 0,
    personalInfo: {
      firstName: "",
      lastName: "",
      dni: "",
      email: "",
      phone: "",
      birthDate: ""
    },
    preferredBank: "",
    documents: {
      dni: null,
      payslips: null,
      others: null
    }
  });

  // Check for returning user and load their data
  useEffect(() => {
    const savedEmail = localStorage.getItem('nezaUserEmail');
    const savedData = localStorage.getItem('nezaPersonalData');
    
    if (savedEmail && savedData && isReturningUser) {
      try {
        const parsedData = JSON.parse(savedData);
        // Pre-fill data for returning user
        setData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            ...parsedData
          }
        }));
        console.log('Datos precargados para usuario que regresa:', parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    } else {
      // Clear all data for new user
      console.log('HumanAdvisoryExperience: Clearing all user data for new user');
      localStorage.removeItem('nezaUserData');
      localStorage.removeItem('nezaPersonalData');
      localStorage.removeItem('nezaHumanAdvisoryData');
      localStorage.removeItem('nezaUserEmail');
      setUploadedPayslips([]);
    }
  }, [isReturningUser]);

  // Save user to admin when step 2 (personal data) is completed
  const saveUserToAdmin = (personalData: any) => {
    const adminUsers = JSON.parse(localStorage.getItem('nezaAdminUsers') || '[]');
    
    const userRecord = {
      id: Date.now().toString(),
      fullName: `${personalData.firstName} ${personalData.lastName}`,
      dni: personalData.dni,
      email: personalData.email,
      birthDate: personalData.birthDate || '',
      phone: personalData.phone,
      monthlyIncome: data.monthlyIncome || 0,
      requestedAmount: data.amount || 0,
      productType: data.goal || 'Sin especificar',
      employmentType: data.workSituation || 'Sin especificar',
      workDetails: data.workDetails || '',
      documents: {
        dni: data.documents?.dni ? data.documents.dni.name : null,
        payslips: data.documents?.payslips ? data.documents.payslips.name : null,
        others: data.documents?.others ? data.documents.others.name : null
      },
      processStatus: 'Datos personales completados',
      currentStep: 'Paso 2 completado',
      registrationDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };

    // Check if user already exists (by email)
    const existingUserIndex = adminUsers.findIndex((user: any) => user.email === personalData.email);
    
    if (existingUserIndex >= 0) {
      // Update existing user
      adminUsers[existingUserIndex] = { ...adminUsers[existingUserIndex], ...userRecord, lastUpdate: new Date().toISOString() };
      console.log('Usuario actualizado en admin:', personalData.email);
    } else {
      // Add new user to the array
      adminUsers.push(userRecord);
      console.log('Nuevo usuario guardado en admin:', personalData.email);
    }
    
    // Save updated array back to localStorage
    localStorage.setItem('nezaAdminUsers', JSON.stringify(adminUsers));
    console.log('Total usuarios en admin:', adminUsers.length);
  };

  const steps = [
    {
      number: 1,
      title: "¿Qué buscas hoy?",
      description: "Cuéntanos tu objetivo financiero",
      icon: Target,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: 2,
      title: "Datos Personales",
      description: "Información básica y contacto",
      icon: User,
      color: "from-green-500 to-green-600"
    },
    {
      number: 3,
      title: "Monto del Préstamo",
      description: "¿Cuánto necesitas?",
      icon: DollarSign,
      color: "from-purple-500 to-purple-600"
    },
    {
      number: 4,
      title: "Situación Laboral",
      description: "Tu trabajo e ingresos",
      icon: Briefcase,
      color: "from-orange-500 to-orange-600"
    },
    {
      number: 5,
      title: "Documentos",
      description: "Sube tus documentos",
      icon: FileText,
      color: "from-red-500 to-red-600"
    }
  ];

  // Función para calcular la edad
  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};
    
    if (currentStep === 1) { // Goal step
      if (!data.goal) errors.goal = "Debes seleccionar un producto financiero";
    }
    
    if (currentStep === 2) { // Personal data step
      if (!data.personalInfo.firstName.trim()) errors.firstName = "Nombre es requerido";
      if (!data.personalInfo.lastName.trim()) errors.lastName = "Apellidos son requeridos";
      if (!data.personalInfo.dni.trim() || data.personalInfo.dni.length !== 8) errors.dni = "DNI debe tener 8 dígitos";
      if (!data.personalInfo.birthDate) {
        errors.birthDate = "Fecha de nacimiento es requerida";
      } else {
        // Validación de edad mínima
        const age = calculateAge(data.personalInfo.birthDate);
        if (age < 18 && data.goal !== "tarjeta-debito") {
          errors.birthDate = "Lo sentimos, para acceder a productos financieros debes ser mayor de edad. Solo puedes continuar si estás solicitando una tarjeta de débito.";
        }
      }
      if (!data.personalInfo.email.trim() || !data.personalInfo.email.includes('@')) errors.email = "Email válido es requerido";
      if (!data.personalInfo.phone.trim() || data.personalInfo.phone.length < 9) errors.phone = "Teléfono debe tener al menos 9 dígitos";
    }
    
    if (currentStep === 3) { // Amount step
      if (!data.amount || data.amount <= 0) errors.amount = "Debes especificar un monto válido";
    }
    
    if (currentStep === 4) { // Work step
      if (!data.workSituation) errors.workSituation = "Debes seleccionar tu situación laboral";
      if (!data.monthlyIncome || data.monthlyIncome <= 0) errors.monthlyIncome = "Debes especificar tus ingresos";
      
      if (data.workSituation === "estudiante") {
        if (!data.carrera) errors.carrera = "Carrera es requerida para estudiantes";
        if (!data.ciclo) errors.ciclo = "Ciclo es requerido para estudiantes";
      }
      if (data.workSituation === "empleado") {
        if (!data.empresaTrabajo) errors.empresaTrabajo = "Nombre de la empresa es requerido";
      }
      if (data.workSituation === "empresario") {
        if (!data.nombreNegocio) errors.nombreNegocio = "Nombre del negocio es requerido";
        if (!data.rubroNegocio) errors.rubroNegocio = "Rubro del negocio es requerido";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    
    // Save user to admin when completing step 2 (personal data)
    if (currentStep === 2) {
      saveUserToAdmin(data.personalInfo);
      
      // Also save to localStorage for the current session
      localStorage.setItem('nezaPersonalData', JSON.stringify(data.personalInfo));
      localStorage.setItem('nezaUserEmail', data.personalInfo.email);
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!validateCurrentStep()) return;
    
    // Final save with all data before completing
    if (data.personalInfo.email) {
      const adminUsers = JSON.parse(localStorage.getItem('nezaAdminUsers') || '[]');
      const userIndex = adminUsers.findIndex((user: any) => user.email === data.personalInfo.email);
      
      if (userIndex >= 0) {
        // Update the existing user with final data
        adminUsers[userIndex] = {
          ...adminUsers[userIndex],
          monthlyIncome: data.monthlyIncome,
          requestedAmount: data.amount,
          productType: data.goal,
          employmentType: data.workSituation,
          workDetails: data.workDetails,
          processStatus: 'Completó formulario',
          currentStep: 'Ofertas disponibles',
          lastUpdate: new Date().toISOString()
        };
        localStorage.setItem('nezaAdminUsers', JSON.stringify(adminUsers));
      }
    }
    
    onComplete(data);
  };

  const handleFileUpload = (file: File, type: 'dni' | 'payslips' | 'others') => {
    setData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: file
      }
    }));

    if (type === 'payslips') {
      setUploadedPayslips([file]);
    }
  };

  // Generate optimized year options (from current year - 16 to 1950)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 16; // Usuarios no menores de 16 años
    const years = [];
    for (let year = minYear; year >= 1950; year--) {
      years.push(year);
    }
    return years;
  };

  // Generate month options
  const generateMonthOptions = () => {
    return [
      { value: '01', label: 'Enero' },
      { value: '02', label: 'Febrero' },
      { value: '03', label: 'Marzo' },
      { value: '04', label: 'Abril' },
      { value: '05', label: 'Mayo' },
      { value: '06', label: 'Junio' },
      { value: '07', label: 'Julio' },
      { value: '08', label: 'Agosto' },
      { value: '09', label: 'Septiembre' },
      { value: '10', label: 'Octubre' },
      { value: '11', label: 'Noviembre' },
      { value: '12', label: 'Diciembre' }
    ];
  };

  // Generate day options based on selected month and year
  const generateDayOptions = (year: string, month: string) => {
    if (!year || !month) return Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
  };

  // Handle birth date changes with proper validation
  const handleBirthDateChange = (type: 'year' | 'month' | 'day', value: string) => {
    const currentParts = data.personalInfo.birthDate.split('-');
    const currentYear = currentParts[0] || '';
    const currentMonth = currentParts[1] || '';
    const currentDay = currentParts[2] || '';
    
    let newYear = type === 'year' ? value : currentYear;
    let newMonth = type === 'month' ? value : currentMonth;
    let newDay = type === 'day' ? value : currentDay;
    
    // Validate day exists in selected month/year
    if (newYear && newMonth) {
      const daysInMonth = new Date(parseInt(newYear), parseInt(newMonth), 0).getDate();
      if (newDay && parseInt(newDay) > daysInMonth) {
        newDay = daysInMonth.toString().padStart(2, '0');
      }
    }
    
    // Update birth date
    const newDate = newYear && newMonth && newDay ? `${newYear}-${newMonth}-${newDay}` : '';
    setData(prev => ({
      ...prev,
      personalInfo: { 
        ...prev.personalInfo, 
        birthDate: newDate 
      }
    }));

    // Clear birth date error when user starts fixing it
    if (validationErrors.birthDate) {
      setValidationErrors(prev => ({ ...prev, birthDate: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Mensaje de Transparencia Fijo */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 border-b-2 border-blue-700 py-2 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm text-white text-center font-medium">
            ✅ <strong>100% Transparente:</strong> Compararemos automáticamente todas las ofertas disponibles para encontrar las mejores condiciones para tu perfil
          </p>
        </div>
      </div>

      <div className="pt-16 pb-8">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold ${
                    currentStep >= step.number 
                      ? `bg-gradient-to-r ${step.color}` 
                      : 'bg-gray-300'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 w-16 mx-2 ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </div>

          {/* Current Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                <CardContent className="p-8">
                  {/* Step Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${steps[currentStep - 1].color} text-white mb-4`}>
                      {React.createElement(steps[currentStep - 1].icon, { size: 32 })}
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">
                      {steps[currentStep - 1].title}
                    </h2>
                    <p className="text-lg text-slate-600">
                      {steps[currentStep - 1].description}
                    </p>
                  </div>

                {/* Paso 1: Objetivo financiero - MOSTRAR 11 PRODUCTOS INCLUYENDO TARJETA DE DÉBITO */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <Label className="text-lg font-medium text-slate-700">
                      ¿Qué tipo de producto financiero estás buscando?
                    </Label>
                    {validationErrors.goal && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {validationErrors.goal}
                      </div>
                    )}
                    <div className="max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { id: "prestamo-personal", label: "Préstamo Personal", icon: "💰", desc: "Para gastos personales" },
                          { id: "prestamo-vehicular", label: "Préstamo Vehicular", icon: "🚗", desc: "Para comprar tu auto" },
                          { id: "hipotecario", label: "Crédito Hipotecario", icon: "🏠", desc: "Para tu casa" },
                          { id: "tarjeta-credito", label: "Tarjeta de Crédito", icon: "💳", desc: "Para compras y pagos" },
                          { id: "tarjeta-debito", label: "Tarjeta de Débito", icon: "🏧", desc: "Para menores y mayores de edad" },
                          { id: "prestamo-negocio", label: "Préstamo para Negocio", icon: "📊", desc: "Para tu empresa" },
                          { id: "microfinanzas", label: "Microfinanzas", icon: "🏪", desc: "Para pequeños negocios" },
                          { id: "cuenta-ahorros", label: "Cuenta de Ahorros", icon: "🏦", desc: "Para ahorrar dinero" },
                          { id: "deposito-plazo", label: "Depósito a Plazo", icon: "📈", desc: "Inversión a plazo fijo" },
                          { id: "credito-estudios", label: "Crédito Educativo", icon: "🎓", desc: "Para financiar estudios" },
                          { id: "seguro-vida", label: "Seguro de Vida", icon: "🛡️", desc: "Protección familiar" },
                          { id: "credito-consumo", label: "Crédito de Consumo", icon: "🛒", desc: "Para compras específicas" }
                        ].map((option) => (
                          <motion.div
                            key={option.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant={data.goal === option.id ? "default" : "outline"}
                              onClick={() => setData({ ...data, goal: option.id })}
                              className={`h-24 w-full flex flex-col items-center justify-center space-y-2 ${
                                data.goal === option.id 
                                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                                  : "border-blue-300 hover:bg-blue-50"
                              } ${validationErrors.goal ? 'border-red-500' : ''}`}
                            >
                              <span className="text-2xl">{option.icon}</span>
                              <div className="text-center">
                                <div className="font-semibold text-sm">{option.label}</div>
                                <div className="text-xs opacity-70">{option.desc}</div>
                              </div>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Paso 2: Datos Personales - SELECTOR DE FECHA CORREGIDO */}
                {currentStep === 2 && (
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
                          value={data.personalInfo.firstName}
                          onChange={(e) => setData({
                            ...data,
                            personalInfo: { ...data.personalInfo, firstName: e.target.value }
                          })}
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
                          value={data.personalInfo.lastName}
                          onChange={(e) => setData({
                            ...data,
                            personalInfo: { ...data.personalInfo, lastName: e.target.value }
                          })}
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
                          value={data.personalInfo.dni}
                          onChange={(e) => setData({
                            ...data,
                            personalInfo: { ...data.personalInfo, dni: e.target.value.replace(/\D/g, '').slice(0, 8) }
                          })}
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
                        <Label className="flex items-center gap-2 text-slate-700 mb-2">
                          <Calendar className="w-4 h-4" />
                          Fecha de Nacimiento *
                        </Label>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Select 
                              value={data.personalInfo.birthDate.split('-')[2] || ''} 
                              onValueChange={(value) => handleBirthDateChange('day', value)}
                            >
                              <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationErrors.birthDate ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Día" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60 overflow-y-auto bg-white z-50">
                                {generateDayOptions(
                                  data.personalInfo.birthDate.split('-')[0] || '', 
                                  data.personalInfo.birthDate.split('-')[1] || ''
                                ).map((day) => (
                                  <SelectItem key={day} value={day}>{day}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Select 
                              value={data.personalInfo.birthDate.split('-')[1] || ''} 
                              onValueChange={(value) => handleBirthDateChange('month', value)}
                            >
                              <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationErrors.birthDate ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Mes" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60 overflow-y-auto bg-white z-50">
                                {generateMonthOptions().map((month) => (
                                  <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Select 
                              value={data.personalInfo.birthDate.split('-')[0] || ''} 
                              onValueChange={(value) => handleBirthDateChange('year', value)}
                            >
                              <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationErrors.birthDate ? 'border-red-500' : ''}`}>
                                <SelectValue placeholder="Año" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60 overflow-y-auto bg-white z-50">
                                {generateYearOptions().map((year) => (
                                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {validationErrors.birthDate && (
                          <div className="flex items-center gap-2 text-red-600 text-sm mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{validationErrors.birthDate}</span>
                          </div>
                        )}
                        {data.personalInfo.birthDate && (
                          <div className="text-sm text-slate-600 mt-2">
                            Edad: {calculateAge(data.personalInfo.birthDate)} años
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 mb-2">
                          <Mail className="w-4 h-4" />
                          Correo Electrónico *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={data.personalInfo.email}
                          onChange={(e) => setData({
                            ...data,
                            personalInfo: { ...data.personalInfo, email: e.target.value }
                          })}
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
                          value={data.personalInfo.phone}
                          onChange={(e) => setData({
                            ...data,
                            personalInfo: { ...data.personalInfo, phone: e.target.value.replace(/\D/g, '').slice(0, 9) }
                          })}
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
                )}

                {/* Paso 3: Monto */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <Label className="text-lg font-medium text-slate-700">
                      💰 ¿Cuánto dinero necesitas?
                    </Label>
                    {validationErrors.amount && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {validationErrors.amount}
                      </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[5000, 10000, 20000, 50000, 100000, 200000].map((amount) => (
                        <Button
                          key={amount}
                          variant={data.amount === amount ? "default" : "outline"}
                          onClick={() => setData({ ...data, amount })}
                          className={`h-16 ${
                            data.amount === amount 
                              ? "bg-blue-600 hover:bg-blue-700" 
                              : "border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          S/ {amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                    <div>
                      <Label className="text-base font-medium text-slate-700 mb-3 block">
                        Otro monto específico: *
                      </Label>
                      <Input
                        type="number"
                        value={data.amount || ""}
                        onChange={(e) => setData({ ...data, amount: Number(e.target.value) })}
                        placeholder="Escribe el monto que necesitas"
                        className={`border-blue-300 focus:border-blue-500 ${validationErrors.amount ? 'border-red-500' : ''}`}
                      />
                    </div>
                  </div>
                )}

                {/* Paso 4: Trabajo EXPANDIDO */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-base font-medium text-slate-700 mb-3 block">
                          💼 ¿Cuál es tu situación laboral actual? *
                        </Label>
                        <Select value={data.workSituation} onValueChange={(value) => setData({ ...data, workSituation: value })}>
                          <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationErrors.workSituation ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Selecciona tu situación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="empleado">👔 Empleado (trabajo en planilla)</SelectItem>
                            <SelectItem value="independiente">💼 Trabajador independiente</SelectItem>
                            <SelectItem value="empresario">🏢 Empresario/Negocio propio</SelectItem>
                            <SelectItem value="estudiante">🎓 Estudiante</SelectItem>
                            <SelectItem value="jubilado">🏖️ Jubilado/Pensionista</SelectItem>
                            <SelectItem value="ama-casa">🏠 Ama de casa</SelectItem>
                            <SelectItem value="otro">❓ Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        {validationErrors.workSituation && (
                          <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                            <AlertCircle className="w-4 h-4" />
                            {validationErrors.workSituation}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-base font-medium text-slate-700 mb-3 block">
                          💰 ¿Cuáles son tus ingresos mensuales aproximados? *
                        </Label>
                        <Select value={data.monthlyIncome.toString()} onValueChange={(value) => setData({ ...data, monthlyIncome: Number(value) })}>
                          <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationErrors.monthlyIncome ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Selecciona tu rango de ingresos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="930">Menos de S/ 930 (sueldo mínimo)</SelectItem>
                            <SelectItem value="1500">S/ 930 - S/ 1,500</SelectItem>
                            <SelectItem value="2500">S/ 1,500 - S/ 2,500</SelectItem>
                            <SelectItem value="4000">S/ 2,500 - S/ 4,000</SelectItem>
                            <SelectItem value="6000">S/ 4,000 - S/ 6,000</SelectItem>
                            <SelectItem value="10000">S/ 6,000 - S/ 10,000</SelectItem>
                            <SelectItem value="15000">Más de S/ 10,000</SelectItem>
                          </SelectContent>
                        </Select>
                        {validationErrors.monthlyIncome && (
                          <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                            <AlertCircle className="w-4 h-4" />
                            {validationErrors.monthlyIncome}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Campos específicos según tipo de trabajo */}
                    {data.workSituation === "estudiante" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded-lg">
                        <div>
                          <Label className="flex items-center gap-2 text-slate-700 mb-2">
                            <School className="w-4 h-4" />
                            ¿Qué estudias?
                          </Label>
                          <Input
                            value={data.carrera || ""}
                            onChange={(e) => setData({ ...data, carrera: e.target.value })}
                            placeholder="Ej: Administración, Ingeniería, etc."
                            className="border-blue-300 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <Label className="flex items-center gap-2 text-slate-700 mb-2">
                            <Calendar className="w-4 h-4" />
                            ¿En qué ciclo/año estás?
                          </Label>
                          <Input
                            value={data.ciclo || ""}
                            onChange={(e) => setData({ ...data, ciclo: e.target.value })}
                            placeholder="Ej: 5to ciclo, 3er año"
                            className="border-blue-300 focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-slate-700 mb-3 block">¿Haces prácticas profesionales?</Label>
                          <div className="flex gap-4">
                            <Button
                              type="button"
                              variant={data.hacePracticas === "si" ? "default" : "outline"}
                              onClick={() => setData({ ...data, hacePracticas: "si" })}
                              className={data.hacePracticas === "si" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300"}
                            >
                              Sí
                            </Button>
                            <Button
                              type="button"
                              variant={data.hacePracticas === "no" ? "default" : "outline"}
                              onClick={() => setData({ ...data, hacePracticas: "no" })}
                              className={data.hacePracticas === "no" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300"}
                            >
                              No
                            </Button>
                          </div>
                        </div>
                        {data.hacePracticas === "si" && (
                          <div className="md:col-span-2">
                            <Label className="flex items-center gap-2 text-slate-700 mb-2">
                              <Building className="w-4 h-4" />
                              ¿En qué empresa haces prácticas?
                            </Label>
                            <Input
                              value={data.empresaPracticas || ""}
                              onChange={(e) => setData({ ...data, empresaPracticas: e.target.value })}
                              placeholder="Nombre de la empresa"
                              className="border-blue-300 focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {data.workSituation === "empleado" && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <Label className="flex items-center gap-2 text-slate-700 mb-2">
                          <Building className="w-4 h-4" />
                          ¿En qué empresa trabajas?
                        </Label>
                        <Input
                          value={data.empresaTrabajo || ""}
                          onChange={(e) => setData({ ...data, empresaTrabajo: e.target.value })}
                          placeholder="Nombre de tu empresa"
                          className="border-blue-300 focus:border-blue-500"
                        />
                      </div>
                    )}

                    {data.workSituation === "empresario" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-purple-50 rounded-lg">
                        <div>
                          <Label className="flex items-center gap-2 text-slate-700 mb-2">
                            <Building className="w-4 h-4" />
                            ¿Cómo se llama tu negocio?
                          </Label>
                          <Input
                            value={data.nombreNegocio || ""}
                            onChange={(e) => setData({ ...data, nombreNegocio: e.target.value })}
                            placeholder="Nombre de tu negocio"
                            className="border-blue-300 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <Label className="flex items-center gap-2 text-slate-700 mb-2">
                            <Briefcase className="w-4 h-4" />
                            ¿A qué rubro se dedica?
                          </Label>
                          <Input
                            value={data.rubroNegocio || ""}
                            onChange={(e) => setData({ ...data, rubroNegocio: e.target.value })}
                            placeholder="Ej: Restaurante, Tienda, Servicios"
                            className="border-blue-300 focus:border-blue-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label className="flex items-center gap-2 text-slate-700 mb-2">
                            <Target className="w-4 h-4" />
                            Describe brevemente tu actividad principal
                          </Label>
                          <Textarea
                            value={data.actividadPrincipal || ""}
                            onChange={(e) => setData({ ...data, actividadPrincipal: e.target.value })}
                            placeholder="Ej: Venta de comida, consultoría, etc."
                            className="border-blue-300 focus:border-blue-500"
                            rows={3}
                          />
                        </div>
                      </div>
                    )}

                    {(data.workSituation === "independiente" || data.workSituation === "otro") && (
                      <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                        <Label className="flex items-center gap-2 text-slate-700 mb-2">
                          <Briefcase className="w-4 h-4" />
                          Describe tu trabajo o actividad
                        </Label>
                        <Textarea
                          value={data.otroTrabajo || ""}
                          onChange={(e) => setData({ ...data, otroTrabajo: e.target.value })}
                          placeholder="Describe a qué te dedicas..."
                          className="border-blue-300 focus:border-blue-500"
                          rows={3}
                        />
                      </div>
                    )}

                    <div>
                      <Label className="text-base font-medium text-slate-700 mb-3 block">
                        📄 ¿Tienes boletas de pago o comprobantes de ingresos?
                      </Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={data.hasPayslips === "si" ? "default" : "outline"}
                          onClick={() => setData({ ...data, hasPayslips: "si" })}
                          className={data.hasPayslips === "si" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300"}
                        >
                          ✅ Sí tengo
                        </Button>
                        <Button
                          type="button"
                          variant={data.hasPayslips === "no" ? "default" : "outline"}
                          onClick={() => setData({ ...data, hasPayslips: "no" })}
                          className={data.hasPayslips === "no" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300"}
                        >
                          ❌ No tengo
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Paso 5: Documentos */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">📁 Sube tus documentos</h3>
                      <p className="text-slate-600">Estos documentos nos ayudarán a encontrar las mejores ofertas para ti</p>
                    </div>

                    {/* MENSAJE OBLIGATORIO DE DOCUMENTOS */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="w-5 h-5" />
                        <p className="font-medium">
                          Recuerda que más adelante deberás subir tus documentos para poder acceder a un producto financiero.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { type: 'dni', label: 'DNI', icon: '🆔', required: false },
                        { type: 'payslips', label: 'Boletas de pago', icon: '💰', required: false },
                        { type: 'others', label: 'Otros documentos', icon: '📄', required: false }
                      ].map((doc) => (
                        <div key={doc.type} className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                          <div className="text-4xl mb-3">{doc.icon}</div>
                          <h4 className="font-semibold text-slate-800 mb-2">{doc.label}</h4>
                          <Badge variant="outline" className="mb-3">Opcional</Badge>
                          
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, doc.type as 'dni' | 'payslips' | 'others');
                              }
                            }}
                            className="mb-3"
                          />
                          
                          {data.documents[doc.type as 'dni' | 'payslips' | 'others'] && (
                            <div className="text-sm text-green-600 font-medium">
                              ✅ {data.documents[doc.type as 'dni' | 'payslips' | 'others']?.name}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={currentStep === 1 ? onBack : prevStep}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {currentStep === 1 ? "Volver al inicio" : "Anterior"}
                    </Button>

                    {currentStep < steps.length ? (
                      <Button 
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Continuar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowTutorial(true)}
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Ver Tutorial
                        </Button>
                        <Button 
                          onClick={handleComplete}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          ¡Ver mis ofertas!
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Tutorial Modal */}
          {showTutorial && (
            <InteractiveTutorial
              isVisible={showTutorial}
              onClose={() => {
                setShowTutorial(false);
                handleComplete();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
