
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Lightbulb, Zap } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onComplete: () => void;
  onShowTutorial: () => void;
}

export const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  onBack, 
  onPrevStep, 
  onNextStep, 
  onComplete, 
  onShowTutorial 
}: StepNavigationProps) => {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <Button
        variant="outline"
        onClick={currentStep === 1 ? onBack : onPrevStep}
        className="border-blue-300 text-blue-700 hover:bg-blue-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {currentStep === 1 ? "Volver al inicio" : "Anterior"}
      </Button>

      {currentStep < totalSteps ? (
        <Button 
          onClick={onNextStep}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continuar
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onShowTutorial}
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Ver Tutorial
          </Button>
          <Button 
            onClick={onComplete}
            className="bg-green-600 hover:bg-green-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            ¡Ver mis ofertas!
          </Button>
        </div>
      )}
    </div>
  );
};
