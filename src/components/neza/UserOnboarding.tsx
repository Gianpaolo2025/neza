
import { useState } from "react";
import { HumanAdvisoryExperience } from "./HumanAdvisoryExperience";
import { AuctionValidator } from "./AuctionValidator";
import { OffersDashboard } from "@/components/OffersDashboard";
import { UserData } from "@/types/user";
import { userTrackingService } from "@/services/userTracking";
import { Login } from "@/components/auth/Login";
import { Register } from "@/components/auth/Register";
import { useAuth } from "@/hooks/useAuth";

interface UserOnboardingProps {
  onBack: () => void;
  forceFlow?: boolean;
}

export const UserOnboarding = ({ onBack, forceFlow = false }: UserOnboardingProps) => {
  const [currentView, setCurrentView] = useState<'advisory' | 'validation' | 'offers' | 'auth'>('advisory');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const { user } = useAuth();

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
    
    setUserData(convertedData);
    
    // Check if user is authenticated before proceeding to validation
    if (!user) {
      setCurrentView('auth');
      return;
    }
    
    // Continue with tracking and validation if authenticated
    if (!userTrackingService['currentSessionId']) {
      userTrackingService.startSession(
        convertedData.email, 
        forceFlow ? 'product_request' : 'onboarding', 
        `Solicitud de ${convertedData.productType} por S/ ${convertedData.requestedAmount.toLocaleString()}`
      );
    }

    userTrackingService.trackActivity(
      'form_submit',
      { ...convertedData, forceFlow },
      `Onboarding completado - Solicitud de ${convertedData.productType}`,
      convertedData.productType
    );

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
    
    setCurrentView('validation');
  };

  const handleAuthSuccess = () => {
    if (userData) {
      setCurrentView('validation');
    }
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

  if (currentView === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 via-white to-neza-blue-50 flex items-center justify-center p-4">
        {showRegister ? (
          <div className="w-full max-w-md">
            <Register />
            <div className="text-center mt-4">
              <button
                onClick={() => setShowRegister(false)}
                className="text-neza-blue-600 hover:underline text-sm"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
            <div className="text-center mt-2">
              <button
                onClick={() => setCurrentView('advisory')}
                className="text-gray-500 hover:underline text-sm"
              >
                Volver al formulario
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <Login />
            <div className="text-center mt-4">
              <button
                onClick={() => setShowRegister(true)}
                className="text-neza-blue-600 hover:underline text-sm"
              >
                ¿No tienes cuenta? Regístrate
              </button>
            </div>
            <div className="text-center mt-2">
              <button
                onClick={() => setCurrentView('advisory')}
                className="text-gray-500 hover:underline text-sm"
              >
                Volver al formulario
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

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
