import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Shield, Sparkles, AlertTriangle, Clock } from "lucide-react";
import { PersonalDataStep } from "./steps/PersonalDataStep";
import { FinancialInfoStep } from "./steps/FinancialInfoStep";
import { ClientProfileStep } from "./steps/ClientProfileStep";
import { AsesorIA } from "./AsesorIA";
import { OffersDashboard } from "@/components/OffersDashboard";
import { IntelligentSystem } from "./IntelligentSystem";
import { InteractiveOnboarding } from "./InteractiveOnboarding";

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

interface FinancialInfo {
  productType: string;
  requestedAmount: number;
  purpose: string;
  monthlyIncome: number;
  employmentType: string;
  workTime: number;
  hasOtherDebts: string;
  bankingRelationship: string;
  urgencyLevel: string;
  creditType: string;
  occupation: string;
}

interface ClientProfile {
  hasPreviousCredit: boolean;
  hasFixedIncome: boolean;
  workType: string;
  incomeRange: string;
  creditPurpose: string;
  financialGoals: string[];
  financialKnowledge: string;
  preferredContact: string;
}

interface OnboardingData {
  personalData: PersonalData;
  financialInfo: FinancialInfo;
  clientProfile: ClientProfile;
  isReturningUser: boolean;
}

interface DynamicOnboardingProps {
  onBack: () => void;
}

