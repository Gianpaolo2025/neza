
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Target, Sparkles } from "lucide-react";
import { userTrackingService } from "@/services/userTracking";

interface TutorialStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
}

interface InteractiveTutorialProps {
  isVisible: boolean;
  onClose: () => void;
}

export const InteractiveTutorial = ({ isVisible, onClose }: InteractiveTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isHighlighting, setIsHighlighting] = useState(false);

  const tutorialSteps: TutorialStep[] = [
    {
      id: "welcome",
      target: "#products-section",
      title: "¡Bienvenido a NEZA!",
      description: "Te voy a mostrar cómo funciona nuestra plataforma de subasta financiera. ¡Empezamos!",
      position: "bottom"
    },
    {
      id: "catalog",
      target: "#products-section",
      title: "Catálogo de Productos",
      description: "Aquí puedes explorar todos nuestros productos financieros disponibles con información detallada de cada uno.",
      position: "bottom",
      highlight: true
    },
    {
      id: "request-button",
      target: "#interactive-experience",
      title: "Botón Solicitar",
      description: "Este es el botón principal para solicitar cualquier producto. Al presionarlo irás directamente al cuestionario obligatorio.",
      position: "top",
      highlight: true
    },
    {
      id: "auction-system",
      target: "#why-system",
      title: "Sistema de Subasta",
      description: "Aquí es donde la magia sucede: las entidades financieras compiten en tiempo real para darte las mejores condiciones.",
      position: "bottom"
    },
    {
      id: "questionnaire",
      target: "#interactive-experience",
      title: "Cuestionario de 8 Preguntas",
      description: "El formulario te hará 8 preguntas sobre tu perfil financiero. Por ejemplo: 'En esta pregunta debes seleccionar tu ingreso mensual, ya que influye en la oferta que recibirás.'",
      position: "top"
    },
    {
      id: "entities",
      target: "#sbs-entities",
      title: "Entidades Financieras Aliadas",
      description: "Todas estas entidades supervisadas por la SBS pueden participar en tu subasta para ofrecerte sus mejores propuestas.",
      position: "top",
      highlight: true
    },
    {
      id: "chat-help",
      target: "#chat-button",
      title: "Centro de Ayuda",
      description: "Usa este chat en cualquier momento para obtener asesoría personalizada durante todo el proceso.",
      position: "left",
      highlight: true
    },
    {
      id: "faq",
      target: "#faq-section",
      title: "Preguntas Frecuentes",
      description: "Encuentra respuestas a las consultas más comunes y envía tus propias preguntas si tienes dudas específicas.",
      position: "top"
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  useEffect(() => {
    if (isVisible && currentStepData?.highlight) {
      setIsHighlighting(true);
      const element = document.querySelector(currentStepData.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('tutorial-highlight');
      }
      
      const timer = setTimeout(() => {
        setIsHighlighting(false);
        if (element) {
          element.classList.remove('tutorial-highlight');
        }
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        if (element) {
          element.classList.remove('tutorial-highlight');
        }
      };
    }
  }, [currentStep, isVisible, currentStepData]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      userTrackingService.trackActivity(
        'tutorial_step_completed',
        { step: currentStep + 1, stepId: currentStepData.id },
        `Usuario completó paso ${currentStep + 1} del tutorial`
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
      'Usuario completó o cerró el tutorial'
    );
    onClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-50" />
      
      {/* Tutorial Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="bg-white max-w-md w-full shadow-2xl border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-blue-600 font-medium">
                  Paso {currentStep + 1} de {tutorialSteps.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">
                  {currentStepData.title}
                </h3>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                {currentStepData.description}
              </p>

              {isHighlighting && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm font-medium">
                    ✨ Observa el elemento resaltado en la página
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
