
import { CheckCircle } from "lucide-react";

interface CompletionAnimationProps {
  message?: string;
  onComplete?: () => void;
}

export const CompletionAnimation = ({ message = "¡Completado!", onComplete }: CompletionAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-bounce">
        <CheckCircle className="w-16 h-16 text-green-500" />
      </div>
      <p className="mt-4 text-lg font-semibold text-neza-blue-800">{message}</p>
      {onComplete && (
        <button 
          onClick={onComplete}
          className="mt-4 px-6 py-2 bg-neza-blue-600 text-white rounded-lg hover:bg-neza-blue-700 transition-colors"
        >
          Continuar
        </button>
      )}
    </div>
  );
};
