
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, Heart, Star, TrendingUp } from "lucide-react";
import { PersonalDataStep } from "./steps/PersonalDataStep";
import { FinancialInfoStep } from "./steps/FinancialInfoStep";
import { ClientProfileStep } from "./steps/ClientProfileStep";
import { WelcomeBack } from "./WelcomeBack";
import { ProfileSummary } from "./ProfileSummary";
import { SBSEntitiesCarousel } from "./SBSEntitiesCarousel";

interface OnboardingData {
  personalData: {
    firstName: string;
    lastName: string;
    dni: string;
    birthDate: string;
    email: string;
    phone: string;
    isValidated: boolean;
    otpVerified: boolean;
  };
  financialInfo: {
    creditType: string;
    requestedAmount: number;
    monthlyIncome: number;
    occupation: string;
    workTime: number;
  };
  clientProfile: {
    hasPreviousCredit: boolean;
    riskProfile: string;
    wantsAdvice: boolean;
    financialGoals: string[];
    preferredContact: string;
  };
  currentStep: number;
  completedSteps: number[];
  profileScore: number;
}

interface DynamicOnboardingProps {
  onBack: () => void;
}

const getStorageKey = (dni: string) => `neza-onboarding-${dni}`;

export const DynamicOnboarding = ({ onBack }: DynamicOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    personalData: {
      firstName: '',
      lastName: '',
      dni: '',
      birthDate: '',
      email: '',
      phone: '',
      isValidated: false,
      otpVerified: false
    },
    financialInfo: {
      creditType: '',
      requestedAmount: 0,
      monthlyIncome: 0,
      occupation: '',
      workTime: 0
    },
    clientProfile: {
      hasPreviousCredit: false,
      riskProfile: '',
      wantsAdvice: false,
      financialGoals: [],
      preferredContact: ''
    },
    currentStep: 1,
    completedSteps: [],
    profileScore: 0
  });

  // Cargar datos guardados al montar el componente
  useEffect(() => {
    const savedKeys = Object.keys(localStorage).filter(key => key.startsWith('neza-onboarding-'));
    if (savedKeys.length > 0) {
      // Buscar datos existentes
      const lastKey = savedKeys[savedKeys.length - 1];
      const savedData = JSON.parse(localStorage.getItem(lastKey) || '{}');
      if (savedData.personalData?.firstName) {
        setIsReturningUser(true);
        setShowWelcomeBack(true);
        setData(savedData);
        setCurrentStep(savedData.currentStep);
      }
    }
  }, []);

  // Guardar datos automáticamente
  useEffect(() => {
    if (data.personalData.dni && data.personalData.firstName) {
      const key = getStorageKey(data.personalData.dni);
      localStorage.setItem(key, JSON.stringify({
        ...data,
        currentStep,
        lastVisit: new Date().toISOString()
      }));
    }
  }, [data, currentStep]);

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      setData(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, currentStep],
        currentStep: currentStep + 1
      }));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const continueFromWhere = () => {
    setShowWelcomeBack(false);
  };

  const startFresh = () => {
    setIsReturningUser(false);
    setShowWelcomeBack(false);
    setCurrentStep(1);
    setData({
      personalData: {
        firstName: '',
        lastName: '',
        dni: '',
        birthDate: '',
        email: '',
        phone: '',
        isValidated: false,
        otpVerified: false
      },
      financialInfo: {
        creditType: '',
        requestedAmount: 0,
        monthlyIncome: 0,
        occupation: '',
        workTime: 0
      },
      clientProfile: {
        hasPreviousCredit: false,
        riskProfile: '',
        wantsAdvice: false,
        financialGoals: [],
        preferredContact: ''
      },
      currentStep: 1,
      completedSteps: [],
      profileScore: 0
    });
  };

  if (showWelcomeBack) {
    return (
      <WelcomeBack
        firstName={data.personalData.firstName}
        currentStep={currentStep}
        onContinue={continueFromWhere}
        onStartFresh={startFresh}
        onBack={onBack}
      />
    );
  }

  if (currentStep === 4) {
    return (
      <ProfileSummary
        data={data}
        onBack={prevStep}
        onFinish={() => {
          // Limpiar datos después de completar
          if (data.personalData.dni) {
            localStorage.removeItem(getStorageKey(data.personalData.dni));
          }
          onBack();
        }}
      />
    );
  }

  const steps = [
    { id: 1, title: 'Datos Personales', icon: '👤', color: 'from-blue-500 to-blue-600' },
    { id: 2, title: 'Información Financiera', icon: '💰', color: 'from-yellow-500 to-yellow-600' },
    { id: 3, title: 'Perfil del Cliente', icon: '🎯', color: 'from-green-500 to-green-600' }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header con progreso */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Paso {currentStep} de 3
            </div>
            
            {/* Barra de progreso animada */}
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Indicador de paso actual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r ${currentStepData?.color} text-white shadow-lg`}>
            <span className="text-2xl">{currentStepData?.icon}</span>
            <span className="font-semibold text-lg">{currentStepData?.title}</span>
          </div>
        </motion.div>

        {/* Contenido del paso */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <PersonalDataStep
                data={data.personalData}
                onUpdate={(personalData) => updateData({ personalData })}
                onNext={nextStep}
                isReturningUser={isReturningUser}
              />
            )}
            
            {currentStep === 2 && (
              <FinancialInfoStep
                data={data.financialInfo}
                personalData={data.personalData}
                onUpdate={(financialInfo) => updateData({ financialInfo })}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
            
            {currentStep === 3 && (
              <ClientProfileStep
                data={data.clientProfile}
                onUpdate={(clientProfile) => updateData({ clientProfile })}
                onNext={nextStep}
                onPrev={prevStep}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Entidades SBS al final */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <SBSEntitiesCarousel />
          </motion.div>
        )}
      </div>
    </div>
  );
};
