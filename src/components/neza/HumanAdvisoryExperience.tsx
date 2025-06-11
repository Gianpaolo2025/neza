
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, ArrowRight, User, Briefcase, DollarSign, Lightbulb, FileText, Calendar, Phone, MapPin, Mail, ChevronRight, Target, School, Building, Zap } from "lucide-react";
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

  // Clear all user data on component mount to prevent pre-filling for new users
  useEffect(() => {
    console.log('HumanAdvisoryExperience: Clearing all user data on mount');
    
    // Clear localStorage completely for new sessions
    localStorage.removeItem('nezaUserData');
    localStorage.removeItem('nezaPersonalData');
    localStorage.removeItem('nezaHumanAdvisoryData');
    localStorage.removeItem('nezaUserEmail');
    
    // Reset component state to ensure clean slate
    setData({
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
    
    // Clear uploaded files state
    setUploadedPayslips([]);
    
    console.log('HumanAdvisoryExperience: All user data cleared successfully');
  }, []); // Empty dependency array ensures this runs only once on mount

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

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};
    
    // No validation for personal step - users can proceed with any data
    
    if (currentStep === 4) { // Work step
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

                {/* Paso 0: Objetivo financiero */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <Label className="text-lg font-medium text-slate-700">
                      ¿Qué tipo de producto financiero estás buscando?
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { id: "prestamo-personal", label: "Préstamo Personal", icon: "💰", desc: "Para gastos personales" },
                        { id: "prestamo-vehicular", label: "Préstamo Vehicular", icon: "🚗", desc: "Para comprar tu auto" },
                        { id: "hipotecario", label: "Crédito Hipotecario", icon: "🏠", desc: "Para tu casa" },
                        { id: "tarjeta-credito", label: "Tarjeta de Crédito", icon: "💳", desc: "Para compras y pagos" },
                        { id: "prestamo-negocio", label: "Préstamo para Negocio", icon: "📊", desc: "Para tu empresa" },
                        { id: "microfinanzas", label: "Microfinanzas", icon: "🏪", desc: "Para pequeños negocios" }
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
                            }`}
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
                )}

                {/* Paso 1: Datos Personales */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium text-slate-700 mb-3 block">
                        📝 Información Personal Básica
                      </Label>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-800">
                          <strong>✅ Todos los campos son opcionales:</strong> Puedes llenar solo los que desees o completar todo más tarde.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="flex items-center gap-2 text-slate-700 mb-2">
                          <User className="w-4 h-4" />
                          Nombres
                        </Label>
                        <Input
                          id="firstName"
                          value={data.personalInfo.firstName}
                          onChange={(e) => setData({
                            ...data,
                            personalInfo: { ...data.personalInfo, firstName: e.target.value }
                          })}
                          placeholder="Ej: Juan Carlos"
                          className="border-blue-300 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="lastName" className="flex items-center gap-2 text-slate-700 mb-2">
                          <User className="w-4 h-4" />
                          Apellidos
                        </Label>
                        <Input
                          id="lastName"
                          value={data.personalInfo.lastName}
                          onChange={(e) => setData({
                            ...data,
                            personalInfo: { ...data.personalInfo, lastName: e.target.value }
                          })}
                          placeholder="Ej: Pérez García"
                          className="border-blue-300 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="dni" className="flex items-center gap-2 text-slate-700 mb-2">
                          <FileText className="w-4 h-4" />
                          DNI
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
                          className="border-blue-300 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="birthDate" className="flex items-center gap-2 text-slate-700 mb-2">
                          <Calendar className="w-4 h-4" />
                          Fecha de Nacimiento
                        </Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={data.personalInfo.birthDate}
                          onChange={(e) => setData({
                            ...data,
                            personalInfo: { ...data.personalInfo, birthDate: e.target.value }
                          })}
                          className="border-blue-300 focus:border-blue-500"
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2 text-slate-700 mb-2">
                          <Mail className="w-4 h-4" />
                          Correo Electrónico
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
                          className="border-blue-300 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 text-slate-700 mb-2">
                          <Phone className="w-4 h-4" />
                          Teléfono
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
                          className="border-blue-300 focus:border-blue-500"
                        />
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
                        Otro monto específico:
                      </Label>
                      <Input
                        type="number"
                        value={data.amount || ""}
                        onChange={(e) => setData({ ...data, amount: Number(e.target.value) })}
                        placeholder="Escribe el monto que necesitas"
                        className="border-blue-300 focus:border-blue-500"
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
                          💼 ¿Cuál es tu situación laboral actual?
                        </Label>
                        <Select value={data.workSituation} onValueChange={(value) => setData({ ...data, workSituation: value })}>
                          <SelectTrigger className="border-blue-300 focus:border-blue-500">
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
                      </div>

                      <div>
                        <Label className="text-base font-medium text-slate-700 mb-3 block">
                          💰 ¿Cuáles son tus ingresos mensuales aproximados?
                        </Label>
                        <Select value={data.monthlyIncome.toString()} onValueChange={(value) => setData({ ...data, monthlyIncome: Number(value) })}>
                          <SelectTrigger className="border-blue-300 focus:border-blue-500">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { type: 'dni', label: 'DNI', icon: '🆔', required: true },
                        { type: 'payslips', label: 'Boletas de pago', icon: '💰', required: false },
                        { type: 'others', label: 'Otros documentos', icon: '📄', required: false }
                      ].map((doc) => (
                        <div key={doc.type} className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                          <div className="text-4xl mb-3">{doc.icon}</div>
                          <h4 className="font-semibold text-slate-800 mb-2">{doc.label}</h4>
                          {doc.required && <Badge variant="destructive" className="mb-3">Requerido</Badge>}
                          
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

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>📌 Importante:</strong> Todos los documentos son opcionales en esta etapa. 
                        Puedes subirlos ahora o más tarde durante el proceso de evaluación.
                      </p>
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
              onClose={() => setShowTutorial(false)}
              onCompleted={() => {
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
