import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalDataStep } from "./steps/PersonalDataStep";
import { FinancialInfoStep } from "./steps/FinancialInfoStep";
import { ClientProfileStep } from "./steps/ClientProfileStep";
import { ProductListView } from "./steps/ProductListView";
import { DocumentUpload } from "./DocumentUpload";
import { InteractiveTutorial } from "./InteractiveTutorial";
import { VideoModal } from "./VideoModal";
import { UserData } from "@/types/user";
import { userTrackingService } from "@/services/userTracking";

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
  monthlyIncome: number;
  hasOtherDebts: string;
  otherDebtsAmount: number;
  bankingRelationship: string;
  preferredBank: string;
}

interface ClientProfile {
  creditHistory: string;
  urgencyLevel: string;
}

interface ProductSelection {
  amount: number;
  goal: string;
  workSituation: string;
  workDetails: string;
  hasPayslips: string;
  documents: {
    dni: File | null;
    payslips: File | null;
    others: File | null;
  };
}

const initialPersonalData: PersonalData = {
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
  otpVerified: false,
};

const initialFinancialInfo: FinancialInfo = {
  monthlyIncome: 0,
  hasOtherDebts: "no",
  otherDebtsAmount: 0,
  bankingRelationship: "ninguno",
  preferredBank: "",
};

const initialClientProfile: ClientProfile = {
  creditHistory: "nuevo",
  urgencyLevel: "normal",
};

const initialProductSelection: ProductSelection = {
  amount: 5000,
  goal: "libre",
  workSituation: "empleado",
  workDetails: "",
  hasPayslips: "si",
  documents: {
    dni: null,
    payslips: null,
    others: null,
  },
};

interface HumanAdvisoryExperienceProps {
  onBack: () => void;
  onComplete: (data: UserData) => void;
  forceFlow?: boolean;
  isReturningUser?: boolean;
}

export const HumanAdvisoryExperience = ({ onBack, onComplete, forceFlow = false, isReturningUser = false }: HumanAdvisoryExperienceProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [personalData, setPersonalData] = useState<PersonalData>(initialPersonalData);
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>(initialFinancialInfo);
  const [clientProfile, setClientProfile] = useState<ClientProfile>(initialClientProfile);
  const [productSelection, setProductSelection] = useState<ProductSelection>(initialProductSelection);
  const [showTutorial, setShowTutorial] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    if (!forceFlow) {
      setShowTutorial(true);
    }
  }, [forceFlow]);

  const handleComplete = () => {
    const data = {
      personalInfo: personalData,
      monthlyIncome: financialInfo.monthlyIncome,
      hasOtherDebts: financialInfo.hasOtherDebts,
      otherDebtsAmount: financialInfo.otherDebtsAmount,
      bankingRelationship: financialInfo.bankingRelationship,
      preferredBank: financialInfo.preferredBank,
      creditHistory: clientProfile.creditHistory,
      urgencyLevel: clientProfile.urgencyLevel,
      amount: productSelection.amount,
      goal: productSelection.goal,
      workSituation: productSelection.workSituation,
      workDetails: productSelection.workDetails,
      hasPayslips: productSelection.hasPayslips,
      documents: productSelection.documents
    };
    onComplete(data as UserData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalDataStep
            data={personalData}
            onUpdate={setPersonalData}
            onNext={() => setCurrentStep(1)}
            isReturningUser={isReturningUser}
          />
        );
      case 1:
        return (
          <FinancialInfoStep
            data={financialInfo}
            onUpdate={setFinancialInfo}
            onNext={() => setCurrentStep(2)}
            onPrev={() => setCurrentStep(0)}
          />
        );
      case 2:
        return (
          <ClientProfileStep
            data={clientProfile}
            onUpdate={setClientProfile}
            onNext={() => setCurrentStep(3)}
            onPrev={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <ProductListView
            data={productSelection}
            onUpdate={setProductSelection}
            onNext={() => setCurrentStep(4)}
            onPrev={() => setCurrentStep(2)}
          />
        );
      case 4:
        return (
          <DocumentUpload
            onComplete={handleComplete}
            onPrev={() => setCurrentStep(3)}
            personalData={personalData}
            financialInfo={financialInfo}
            clientProfile={clientProfile}
            productSelection={productSelection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
      <InteractiveTutorial
        open={showTutorial}
        onClose={() => setShowTutorial(false)}
        onVideo={() => setVideoOpen(true)}
      />

      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={onBack} className="text-blue-500 hover:bg-blue-50">
            Volver
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2024 Neza. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
