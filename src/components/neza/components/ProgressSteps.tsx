
import React from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, LucideIcon } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressSteps = ({ steps, currentStep }: ProgressStepsProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold ${
              currentStep >= step.number 
                ? `bg-gradient-to-r ${step.color}` 
                : 'bg-gray-300'
            }`}>
              {currentStep > step.number ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                step.number
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 w-16 mx-2 ${
                currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <Progress value={(currentStep / steps.length) * 100} className="h-2" />
    </div>
  );
};
