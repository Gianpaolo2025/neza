
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Play, Heart, Clock } from "lucide-react";

interface WelcomeBackProps {
  firstName: string;
  currentStep: number;
  onContinue: () => void;
  onStartFresh: () => void;
  onBack: () => void;
}

export const WelcomeBack = ({ firstName, currentStep, onContinue, onStartFresh, onBack }: WelcomeBackProps) => {
  const getStepName = (step: number) => {
    switch (step) {
      case 1: return "Datos Personales";
      case 2: return "Información Financiera";
      case 3: return "Perfil del Cliente";
      default: return "Inicio";
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep - 1) / 3) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>

        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-12 text-center">
            {/* Animación de bienvenida */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Heart className="w-12 h-12 text-white" />
            </motion.div>

            {/* Saludo personalizado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                ¡Hola de nuevo, {firstName}! 👋
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Me alegra verte otra vez. Veo que tienes un registro en progreso.
              </p>
            </motion.div>

            {/* Información del progreso */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-emerald-600" />
                <span className="text-lg font-semibold text-gray-700">
                  Tu progreso guardado
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Estabas en: {getStepName(currentStep)}</span>
                  <span className="font-bold text-emerald-600">{Math.round(getProgressPercentage())}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage()}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                📝 Toda tu información está guardada de forma segura
              </p>
            </motion.div>

            {/* Mensaje motivacional */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mb-8"
            >
              <p className="text-lg text-gray-700 leading-relaxed">
                ¿Te gustaría <strong>continuar desde donde lo dejaste</strong> o prefieres 
                <strong> empezar de nuevo</strong>? No te preocupes, cualquier opción está bien. 
                Estoy aquí para acompañarte en todo el proceso. 😊
              </p>
            </motion.div>

            {/* Botones de acción */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={onContinue}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-lg py-6 shadow-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                ¡Continuar donde lo dejé! 🚀
              </Button>
              
              <Button
                variant="outline"
                onClick={onStartFresh}
                className="flex-1 border-2 border-gray-300 text-lg py-6"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Empezar de nuevo
              </Button>
            </motion.div>

            {/* Nota adicional */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="text-sm text-gray-500 mt-6"
            >
              💡 Tu información está protegida y solo la usamos para brindarte las mejores opciones financieras
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
