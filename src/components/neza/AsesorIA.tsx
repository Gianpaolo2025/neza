
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, X, Minimize2, Maximize2, Sparkles, Heart, Lightbulb } from "lucide-react";

interface AsesorIAProps {
  message: string;
  onClose: () => void;
  onReopen: () => void;
  currentStep: number;
}

export const AsesorIA = ({ message, onClose, currentStep }: AsesorIAProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const stepTips = {
    1: [
      "Tu DNI se valida automáticamente para mayor seguridad",
      "Toda tu información está protegida y encriptada",
      "Si ya tienes cuenta, te reconoceré automáticamente"
    ],
    2: [
      "Te mostraré las mejores opciones ordenadas por conveniencia",
      "Cada producto tiene explicaciones simples y claras",
      "Puedes comparar tasas, cuotas y beneficios fácilmente"
    ],
    3: [
      "Estas preguntas me ayudan a conocerte mejor",
      "No hay respuestas correctas o incorrectas",
      "Mientras más honesto seas, mejor te podré ayudar"
    ]
  };

  const getCurrentTips = () => stepTips[currentStep as keyof typeof stepTips] || [];

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed top-6 right-6 z-40"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <Bot className="w-5 h-5" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="relative"
    >
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar de AsesorIA */}
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <Bot className="w-6 h-6 text-white" />
            </motion.div>

            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800">AsesorIA</h3>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">Tu guía financiera</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTips(!showTips)}
                    className="text-slate-500 hover:text-blue-600"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(true)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mensaje principal */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-700 leading-relaxed mb-4"
              >
                <p>{message}</p>
              </motion.div>

              {/* Tips expandibles */}
              <AnimatePresence>
                {showTips && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-blue-200 pt-4 mt-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-slate-700">Tips para esta sección:</span>
                    </div>
                    <div className="space-y-2">
                      {getCurrentTips().map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2 text-sm text-slate-600"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span>{tip}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Indicador de actividad */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 mt-4"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-slate-500">Activa y lista para ayudarte</span>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decorative elements */}
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-30"
      />
      <motion.div
        animate={{ 
          y: [0, 5, 0],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20"
      />
    </motion.div>
  );
};
