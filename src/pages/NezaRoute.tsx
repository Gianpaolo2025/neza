
import { useUserContext } from "@/context/UserContext";
import { UserOnboarding } from "@/components/neza/UserOnboarding";
import { InteractiveTutorial } from "@/components/neza/InteractiveTutorial";
import { AsesorIA } from "@/components/neza/AsesorIA";
import { ProductCatalog } from "@/components/neza/ProductCatalog";
import { DocumentUpload } from "@/components/neza/DocumentUpload";
import { VerificationStatus } from "@/components/neza/VerificationStatus";
import { WelcomeBack } from "@/components/neza/WelcomeBack";

const NezaRoute = () => {
  const { currentStep, setCurrentStep } = useUserContext();

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(Math.max(0, currentStep - 1));
  const resetToStart = () => setCurrentStep(0);

  // Mock data for components that need it
  const mockUserData = {
    dni: "12345678",
    email: "usuario@ejemplo.com", 
    phone: "987654321",
    monthlyIncome: "5000"
  };

  const mockDocumentStatus = {
    payslips: 'pending' as const,
    workCertificate: 'pending' as const,
    creditReport: 'pending' as const,
    incomeProof: 'pending' as const
  };

  return (
    <>
      {currentStep === 0 && (
        <WelcomeBack 
          firstName="Gianpaolo" 
          currentStep={0} 
          onContinue={nextStep}
          onStartFresh={resetToStart}
          onBack={prevStep}
        />
      )}
      {currentStep === 1 && (
        <UserOnboarding 
          onBack={prevStep}
        />
      )}
      {currentStep === 2 && (
        <InteractiveTutorial 
          isVisible={true}
          onClose={nextStep}
        />
      )}
      {currentStep === 3 && (
        <AsesorIA 
          message="¡Hola! Soy tu asesora financiera virtual. Estoy aquí para ayudarte en todo el proceso."
          onClose={nextStep}
          onReopen={() => {}}
          currentStep={currentStep}
        />
      )}
      {currentStep === 4 && (
        <ProductCatalog 
          onBack={prevStep}
        />
      )}
      {currentStep === 5 && (
        <DocumentUpload 
          title="Sube tus documentos"
          description="Por favor sube los documentos requeridos"
          required={true}
          documentType="general"
          onUpload={() => {}}
          status="pending"
        />
      )}
      {currentStep === 6 && (
        <VerificationStatus 
          userData={mockUserData}
          documentStatus={mockDocumentStatus}
          onBack={prevStep}
        />
      )}
      {currentStep > 6 && <h2>¡Proceso terminado!</h2>}
    </>
  );
};

export default NezaRoute;
