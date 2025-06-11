
import { useState, useEffect } from "react";
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
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    // Detectar si es un usuario nuevo o que regresa
    const savedEmail = localStorage.getItem('nezaUserEmail');
    const savedData = localStorage.getItem('nezaPersonalData');
    const hasSessionData = localStorage.getItem('nezaSessionData');
    
    // Es usuario que regresa si tiene email guardado Y datos guardados Y datos de sesión
    const returning = !!(savedEmail && savedData && hasSessionData);
    setIsReturningUser(returning);
    
    console.log('Detección de usuario:', {
      isReturning: returning,
      hasSavedEmail: !!savedEmail,
      hasSavedData: !!savedData,
      hasSessionData: !!hasSessionData
    });
    
    // Si es usuario completamente nuevo, limpiar todo al inicio
    if (!returning && (savedData || savedEmail)) {
      console.log('Usuario nuevo detectado - Limpiando datos previos en UserOnboarding');
      localStorage.removeItem('nezaPersonalData');
      localStorage.removeItem('nezaHumanAdvisoryData');
      localStorage.removeItem('nezaUserEmail');
      localStorage.removeItem('nezaSessionData');
    }
  }, []);

  const saveUserToAdmin = (data: UserData) => {
    // Get existing admin users array
    const adminUsers = JSON.parse(localStorage.getItem('nezaAdminUsers') || '[]');
    
    const userRecord = {
      id: Date.now().toString(),
      fullName: `${data.firstName} ${data.lastName}`,
      dni: data.dni,
      email: data.email,
      birthDate: data.birthDate || '',
      phone: data.phone,
      monthlyIncome: data.monthlyIncome,
      requestedAmount: data.requestedAmount,
      productType: data.productType,
      employmentType: data.employmentType,
      workDetails: data.workDetails || '',
      documents: {
        dni: data.documents?.dni ? data.documents.dni.name : null,
        payslips: data.documents?.payslips ? data.documents.payslips.name : null,
        others: data.documents?.others ? data.documents.others.name : null
      },
      processStatus: 'Completó formulario',
      currentStep: 'Ofertas disponibles',
      registrationDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };

    // Check if user already exists (by email)
    const existingUserIndex = adminUsers.findIndex((user: any) => user.email === data.email);
    
    if (existingUserIndex >= 0) {
      // Update existing user
      adminUsers[existingUserIndex] = { ...adminUsers[existingUserIndex], ...userRecord, lastUpdate: new Date().toISOString() };
      console.log('Usuario actualizado en admin:', userRecord.email);
    } else {
      // Add new user to the array
      adminUsers.push(userRecord);
      console.log('Nuevo usuario guardado en admin:', userRecord.email);
    }
    
    // Save updated array back to localStorage
    localStorage.setItem('nezaAdminUsers', JSON.stringify(adminUsers));
    console.log('Total usuarios en admin:', adminUsers.length);
  };

  const handleComplete = (data: any) => {
    // Convert data from the experience to expected format
    const convertedData: UserData = {
      firstName: data.personalInfo.firstName,
      lastName: data.personalInfo.lastName,
      dni: data.personalInfo.dni,
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      birthDate: data.personalInfo.birthDate,
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
      emailVerified: true,
      workDetails: data.workDetails,
      documents: data.documents
    };
    
    // Marcar usuario como confirmado y guardar datos de sesión
    localStorage.setItem('nezaUserEmail', convertedData.email);
    localStorage.setItem('nezaSessionData', JSON.stringify({
      email: convertedData.email,
      timestamp: Date.now(),
      confirmed: true
    }));
    
    // Save to admin IMMEDIATELY when step 2 is completed
    saveUserToAdmin(convertedData);
    
    setUserData(convertedData);
    
    // Continue with existing tracking logic
    if (!userTrackingService['currentSessionId']) {
      userTrackingService.startSession(
        convertedData.email, 
        forceFlow ? 'product_request' : 'onboarding', 
        `Solicitud de ${convertedData.productType} por S/ ${convertedData.requestedAmount.toLocaleString()}`
      );
    }

    userTrackingService.trackActivity(
      'form_submit',
      { ...convertedData, forceFlow, isReturningUser },
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
        forceFlow,
        isReturningUser
      },
      true
    );
    
    // Set view to offers and prevent any further navigation
    setCurrentView('offers');
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

  // Render offers dashboard - this should be the stable final view
  if (currentView === 'offers' && userData) {
    return (
      <OffersDashboard 
        user={userData}
        onBack={() => {
          userTrackingService.trackActivity(
            'button_click',
            { action: 'back_to_questions', forceFlow, isReturningUser },
            'Usuario regresó del dashboard de ofertas a las preguntas'
          );
          setCurrentView('advisory');
        }}
      />
    );
  }

  // This validation view should not be reached anymore since we skip it
  if (currentView === 'validation' && userData) {
    return (
      <AuctionValidator
        userData={userData}
        onRetry={handleValidationRetry}
        onBack={() => {
          userTrackingService.trackActivity(
            'button_click',
            { action: 'back_to_onboarding_from_validation', forceFlow, isReturningUser },
            'Usuario regresó de validación al onboarding'
          );
          setCurrentView('advisory');
        }}
        onProceedToAuction={handleValidationSuccess}
      />
    );
  }

  // Default view - advisory experience - pasar isReturningUser como prop
  return (
    <HumanAdvisoryExperience 
      onBack={() => {
        userTrackingService.trackActivity(
          'form_abandon',
          { step: 'advisory', reason: 'user_back_button', forceFlow, isReturningUser },
          forceFlow ? 'Usuario abandonó el flujo obligatorio de solicitud' : 'Usuario abandonó el proceso de onboarding'
        );
        onBack();
      }}
      onComplete={handleComplete}
      forceFlow={forceFlow}
      isReturningUser={isReturningUser}
    />
  );
};
