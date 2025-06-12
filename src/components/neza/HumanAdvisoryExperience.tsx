import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, User, DollarSign, Briefcase, FileText } from "lucide-react";
import { InteractiveTutorial } from "./InteractiveTutorial";
import { QuestionsTutorial } from "./components/QuestionsTutorial";
import { GoalSelectionStep } from "./steps/GoalSelectionStep";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { AmountStep } from "./steps/AmountStep";
import { WorkSituationStep } from "./steps/WorkSituationStep";
import { DocumentsStep } from "./steps/DocumentsStep";
import { StepNavigation } from "./components/StepNavigation";
import { ProgressSteps } from "./components/ProgressSteps";

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
  const [showQuestionsTutorial, setShowQuestionsTutorial] = useState(false);
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

  const handlePersonalInfoChange = (field: keyof FormData['personalInfo'], value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const handleFieldChange = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GoalSelectionStep
            goal={data.goal}
            onGoalChange={(goal) => setData({ ...data, goal })}
            validationError={validationErrors.goal}
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            personalInfo={data.personalInfo}
            onPersonalInfoChange={handlePersonalInfoChange}
            onBirthDateChange={handleBirthDateChange}
            validationErrors={validationErrors}
            calculateAge={calculateAge}
          />
        );
      case 3:
        return (
          <AmountStep
            amount={data.amount}
            onAmountChange={(amount) => setData({ ...data, amount })}
            validationError={validationErrors.amount}
          />
        );
      case 4:
        return (
          <WorkSituationStep
            workSituation={data.workSituation}
            monthlyIncome={data.monthlyIncome}
            hasPayslips={data.hasPayslips}
            onWorkSituationChange={(value) => setData({ ...data, workSituation: value })}
            onMonthlyIncomeChange={(value) => setData({ ...data, monthlyIncome: value })}
            onHasPayslipsChange={(value) => setData({ ...data, hasPayslips: value })}
            onFieldChange={handleFieldChange}
            formData={data}
            validationErrors={validationErrors}
          />
        );
      case 5:
        return (
          <DocumentsStep
            documents={data.documents}
            onFileUpload={handleFileUpload}
          />
        );
      default:
        return null;
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
          <ProgressSteps steps={steps} currentStep={currentStep} />

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

                  {/* Step Content */}
                  {renderCurrentStep()}

                  {/* Navigation Buttons */}
                  <StepNavigation
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    onBack={onBack}
                    onPrevStep={prevStep}
                    onNextStep={nextStep}
                    onComplete={handleComplete}
                    onShowTutorial={() => setShowTutorial(true)}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Tutorial Modal - Original de la sección 1 */}
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
