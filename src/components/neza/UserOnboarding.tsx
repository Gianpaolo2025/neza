
import { useState } from "react";
import { DynamicOnboarding } from "./DynamicOnboarding";
import { HumanAdvisoryExperience } from "./HumanAdvisoryExperience";
import { OffersDashboard } from "@/components/OffersDashboard";
import { UserData } from "@/types/user";
import { userTrackingService } from "@/services/userTracking";

interface UserOnboardingProps {
  onBack: () => void;
}

export const UserOnboarding = ({ onBack }: UserOnboardingProps) => {
  const [currentView, setCurrentView] = useState<'advisory' | 'offers'>('advisory');
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleComplete = (data: any) => {
    // Convertir datos de la experiencia humana al formato esperado
    const convertedData: UserData = {
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
      hasOtherDebts: 'no',
      bankingRelationship: data.preferredBank || 'ninguno',
      urgencyLevel: 'normal',
      creditHistory: data.hasPayslips === 'si' ? 'bueno' : 'nuevo',
      preferredBank: data.preferredBank || ''
    };
    
    // Iniciar sesión de tracking si no existe
    if (!userTrackingService['currentSessionId']) {
      userTrackingService.startSession(
        convertedData.email, 
        'onboarding', 
        `Solicitud de ${convertedData.productType} por S/ ${convertedData.requestedAmount.toLocaleString()}`
      );
    }

    // Registrar la finalización del onboarding
    userTrackingService.trackActivity(
      'form_submit',
      convertedData,
      `Onboarding completado - Solicitud de ${convertedData.productType}`,
      convertedData.productType
    );

    // Actualizar perfil del usuario con toda la información
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

    // Registrar evento específico
    userTrackingService.addUserEvent(
      convertedData.email,
      userTrackingService['currentSessionId'] || 'system',
      'form_update',
      `Usuario completó onboarding para ${convertedData.productType}`,
      {
        productType: convertedData.productType,
        requestedAmount: convertedData.requestedAmount,
        monthlyIncome: convertedData.monthlyIncome,
        urgencyLevel: convertedData.urgencyLevel
      },
      true
    );

    // Cambiar estado a evaluando ofertas
    userTrackingService.updateUserStatus(
      convertedData.email,
      'pending',
      'Usuario está evaluando ofertas disponibles'
    );
    
    setUserData(convertedData);
    setCurrentView('offers');
  };

  if (currentView === 'offers' && userData) {
    return (
      <OffersDashboard 
        user={userData}
        onBack={() => {
          // Registrar el regreso al onboarding
          userTrackingService.trackActivity(
            'button_click',
            { action: 'back_to_onboarding' },
            'Usuario regresó del dashboard de ofertas al onboarding'
          );
          setCurrentView('advisory');
        }}
      />
    );
  }

  return (
    <HumanAdvisoryExperience 
      onBack={() => {
        // Registrar abandono del onboarding
        userTrackingService.trackActivity(
          'form_abandon',
          { step: 'advisory', reason: 'user_back_button' },
          'Usuario abandonó el proceso de onboarding'
        );
        onBack();
      }}
      onComplete={handleComplete}
    />
  );
};