export const DynamicOnboarding = ({ onBack }: DynamicOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showAsesorIA, setShowAsesorIA] = useState(true);
  const [currentView, setCurrentView] = useState<'onboarding' | 'offers' | 'intelligent' | 'interactive'>('onboarding');
  const [countdownDays, setCountdownDays] = useState<number | null>(null);
  const [data, setData] = useState<OnboardingData>({
    personalData: {
      firstName: "",
      lastName: "",
      dni: "",
      birthDate: "",
      email: "",
      phone: "",
      address: "",
      occupation: "",
      workYears: 0,
      workMonths: 0,
      preferredCurrency: "PEN",
      isValidated: false,
      otpVerified: false
    },
    financialInfo: {
      productType: "",
      requestedAmount: 0,
      purpose: "",
      monthlyIncome: 0,
      employmentType: "",
      workTime: 0,
      hasOtherDebts: "",
      bankingRelationship: "",
      urgencyLevel: "",
      creditType: "",
      occupation: ""
    },
    clientProfile: {
      hasPreviousCredit: false,
      hasFixedIncome: false,
      workType: "",
      incomeRange: "",
      creditPurpose: "",
      financialGoals: [],
      financialKnowledge: "",
      preferredContact: ""
    },
    isReturningUser: false
  });

  useEffect(() => {
    const savedData = localStorage.getItem('nezaOnboardingData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setData(parsed);
      
      if (parsed.personalData.dni && parsed.personalData.isValidated) {
        setData(prev => ({ ...prev, isReturningUser: true }));
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nezaOnboardingData', JSON.stringify(data));
  }, [data]);

  // Configurar contador regresivo basado en urgencia
  useEffect(() => {
    if (data.financialInfo.urgencyLevel) {
      const urgencyMap = {
        'inmediato': 7,
        'una-semana': 7,
        'un-mes': 30,
        'no-urgente': 90
      };
      const days = urgencyMap[data.financialInfo.urgencyLevel as keyof typeof urgencyMap] || 30;
      setCountdownDays(days);
      
      // Simular countdown (en producción esto vendría del servidor)
      const interval = setInterval(() => {
        setCountdownDays(prev => prev && prev > 0 ? prev - 1 : 0);
      }, 24 * 60 * 60 * 1000); // 24 horas
      
      return () => clearInterval(interval);
    }
  }, [data.financialInfo.urgencyLevel]);

  const asesorMessages = {
    1: `¡Hola! Soy AsesorIA, tu asistente financiera personal certificada por la SBS. Te acompañaré paso a paso para encontrar la mejor opción financiera para ti. ${data.isReturningUser ? '¡Me alegra verte de nuevo! Continuemos donde lo dejamos.' : 'Empecemos con tus datos personales de forma 100% segura.'}`,
    2: "¡Perfecto! Ahora te voy a mostrar TODOS los productos financieros disponibles en el mercado peruano, ordenados especialmente para tu perfil. Te ayudo a elegir la mejor opción con las tasas más competitivas.",
    3: "¡Excelente progreso! Estas últimas preguntas me permiten crear tu perfil financiero completo. Con esta información te daré recomendaciones súper precisas y personalizadas. ¡Ya casi terminamos!"
  };

  const getProgressPercentage = () => {
    const stepProgress = {
      1: data.personalData.isValidated && data.personalData.otpVerified ? 33 : 0,
      2: data.financialInfo.productType && data.financialInfo.requestedAmount > 0 ? 66 : 33,
      3: data.clientProfile.financialKnowledge ? 100 : 66
    };
    return stepProgress[currentStep as keyof typeof stepProgress] || 0;
  };

  const handlePersonalDataUpdate = (personalData: PersonalData) => {
    setData(prev => ({ ...prev, personalData }));
    // Auto-advance si todos los campos están completos
    if (personalData.isValidated && personalData.otpVerified) {
      setTimeout(() => setCurrentStep(2), 500);
    }
  };

  const handleFinancialInfoUpdate = (financialInfo: FinancialInfo) => {
    setData(prev => ({ ...prev, financialInfo }));
    // Auto-advance si la información esencial está completa
    if (financialInfo.productType && financialInfo.requestedAmount > 0 && financialInfo.urgencyLevel) {
      setTimeout(() => setCurrentStep(3), 500);
    }
  };

  const handleClientProfileUpdate = (clientProfile: ClientProfile) => {
    setData(prev => ({ ...prev, clientProfile }));
    // Auto-advance a ofertas si está completo
    if (clientProfile.financialKnowledge) {
      setTimeout(() => setCurrentView('offers'), 1000);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return data.personalData.isValidated && data.personalData.otpVerified;
      case 2:
        return data.financialInfo.productType && data.financialInfo.requestedAmount > 0;
      case 3:
        return data.clientProfile.financialKnowledge;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentView('offers');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleViewIntelligentSystem = () => {
    setCurrentView('intelligent');
  };

  const handleViewInteractive = () => {
    setCurrentView('interactive');
  };

  const handleBackToOnboarding = () => {
    setCurrentView('onboarding');
    setCurrentStep(1);
  };

  const convertToUserData = () => {
    return {
      firstName: data.personalData.firstName,
      lastName: data.personalData.lastName,
      dni: data.personalData.dni,
      email: data.personalData.email,
      phone: data.personalData.phone,
      monthlyIncome: data.financialInfo.monthlyIncome,
      requestedAmount: data.financialInfo.requestedAmount,
      productType: data.financialInfo.productType || "credito-personal",
      employmentType: data.financialInfo.employmentType,
      hasOtherDebts: data.financialInfo.hasOtherDebts,
      bankingRelationship: data.financialInfo.bankingRelationship,
      urgencyLevel: data.financialInfo.urgencyLevel,
      creditHistory: data.clientProfile.hasPreviousCredit ? "bueno" : "nuevo",
      preferredBank: ""
    };
  };

  const convertToUserProfile = () => {
    return {
      personalInfo: {
        name: `${data.personalData.firstName} ${data.personalData.lastName}`,
        firstName: data.personalData.firstName,
        lastName: data.personalData.lastName,
        age: new Date().getFullYear() - new Date(data.personalData.birthDate).getFullYear(),
        dni: data.personalData.dni,
        email: data.personalData.email,
        phone: data.personalData.phone
      },
      employment: {
        type: data.financialInfo.employmentType as "dependiente" | "independiente" | "empresario",
        monthlyIncome: data.financialInfo.monthlyIncome,
        workTime: data.financialInfo.workTime
      },
      credit: {
        score: data.clientProfile.hasPreviousCredit ? 450 : 350,
        debtToIncome: data.financialInfo.hasOtherDebts === "no" ? 10 : 35,
        hasNegativeHistory: false,
        infoCorpStatus: "normal" as const
      },
      documents: {},
      qualityScore: 75
    };
  };

  const getUserProgress = () => {
    let profileLevel = 0;
    
    if (data.personalData.isValidated && data.personalData.otpVerified) profileLevel += 25;
    if (data.financialInfo.productType && data.financialInfo.requestedAmount > 0) profileLevel += 25;
    if (data.financialInfo.monthlyIncome > 0) profileLevel += 25;
    if (data.clientProfile.financialKnowledge) profileLevel += 25;
    
    return {
      profileLevel,
      selectedProduct: data.financialInfo.productType,
      monthlyIncome: data.financialInfo.monthlyIncome
    };
  };

  // Mostrar sistema de ofertas
  if (currentView === 'offers') {
    return (
      <OffersDashboard 
        user={convertToUserData()}
        onBack={() => setCurrentView('onboarding')}
      />
    );
  }

  // Mostrar sistema inteligente
  if (currentView === 'intelligent') {
    return (
      <IntelligentSystem 
        userProfile={convertToUserProfile()}
        onBack={() => setCurrentView('onboarding')}
      />
    );
  }

  // Mostrar modo interactivo
  if (currentView === 'interactive') {
    return (
      <InteractiveOnboarding 
        onBack={() => setCurrentView('onboarding')}
        onComplete={(userData) => {
          setData(userData);
          setCurrentView('offers');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* MENSAJE PERMANENTE OBLIGATORIO - SIEMPRE VISIBLE */}
      <div className="bg-neza-blue-600 text-white py-3 px-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-neza-cyan-200" />
          <p className="text-center font-medium">
            Por favor, no nos mientas. Esta información es clave para brindarte los mejores productos.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header con contador regresivo */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800">NEZA Financial</h1>
            <p className="text-slate-600">Tu camino hacia la mejor opción financiera</p>
          </div>
          
          <div className="flex gap-2 items-center">
            {countdownDays !== null && (
              <div className="bg-neza-blue-100 border border-neza-blue-300 rounded-lg px-3 py-2 text-center">
                <div className="flex items-center gap-1 text-neza-blue-700">
                  <Clock className="w-4 h-4" />
                  <span className="font-bold">{countdownDays}</span>
                </div>
                <div className="text-xs text-neza-blue-600">días restantes</div>
              </div>
            )}
            <Button
              onClick={() => setCurrentView('interactive')}
              variant="outline"
              className="bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Modo Interactivo
            </Button>
          </div>
        </div>

        {/* Progress Bar - mejorado con flujo continuo */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {[1, 2, 3].map((step) => (
                  <motion.div 
                    key={step} 
                    className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all font-bold cursor-pointer
                      ${currentStep === step 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110' 
                        : currentStep > step 
                          ? 'bg-green-500 border-green-500 text-white shadow-md'
                          : 'bg-white border-slate-300 text-slate-400'
                      }
                    `}
                    whileHover={{ scale: currentStep >= step ? 1.1 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => currentStep >= step && setCurrentStep(step)}
                  >
                    {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                  </motion.div>
                ))}
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{getProgressPercentage()}%</div>
                <div className="text-sm text-slate-600">Completado</div>
                <div className="text-xs text-green-600">✓ Validado SBS</div>
              </div>
            </div>
            
            <Progress value={getProgressPercentage()} className="h-3 mb-4" />
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className={`text-center transition-colors ${currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                <div className="font-semibold">1. Datos Personales</div>
                <div className="text-xs">Verificación segura DNI</div>
              </div>
              <div className={`text-center transition-colors ${currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                <div className="font-semibold">2. Productos Financieros</div>
                <div className="text-xs">Catálogo completo del mercado</div>
              </div>
              <div className={`text-center transition-colors ${currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                <div className="font-semibold">3. Perfil Personalizado</div>
                <div className="text-xs">Recomendaciones inteligentes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AsesorIA con progreso del usuario */}
        <AnimatePresence mode="wait">
          {showAsesorIA && (
            <motion.div 
              key="asesor"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <AsesorIA
                message={asesorMessages[currentStep as keyof typeof asesorMessages]}
                onClose={() => setShowAsesorIA(false)}
                onReopen={() => setShowAsesorIA(true)}
                currentStep={currentStep}
                userProgress={getUserProgress()}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content con transiciones fluidas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <PersonalDataStep
                data={data.personalData}
                onUpdate={handlePersonalDataUpdate}
                onNext={() => setCurrentStep(2)}
                isReturningUser={data.isReturningUser}
              />
            )}
            
            {currentStep === 2 && (
              <FinancialInfoStep
                data={data.financialInfo}
                personalData={data.personalData}
                onUpdate={handleFinancialInfoUpdate}
                onNext={() => setCurrentStep(3)}
                onPrev={() => setCurrentStep(1)}
              />
            )}
            
            {currentStep === 3 && (
              <ClientProfileStep
                data={data.clientProfile}
                onUpdate={handleClientProfileUpdate}
                onNext={() => setCurrentView('offers')}
                onPrev={() => setCurrentStep(2)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation mejorada */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          <div className="flex gap-2">
            {currentStep === 3 && canProceedToNext() && (
              <>
                <Button
                  onClick={handleViewIntelligentSystem}
                  variant="outline"
                  className="flex items-center gap-2 bg-purple-50 border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  <Sparkles className="w-4 h-4" />
                  Sistema Inteligente SBS
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6"
                >
                  🎯 Ver Mis Ofertas Personalizadas
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
            
            {currentStep < 3 && (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 font-semibold px-6"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Footer con información SBS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center text-xs text-slate-500"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Plataforma certificada y supervisada por la Superintendencia de Banca y Seguros (SBS)</span>
          </div>
          <p>Todos los productos mostrados corresponden a entidades financieras registradas y autorizadas</p>
        </motion.div>
      </div>
    </div>
  );
};
