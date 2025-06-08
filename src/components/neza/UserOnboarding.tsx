
import { useState } from "react";
import { DynamicOnboarding } from "./DynamicOnboarding";
import { HumanAdvisoryExperience } from "./HumanAdvisoryExperience";
import { OffersDashboard } from "@/components/OffersDashboard";

interface UserOnboardingProps {
  onBack: () => void;
}

export const UserOnboarding = ({ onBack }: UserOnboardingProps) => {
  const [currentView, setCurrentView] = useState<'advisory' | 'offers'>('advisory');
  const [userData, setUserData] = useState(null);

  const handleComplete = (data: any) => {
    // Convertir datos de la experiencia humana al formato esperado
    const convertedData = {
      firstName: data.personalInfo.firstName,
      lastName: data.personalInfo.lastName,
      dni: data.personalInfo.dni,
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      monthlyIncome: data.monthlyIncome,
      requestedAmount: data.amount,
      productType: data.goal === 'casa' ? 'credito-hipotecario' : 
                   data.goal === 'auto' ? 'credito-vehicular' : 'credito-personal',
      employmentType: data.employmentType,
      hasOtherDebts: 'no', // Eliminamos esta pregunta según los requisitos
      bankingRelationship: data.preferredBank || 'ninguno',
      urgencyLevel: 'normal', // Valor por defecto
      creditHistory: data.hasPayslips === 'si' ? 'bueno' : 'nuevo',
      preferredBank: data.preferredBank || ''
    };
    
    setUserData(convertedData);
    setCurrentView('offers');
  };

  if (currentView === 'offers' && userData) {
    return (
      <OffersDashboard 
        user={userData}
        onBack={() => setCurrentView('advisory')}
      />
    );
  }

  return (
    <HumanAdvisoryExperience 
      onBack={onBack}
      onComplete={handleComplete}
    />
  );
};
