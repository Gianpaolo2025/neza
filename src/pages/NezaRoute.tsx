
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

  return (
    <>
      {currentStep === 0 && <WelcomeBack firstName="Gianpaolo" currentStep={0} onContinue={nextStep} />}
      {currentStep === 1 && <UserOnboarding />}
      {currentStep === 2 && <InteractiveTutorial />}
      {currentStep === 3 && <AsesorIA />}
      {currentStep === 4 && <ProductCatalog />}
      {currentStep === 5 && <DocumentUpload />}
      {currentStep === 6 && <VerificationStatus />}
      {currentStep > 6 && <h2>¡Proceso terminado!</h2>}
    </>
  );
};

export default NezaRoute;
