
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

interface OffersTutorialProps {
  isVisible: boolean;
  onClose: () => void;
}

export const OffersTutorial = ({ isVisible, onClose }: OffersTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isHighlighting, setIsHighlighting] = useState(false);

  const tutorialSteps: TutorialStep[] = [
    {
      id: "welcome",
      target: "#approved-section",
      title: "¡Bienvenido a tus Ofertas Personalizadas!",
      description: "Te explico paso a paso cómo funciona tu dashboard de ofertas financieras personalizadas.",
      position: "bottom"
    },
    {
      id: "approved-products",
      target: "#approved-section",
      title: "Productos Aprobados",
      description: "Estos son productos financieros que ya están aprobados para ti. Puedes solicitarlos directamente sin evaluación adicional. Están ordenados por TEA (menor tasa primero).",
      position: "top",
      highlight: true
    },
    {
      id: "preapproved-products",
      target: "#preapproved-section",
      title: "Productos Pre-aprobados",
      description: "Estos productos tienen alta probabilidad de aprobación pero requieren documentación adicional. También ordenados por mejor TEA disponible.",
      position: "top",
      highlight: true
    },
    {
      id: "auction-system",
      target: "#auction-section",
      title: "Subasta Activa",
      description: "Esta es la sección más emocionante: los bancos compiten en tiempo real por ofrecerte las mejores condiciones. Las tarjetas se mueven automáticamente según quién ofrece mejor TEA.",
      position: "bottom",
      highlight: true
    },
    {
      id: "card-details",
      target: "#auction-section .cursor-pointer:first-child",
      title: "Información de cada Tarjeta",
      description: "Cada tarjeta muestra: nombre del banco, producto específico (ej: 'Crédito Educativo'), TEA, cuota mensual. Haz clic para ver detalles completos y el botón 'Solicitar este producto'.",
      position: "top",
      highlight: true
    },
    {
      id: "best-offer",
      target: "#auction-section .border-yellow-400",
      title: "Marco Dorado - Mejor Oferta",
      description: "El marco dorado indica la mejor condición disponible en este momento. Esta posición cambia dinámicamente cuando un banco mejora su oferta.",
      position: "bottom",
      highlight: true
    },
    {
      id: "settings-adjustment",
      target: "button:has(.lucide-settings)",
      title: "Botón de Ajustar (ícono de tuerca)",
      description: "Este botón te permite cambiar el tipo de producto o el monto solicitado sin volver a llenar todo el formulario. Las ofertas se actualizan automáticamente.",
      position: "bottom",
      highlight: true
    },
    {
      id: "final",
      target: "#auction-section",
      title: "¡Listo para elegir!",
      description: "Ahora sabes cómo funciona todo. Los bancos seguirán compitiendo y las ofertas mejorarán automáticamente. ¡Elige la que más te convenga!",
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
        element.classList.add('tutorial-highlight-blue');
      }
      
      const timer = setTimeout(() => {
        setIsHighlighting(false);
        if (element) {
          element.classList.remove('tutorial-highlight-blue');
        }
      }, 4000);
      
      return () => {
        clearTimeout(timer);
        if (element) {
          element.classList.remove('tutorial-highlight-blue');
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
        `Usuario completó paso ${currentStep + 1} del tutorial de ofertas`
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
      'Usuario completó o cerró el tutorial de ofertas'
    );
    onClose();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Tutorial Card - Fixed bottom bar to avoid covering content */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] w-full bg-white border-t-2 border-blue-900 shadow-lg">
        <div className="container mx-auto max-w-6xl px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Tutorial info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-900 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="flex items-center gap-4 flex-1">
                <div>
                  <span className="text-sm text-blue-900 font-bold">
                    Tutorial Ofertas - Paso {currentStep + 1} de {tutorialSteps.length}
                  </span>
                  <span className="text-xs text-blue-700 ml-2">Aprende sobre tus ofertas</span>
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

      {/* Blue highlight CSS */}
      <style>{`
        .tutorial-highlight-blue {
          position: relative;
          z-index: 60;
        }
        
        .tutorial-highlight-blue::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border: 4px solid #1e40af;
          border-radius: 12px;
          background: rgba(30, 64, 175, 0.1);
          z-index: -1;
          animation: tutorial-pulse-blue 2s infinite;
          box-shadow: 0 0 20px rgba(30, 64, 175, 0.5);
        }
        
        @keyframes tutorial-pulse-blue {
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
