
import { useState } from "react";
import { HumanAdvisoryExperience } from "./HumanAdvisoryExperience";
import { AuctionValidator } from "./AuctionValidator";
import { OffersDashboard } from "@/components/OffersDashboard";
import { UserData } from "@/types/user";
import { userTrackingService } from "@/services/userTracking";

interface UserOnboardingProps {
  onBack: () => void;
  forceFlow?: boolean;
}

export const UserOnboarding = ({ onBack, forceFlow = false }: UserOnboardingProps) => {
  const [currentView, setCurrentView] = useState<'advisory' | 'validation' | 'offers'>('advisory');
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleComplete = (data: any) => {
    // Convert data from the experience to expected format
    const convertedData: UserData = {
      firstName: data.personalInfo.firstName,
      lastName: data.personalInfo.lastName,
      dni: data.personalInfo.dni,
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      monthlyIncome: data.monthlyIncome,
      requestedAmount: data.amount,
      productType: data.goal,
      employmentType: data.workSituation === 'empleado' ? 'dependiente' : 
                     data.workSituation === 'independiente' ? 'independiente' :
                     data.workSituation === 'empresario' ? 'empresario' : 
                     data.workSituation === 'estudiante' ? 'estudiante' : 'otro',
      hasOtherDebts: 'no',
      bankingRelationship: data.preferredBank || 'ninguno',
      urgencyLevel: 'normal',
      creditHistory: data.hasPayslips === 'si' ? 'bueno' : 'nuevo',
      preferredBank: data.preferredBank || '',
      emailVerified: data.personalInfo.emailVerified,
      workDetails: data.workDetails,
      documents: data.documents
    };
    
    // Start tracking session if not exists
    if (!userTrackingService['currentSessionId']) {
      userTrackingService.startSession(
        convertedData.email, 
        forceFlow ? 'product_request' : 'onboarding', 
        `Solicitud de ${convertedData.productType} por S/ ${convertedData.requestedAmount.toLocaleString()}`
      );
    }

    // Register onboarding completion
    userTrackingService.trackActivity(
      'form_submit',
      { ...convertedData, forceFlow },
      `Onboarding completado - Solicitud de ${convertedData.productType}`,
      convertedData.productType
    );

    // Update user profile with all information
    userTrackingService.updateUserProfile(convertedData.email, {
      firstName: convertedData.firstName,
      lastName: convertedData.lastName,
      dni: convertedData.dni,
      phone: convertedData.phone,
      monthlyIncome: convertedData.monthlyIncome,
      currentRequest: `${convertedData.productType} - S/ ${convertedData.requestedAmount.toLocaleString()}`,
      currentStatus: 'applying',
      tags: [convertedData.productType, convertedData.employmentType, convertedData.urgencyLevel]
    }, 'Onboarding completado con información completa');

    // Register specific event
    userTrackingService.addUserEvent(
      convertedData.email,
      userTrackingService['currentSessionId'] || 'system',
      'form_update',
      `Usuario completó onboarding para ${convertedData.productType}`,
      {
        productType: convertedData.productType,
        requestedAmount: convertedData.requestedAmount,
        monthlyIncome: convertedData.monthlyIncome,
        urgencyLevel: convertedData.urgencyLevel,
        forceFlow
      },
      true
    );
    
    setUserData(convertedData);
    setCurrentView('validation');
  };

  const handleValidationSuccess = () => {
    if (userData) {
      userTrackingService.updateUserStatus(
        userData.email,
        'qualified',
        'Usuario calificó para subasta y está evaluando ofertas'
      );
      setCurrentView('offers');
    }
  };

  const handleValidationRetry = () => {
    setCurrentView('advisory');
  };

  if (currentView === 'offers' && userData) {
    return (
      <OffersDashboard 
        user={userData}
        onBack={() => {
          userTrackingService.trackActivity(
            'button_click',
            { action: 'back_to_validation', forceFlow },
            'Usuario regresó del dashboard de ofertas a la validación'
          );
          setCurrentView('validation');
        }}
      />
    );
  }

  if (currentView === 'validation' && userData) {
    return (
      <AuctionValidator
        userData={userData}
        onRetry={handleValidationRetry}
        onBack={() => {
          userTrackingService.trackActivity(
            'button_click',
            { action: 'back_to_onboarding_from_validation', forceFlow },
            'Usuario regresó de validación al onboarding'
          );
          setCurrentView('advisory');
        }}
        onProceedToAuction={handleValidationSuccess}
      />
    );
  }

  return (
    <HumanAdvisoryExperience 
      onBack={() => {
        // Register abandonment of onboarding
        userTrackingService.trackActivity(
          'form_abandon',
          { step: 'advisory', reason: 'user_back_button', forceFlow },
          forceFlow ? 'Usuario abandonó el flujo obligatorio de solicitud' : 'Usuario abandonó el proceso de onboarding'
        );
        onBack();
      }}
      onComplete={handleComplete}
      forceFlow={forceFlow}
    />
  );
};
