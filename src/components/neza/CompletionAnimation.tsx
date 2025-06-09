
import { CheckCircle } from "lucide-react";

interface CompletionAnimationProps {
  message?: string;
}

export const CompletionAnimation = ({ message = "¡Completado!" }: CompletionAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-bounce">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <p className="mt-4 text-lg font-semibold text-neza-blue-800">{message}</p>
    </div>
  );
};
