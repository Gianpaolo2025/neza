import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, Heart, Star, TrendingUp, Bot, Sparkles } from "lucide-react";
import { PersonalDataStep } from "./steps/PersonalDataStep";
import { FinancialInfoStep } from "./steps/FinancialInfoStep";
import { ClientProfileStep } from "./steps/ClientProfileStep";
import { WelcomeBack } from "./WelcomeBack";
import { ProfileSummary } from "./ProfileSummary";
import { SBSEntitiesCarousel } from "./SBSEntitiesCarousel";
import { AsesorIA } from "./AsesorIA";

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
    hasFixedIncome: boolean;
    workType: string;
    incomeRange: string;
    creditPurpose: string;
    financialGoals: string[];
    financialKnowledge: string;
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
  const [showAsesorIA, setShowAsesorIA] = useState(true);
  const [asesorIAMessage, setAsesorIAMessage] = useState("");
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
      hasFixedIncome: false,
      workType: '',
      incomeRange: '',
      creditPurpose: '',
      financialGoals: [],
      financialKnowledge: '',
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
      
      // Update AsesorIA message for next step
      updateAsesorIAMessage(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      updateAsesorIAMessage(currentStep - 1);
    }
  };

  const updateAsesorIAMessage = (step: number) => {
    const messages = {
      1: "¡Hola! Soy AsesorIA, tu guía financiera personal. Vamos a empezar con tus datos básicos. No te preocupes, esto es súper fácil y seguro. 😊",
      2: "¡Perfecto! Ahora necesito conocer qué producto financiero necesitas y para qué lo usarás. Te ayudaré a encontrar las mejores opciones. 💰",
      3: "¡Casi terminamos! Estas preguntas me ayudarán a entender tu perfil y recomendarte exactamente lo que necesitas. ¡Confía en mí! 🎯"
    };
    setAsesorIAMessage(messages[step as keyof typeof messages] || "");
  };

  // Initialize AsesorIA message
  useEffect(() => {
    updateAsesorIAMessage(currentStep);
  }, []);

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
        hasFixedIncome: false,
        workType: '',
        incomeRange: '',
        creditPurpose: '',
        financialGoals: [],
        financialKnowledge: '',
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
    { 
      id: 1, 
      title: 'Datos Personales', 
      icon: '👤', 
      color: 'from-slate-600 to-slate-700',
      description: 'Información básica y validación'
    },
    { 
      id: 2, 
      title: 'Información Financiera', 
      icon: '💰', 
      color: 'from-blue-500 to-blue-600',
      description: 'Producto deseado y necesidades'
    },
    { 
      id: 3, 
      title: 'Perfil del Cliente', 
      icon: '🎯', 
      color: 'from-cyan-500 to-cyan-600',
      description: 'Análisis personalizado'
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);
  const progress = ((currentStep - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header elegante */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-slate-600">Paso {currentStep} de 3</div>
              <div className="text-xs text-slate-400">{currentStepData?.description}</div>
            </div>
            
            {/* Barra de progreso elegante */}
            <div className="w-40 h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-slate-400 rounded-full shadow-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* AsesorIA Assistant */}
        <AnimatePresence>
          {showAsesorIA && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-8"
            >
              <AsesorIA
                message={asesorIAMessage}
                onClose={() => setShowAsesorIA(false)}
                onReopen={() => setShowAsesorIA(true)}
                currentStep={currentStep}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicador de paso actual elegante */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className={`inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r ${currentStepData?.color} text-white shadow-xl`}>
            <div className="text-3xl">{currentStepData?.icon}</div>
            <div className="text-left">
              <div className="font-bold text-xl">{currentStepData?.title}</div>
              <div className="text-sm opacity-90">{currentStepData?.description}</div>
            </div>
          </div>
        </motion.div>

        {/* Progress indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300
                  ${step.id < currentStep ? 'bg-cyan-500 border-cyan-500 text-white' : ''}
                  ${step.id === currentStep ? 'border-blue-500 text-blue-500 bg-blue-50' : ''}
                  ${step.id > currentStep ? 'border-slate-300 text-slate-400' : ''}
                `}>
                  {step.id < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    step.id < currentStep ? 'bg-cyan-500' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenido del paso con animaciones */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
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

        {/* Entidades SBS con diseño mejorado */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-700 mb-2">
                Entidades Financieras Supervisadas por la SBS
              </h3>
              <p className="text-slate-600">
                Trabajamos con las instituciones más confiables del país
              </p>
            </div>
            <SBSEntitiesCarousel />
          </motion.div>
        )}

        {/* Botón flotante para mostrar AsesorIA si está oculta */}
        {!showAsesorIA && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setShowAsesorIA(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-center justify-center z-50"
          >
            <Bot className="w-6 h-6" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
