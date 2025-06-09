
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface CompletionAnimationProps {
  onComplete: () => void;
}

export const CompletionAnimation = ({ onComplete }: CompletionAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <CheckCircle className="w-20 h-20 text-green-500" />
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold text-neza-blue-800">¡Proceso Completado!</h2>
        <p className="text-neza-silver-600">
          Hemos registrado toda tu información. Ahora te llevaremos al sistema de subastas.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button 
          onClick={onComplete}
          className="bg-neza-blue-600 hover:bg-neza-blue-700 text-white px-8 py-3"
        >
          Continuar al Sistema de Subastas
        </Button>
      </motion.div>
    </motion.div>
  );
};
