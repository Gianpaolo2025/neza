
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, Play } from "lucide-react";

interface WelcomeBackProps {
  firstName: string;
  currentStep: number;
  onContinue: () => void;
  onStartFresh: () => void;
  onBack: () => void;
}

export const WelcomeBack = ({ 
  firstName, 
  currentStep, 
  onContinue, 
  onStartFresh, 
  onBack 
}: WelcomeBackProps) => {
  const stepNames = ['', 'Datos Personales', 'Información Financiera', 'Perfil del Cliente'];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card>
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <span className="text-3xl">👋</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-gray-800 mb-4"
              >
                ¡Hola de nuevo, {firstName}!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 mb-6"
              >
                Detectamos que ya empezaste tu proceso de registro. 
                Te quedaste en: <strong>{stepNames[currentStep]}</strong>
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <Button 
                  onClick={onContinue}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continuar donde lo dejé
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={onStartFresh}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Empezar de nuevo
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
