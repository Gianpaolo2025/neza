
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
      target: "#interactive-experience",
      title: "¡Bienvenido a NEZA!",
      description: "Te voy a mostrar cómo funciona nuestra plataforma paso a paso. Empezamos desde abajo hacia arriba para que veas todo el proceso completo.",
      position: "bottom"
    },
    {
      id: "entities",
      target: "#sbs-entities",
      title: "Paso 1 - Entidades Financieras Supervisadas por la SBS y SMV",
      description: "Aquí tienes más de 30 entidades financieras supervisadas por la SBS y SMV que participan en tu subasta. Todas se mueven automáticamente para que las conozcas.",
      position: "top",
      highlight: true
    },
    {
      id: "suggestions",
      target: "#suggestions-section",
      title: "Paso 2 - Sugerencias de los Usuarios",
      description: "En esta sección puedes dejar cualquier sugerencia para mejorar la plataforma NEZA. Tu opinión es muy valiosa para nosotros.",
      position: "top",
      highlight: true
    },
    {
      id: "auction-system",
      target: "#why-system",
      title: "Paso 3 - ¿Por qué usar nuestro Sistema de Subasta?",
      description: "Aquí puedes ver todas las ventajas de nuestro sistema: transparencia, tú eliges, tiempo real y filtros inteligentes.",
      position: "bottom",
      highlight: true
    },
    {
      id: "catalog",
      target: "#products-section",
      title: "Paso 4 - Descubrir los Productos Financieros Disponibles",
      description: "Explora todos nuestros productos financieros disponibles: créditos, tarjetas, seguros y más. Al dar clic en 'Solicitar' te llevaremos directamente al formulario.",
      position: "bottom",
      highlight: true
    },
    {
      id: "request-button",
      target: "#interactive-experience",
      title: "Paso 5 - Productos Financieros Digitales",
      description: "Este es el botón principal para solicitar cualquier producto. Al presionarlo irás directamente al cuestionario obligatorio de 8 preguntas que toma menos de 2 minutos.",
      position: "top",
      highlight: true
    },
    {
      id: "final",
      target: "#interactive-experience",
      title: "¡Aquí comienza la magia!",
      description: "Al responder un breve cuestionario de menos de 2 minutos, te llevaremos directo a tu producto financiero ideal. Las entidades financieras competirán en tiempo real para darte las mejores condiciones.",
      position: "bottom"
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
      }, 2500);
      
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
    localStorage.setItem('nezaTutorialShown', 'true');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay sutil detrás del tutorial */}
      <div className="fixed inset-0 bg-black/20 z-[60] pointer-events-none" />
      
      {/* Tutorial Card - Posicionado a la derecha con z-index muy alto */}
      <div className="fixed top-1/2 right-6 transform -translate-y-1/2 z-[80]">
        <Card className="bg-white max-w-sm w-80 shadow-2xl border-2 border-neza-blue-500 animate-in fade-in slide-in-from-right duration-300">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-neza-blue-500 to-neza-blue-600 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-neza-blue-600 font-medium">
                  Paso {currentStep + 1} de {tutorialSteps.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-1 h-auto hover:bg-neza-blue-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-neza-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">
                  {currentStepData.title}
                </h3>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                {currentStepData.description}
              </p>

              {isHighlighting && (
                <div className="bg-neza-blue-50 border border-neza-blue-200 rounded-lg p-3 animate-pulse">
                  <p className="text-neza-blue-800 text-sm font-medium">
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
                className="flex items-center gap-2 border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-neza-blue-600 hover:bg-neza-blue-700 flex items-center gap-2"
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
