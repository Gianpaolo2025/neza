
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
      description: "Aquí tienes más de 40 entidades financieras supervisadas por la SBS y SMV que participan en tu subasta. Todas se mueven automáticamente para que las conozcas.",
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
        element.classList.add('tutorial-highlight-strong');
      }
      
      const timer = setTimeout(() => {
        setIsHighlighting(false);
        if (element) {
          element.classList.remove('tutorial-highlight-strong');
        }
      }, 3000);
      
      return () => {
        clearTimeout(timer);
        if (element) {
          element.classList.remove('tutorial-highlight-strong');
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
      {/* Tutorial Card - Barra delgada fija en la parte superior */}
      <div className="fixed top-0 left-0 right-0 z-[90] w-full bg-white border-b-2 border-blue-900 shadow-lg">
        <div className="container mx-auto max-w-6xl px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Información del tutorial - Más compacta */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-900 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="flex items-center gap-4 flex-1">
                <div>
                  <span className="text-sm text-blue-900 font-bold">
                    Tutorial NEZA - Paso {currentStep + 1} de {tutorialSteps.length}
                  </span>
                  <span className="text-xs text-blue-700 ml-2">Aprende a usar la plataforma</span>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Target className="w-4 h-4 text-blue-900 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-blue-900">
                      {currentStepData.title}
                    </span>
                    <span className="text-xs text-gray-700 ml-2">
                      {currentStepData.description}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles del tutorial */}
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

      {/* Estilos CSS para el resaltado fuerte */}
      <style>{`
        .tutorial-highlight-strong {
          position: relative;
          z-index: 60;
        }
        
        .tutorial-highlight-strong::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 4px solid #1e3a8a;
          border-radius: 12px;
          background: rgba(30, 58, 138, 0.1);
          z-index: -1;
          animation: tutorial-pulse 2s infinite;
          box-shadow: 0 0 20px rgba(30, 58, 138, 0.5);
        }
        
        @keyframes tutorial-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.02);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
