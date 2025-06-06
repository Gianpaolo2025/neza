
import { useState } from "react";
import { OffersDashboard } from "@/components/OffersDashboard";
import { Header } from "@/components/Header";
import { AsesorIAChat } from "@/components/AsesorIAChat";
import { useAsesorIA } from "@/hooks/useAsesorIA";
import { InteractiveOnboarding } from "@/components/neza/InteractiveOnboarding";

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
  productType?: string;
  hasOtherDebts?: string;
  bankingRelationship?: string;
  urgencyLevel?: string;
  preferredBank?: string;
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
      productType: userData.financialInfo?.productType || '',
      hasOtherDebts: userData.financialInfo?.hasOtherDebts || '',
      bankingRelationship: userData.financialInfo?.bankingRelationship || '',
      urgencyLevel: userData.financialInfo?.urgencyLevel || '',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50">
      <Header />
      
      {!isRegistered ? (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Bienvenido a tu Asesor Financiero Personal
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              AsesorIA te guiará paso a paso para encontrar los mejores productos financieros del mercado peruano, 
              supervisados por la SBS y ordenados especialmente para tu perfil.
            </p>
          </div>
          
          <InteractiveOnboarding 
            onBack={() => {}} 
            onComplete={handleUserRegistration}
          />
        </div>
      ) : (
        <OffersDashboard user={user!} onBack={handleBackToForm} />
      )}

      {/* AsesorIA Chat Global */}
      <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
    </div>
  );
};

export default Index;
