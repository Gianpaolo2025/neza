
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, ArrowLeft, Target, Sparkles } from "lucide-react";
import { userTrackingService } from "@/services/userTracking";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  explanation: string;
  importance: string;
  howToContinue: string;
}

interface QuestionsTutorialProps {
  isVisible: boolean;
  onClose: () => void;
  currentFormStep: number;
}

export const QuestionsTutorial = ({ isVisible, onClose, currentFormStep }: QuestionsTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps: TutorialStep[] = [
    {
      id: "goal-selection",
      title: "Paso 1: ¿Qué buscas hoy?",
      description: "Selecciona tu objetivo financiero principal",
      explanation: "Aquí debes elegir el tipo de producto financiero que necesitas: crédito personal, vehicular, hipotecario, tarjeta de crédito, etc.",
      importance: "Esta selección es crucial porque cada producto tiene diferentes tasas, plazos y requisitos. Nos ayuda a encontrar las mejores ofertas específicas para tu necesidad.",
      howToContinue: "Selecciona una opción y presiona 'Continuar' para avanzar al siguiente paso."
    },
    {
      id: "personal-info",
      title: "Paso 2: Datos Personales",
      description: "Completa tu información básica y de contacto",
      explanation: "Necesitamos tus datos personales para verificar tu identidad y contactarte con las mejores ofertas.",
      importance: "Los bancos requieren esta información para evaluar tu perfil. Datos precisos aumentan tus posibilidades de aprobación.",
      howToContinue: "Llena todos los campos requeridos: nombres, apellidos, DNI, email, teléfono y fecha de nacimiento, luego presiona 'Continuar'."
    },
    {
      id: "amount-selection",
      title: "Paso 3: Monto del Préstamo",
      description: "Define cuánto dinero necesitas",
      explanation: "Puedes elegir un monto predefinido o escribir la cantidad exacta que necesitas.",
      importance: "El monto determina las condiciones del préstamo: tasas de interés, plazos y cuotas mensuales. Un monto realista mejora tus opciones.",
      howToContinue: "Selecciona o escribe el monto deseado y presiona 'Continuar'."
    },
    {
      id: "work-situation",
      title: "Paso 4: Situación Laboral",
      description: "Informa sobre tu trabajo e ingresos",
      explanation: "Necesitamos conocer tu situación laboral actual, ingresos mensuales y si tienes boletas de pago disponibles.",
      importance: "Tu estabilidad laboral e ingresos son factores clave para la aprobación. Los bancos evalúan tu capacidad de pago.",
      howToContinue: "Completa todos los campos sobre tu trabajo, ingresos y documentos disponibles, luego presiona 'Continuar'."
    },
    {
      id: "documents",
      title: "Paso 5: Documentos",
      description: "Sube los documentos necesarios",
      explanation: "Puedes subir tu DNI, boletas de pago y otros documentos que respalden tu solicitud.",
      importance: "Los documentos verifican la información proporcionada y aceleran el proceso de evaluación de los bancos.",
      howToContinue: "Sube los documentos disponibles y presiona '¡Ver mis ofertas!' para finalizar."
    }
  ];

  // Sincronizar el tutorial con el paso actual del formulario
  useEffect(() => {
    if (isVisible && currentFormStep > 0 && currentFormStep <= tutorialSteps.length) {
      setCurrentStep(currentFormStep - 1);
    }
  }, [currentFormStep, isVisible]);

  const currentStepData = tutorialSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      userTrackingService.trackActivity(
        'tutorial_step_completed',
        { step: currentStep + 1, stepId: currentStepData.id },
        `Usuario completó paso ${currentStep + 1} del tutorial de preguntas`
      );
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleClose = () => {
    userTrackingService.trackActivity(
      'tutorial_completed',
      { totalSteps: tutorialSteps.length, completedSteps: currentStep + 1 },
      'Usuario completó o cerró el tutorial de preguntas'
    );
    onClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Tutorial Card - Fixed bottom bar, positioned above the tutorial button */}
      <div className="fixed bottom-12 left-0 right-0 z-[80] w-full bg-white border-t-2 border-blue-900 shadow-lg">
        <div className="container mx-auto max-w-6xl px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            {/* Tutorial content */}
            <div className="flex items-start gap-3 flex-1">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-900 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-900 font-bold">
                    Tutorial Preguntas - {currentStep + 1} de {tutorialSteps.length}
                  </span>
                  <Target className="w-4 h-4 text-blue-900" />
                  <span className="text-sm font-semibold text-blue-900">
                    {currentStepData.title}
                  </span>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div><strong>Qué llenar:</strong> {currentStepData.explanation}</div>
                  <div><strong>Por qué es importante:</strong> {currentStepData.importance}</div>
                  <div><strong>Cómo continuar:</strong> {currentStepData.howToContinue}</div>
                </div>
              </div>
            </div>

            {/* Tutorial controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-1 border-blue-900 text-blue-900 hover:bg-blue-50 text-xs px-2 py-1 h-7"
              >
                <ArrowLeft className="w-3 h-3" />
                Anterior
              </Button>
              
              <div className="flex gap-1">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentStep ? 'bg-blue-900' : 'bg-blue-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                onClick={handleNext}
                className="bg-blue-900 hover:bg-blue-800 flex items-center gap-1 text-white text-xs px-2 py-1 h-7"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
                <ArrowRight className="w-3 h-3" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-1 h-7 w-7 hover:bg-blue-100 text-blue-900"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
