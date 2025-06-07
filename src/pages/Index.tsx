
import { useState } from "react";
import { OffersDashboard } from "@/components/OffersDashboard";
import { Header } from "@/components/Header";
import { AsesorIAChat } from "@/components/AsesorIAChat";
import { useAsesorIA } from "@/hooks/useAsesorIA";
import { InteractiveOnboarding } from "@/components/neza/InteractiveOnboarding";
import { BankCarousel } from "@/components/BankCarousel";
import { VeracityMessage } from "@/components/VeracityMessage";

export interface UserData {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  requestedAmount: number;
  employmentType: string;
  creditHistory: string;
  productType: string; // Made required to match User interface
  hasOtherDebts: string; // Made required to match User interface
  bankingRelationship: string; // Made required to match User interface
  urgencyLevel: string; // Made required to match User interface
  preferredBank: string; // Made required to match User interface
}

const Index = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const { isChatOpen, toggleChat } = useAsesorIA();

  const handleUserRegistration = (userData: any) => {
    // Convertir datos del InteractiveOnboarding al formato UserData
    const convertedUserData: UserData = {
      dni: userData.personalData?.dni || '',
      firstName: userData.personalData?.firstName || '',
      lastName: userData.personalData?.lastName || '',
      email: userData.personalData?.email || '',
      phone: userData.personalData?.phone || '',
      monthlyIncome: userData.financialInfo?.monthlyIncome || 0,
      requestedAmount: userData.financialInfo?.requestedAmount || 0,
      employmentType: userData.financialInfo?.employmentType || '',
      creditHistory: userData.clientProfile?.hasPreviousCredit ? "bueno" : "nuevo",
      productType: userData.financialInfo?.productType || 'credito-personal', // Ensure productType is always set
      hasOtherDebts: userData.financialInfo?.hasOtherDebts || 'no',
      bankingRelationship: userData.financialInfo?.bankingRelationship || 'ninguna',
      urgencyLevel: userData.financialInfo?.urgencyLevel || 'no-urgente',
      preferredBank: ''
    };
    
    setUser(convertedUserData);
    setIsRegistered(true);
  };

  const handleBackToForm = () => {
    setIsRegistered(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <Header />
      
      {!isRegistered ? (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent mb-6">
              Tu Asesor Financiero Personal
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              AsesorIA te guiará paso a paso para encontrar los mejores productos financieros del mercado peruano, 
              supervisados por la SBS y ordenados especialmente para tu perfil.
            </p>
          </div>
          
          {/* Mensaje de veracidad */}
          <VeracityMessage />
          
          {/* Formulario de onboarding */}
          <InteractiveOnboarding 
            onBack={() => {}} 
            onComplete={handleUserRegistration}
          />
          
          {/* Carrusel de bancos colaboradores */}
          <BankCarousel />
        </div>
      ) : (
        <OffersDashboard user={user!} onBack={handleBackToForm} />
      )}

      {/* AsesorIA Chat - Solo ícono flotante discreto */}
      <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
    </div>
  );
};

export default Index;
