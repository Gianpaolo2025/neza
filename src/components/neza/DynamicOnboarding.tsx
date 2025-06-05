import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Shield, Sparkles } from "lucide-react";
import { PersonalDataStep } from "./steps/PersonalDataStep";
import { FinancialInfoStep } from "./steps/FinancialInfoStep";
import { ClientProfileStep } from "./steps/ClientProfileStep";
import { AsesorIA } from "./AsesorIA";
import { OffersDashboard } from "@/components/OffersDashboard";
import { IntelligentSystem } from "./IntelligentSystem";
import { DocumentAnalyzer } from "@/services/documentAnalyzer";

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
  const [currentView, setCurrentView] = useState<'onboarding' | 'offers' | 'intelligent'>('onboarding');
  const [data, setData] = useState<OnboardingData>({
    personalData: {
      firstName: "",
      lastName: "",
      dni: "",
      birthDate: "",
      email: "",
      phone: "",
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
      urgencyLevel: ""
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

  const asesorMessages = {
    1: `¡Hola! Soy AsesorIA, tu asistente financiera personal. Te acompañaré paso a paso para encontrar la mejor opción financiera para ti. ${data.isReturningUser ? '¡Me alegra verte de nuevo!' : 'Empecemos con tus datos personales de forma segura.'}`,
    2: "¡Perfecto! Ahora cuéntame sobre tus necesidades financieras. Te ayudaré a elegir el producto ideal y el monto adecuado según tu situación.",
    3: "Excelente progreso. Estas preguntas me ayudan a conocerte mejor para darte recomendaciones más precisas. ¡Casi terminamos!"
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
  };

  const handleFinancialInfoUpdate = (financialInfo: FinancialInfo) => {
    setData(prev => ({ ...prev, financialInfo }));
  };

  const handleClientProfileUpdate = (clientProfile: ClientProfile) => {
    setData(prev => ({ ...prev, clientProfile }));
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
      // Al completar el onboarding, mostrar ofertas
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
      productType: data.financialInfo.productType,
      employmentType: data.financialInfo.employmentType,
      hasOtherDebts: data.financialInfo.hasOtherDebts,
      bankingRelationship: data.financialInfo.bankingRelationship,
      urgencyLevel: data.financialInfo.urgencyLevel,
      creditHistory: data.clientProfile.hasPreviousCredit ? "bueno" : "nuevo",
      preferredBank: ""
    };
  };

  const convertToUserProfile = () => {
    return DocumentAnalyzer.createMockProfile({
      firstName: data.personalData.firstName,
      lastName: data.personalData.lastName,
      age: new Date().getFullYear() - new Date(data.personalData.birthDate).getFullYear(),
      monthlyIncome: data.financialInfo.monthlyIncome,
      employmentType: data.financialInfo.employmentType,
      hasPreviousCredit: data.clientProfile.hasPreviousCredit
    });
  };

  // Mostrar sistema de ofertas
  if (currentView === 'offers') {
    return (
      <OffersDashboard 
        user={convertToUserData()}
        onBack={handleBackToOnboarding}
      />
    );
  }

  // Mostrar sistema inteligente
  if (currentView === 'intelligent') {
    return (
      <IntelligentSystem 
        userProfile={convertToUserProfile()}
        onBack={handleBackToOnboarding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800">NEZA Onboarding</h1>
            <p className="text-slate-600">Tu camino hacia la mejor opción financiera</p>
          </div>
          
          <div className="w-24" />
        </div>

        {/* Progress Bar */}
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                    ${currentStep === step 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : currentStep > step 
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-slate-300 text-slate-400'
                    }
                  `}>
                    {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                ))}
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{getProgressPercentage()}%</div>
                <div className="text-sm text-slate-600">Completado</div>
              </div>
            </div>
            
            <Progress value={getProgressPercentage()} className="h-2 mb-4" />
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-slate-400'}>
                1. Datos Personales
              </div>
              <div className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-slate-400'}>
                2. Info. Financiera
              </div>
              <div className={currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-slate-400'}>
                3. Perfil del Cliente
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AsesorIA */}
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
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content */}
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
              onNext={handleNext}
              isReturningUser={data.isReturningUser}
            />
          )}
          
          {currentStep === 2 && (
            <FinancialInfoStep
              data={data.financialInfo}
              onUpdate={handleFinancialInfoUpdate}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          
          {currentStep === 3 && (
            <ClientProfileStep
              data={data.clientProfile}
              onUpdate={handleClientProfileUpdate}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
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
                  Sistema Inteligente
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  Ver Ofertas
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
            
            {currentStep < 3 && (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                className="flex items-center gap-2"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
