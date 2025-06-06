
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, X, Minimize2, Maximize2, Sparkles, Heart, Lightbulb, TrendingUp, Shield, Target } from "lucide-react";

interface AsesorIAProps {
  message: string;
  onClose: () => void;
  onReopen: () => void;
  currentStep: number;
  userProgress?: {
    profileLevel: number;
    selectedProduct?: string;
    monthlyIncome?: number;
  };
}

export const AsesorIA = ({ message, onClose, currentStep, userProgress }: AsesorIAProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showPersonalizedAdvice, setShowPersonalizedAdvice] = useState(false);

  const stepTips = {
    1: [
      "✅ Tu DNI se valida automáticamente con la SBS para mayor seguridad",
      "🔒 Toda tu información está protegida y encriptada según normas bancarias",
      "⚡ Si ya tienes cuenta, te reconoceré automáticamente y agilizaré el proceso"
    ],
    2: [
      "🎯 Te muestro las mejores opciones ordenadas por conveniencia para tu perfil",
      "💡 Cada producto tiene explicaciones simples, tasas reales y beneficios claros",
      "📊 Puedes comparar tasas, cuotas y beneficios de múltiples entidades financieras"
    ],
    3: [
      "🤝 Estas preguntas me ayudan a conocerte mejor como persona y profesional",
      "✨ No hay respuestas correctas o incorrectas, solo tu verdad financiera",
      "🎯 Mientras más honesto seas, mejores recomendaciones personalizadas te daré"
    ]
  };

  const getPersonalizedAdvice = () => {
    if (!userProgress) return [];

    const advice = [];
    
    if (userProgress.profileLevel && userProgress.profileLevel < 50) {
      advice.push("📈 Tu perfil financiero puede mejorar. Te ayudo a fortalecerlo.");
    }
    
    if (userProgress.monthlyIncome) {
      if (userProgress.monthlyIncome >= 5000) {
        advice.push("💰 Excelentes ingresos! Te abren muchas opciones premium.");
      } else if (userProgress.monthlyIncome >= 2000) {
        advice.push("👍 Buenos ingresos. Puedes acceder a productos competitivos.");
      } else {
        advice.push("🌱 Empezando bien. Te ayudo a elegir productos accesibles.");
      }
    }
    
    if (userProgress.selectedProduct) {
      advice.push("🎯 Excelente elección de producto. Te guío en los siguientes pasos.");
    }
    
    return advice;
  };

  const getCurrentTips = () => stepTips[currentStep as keyof typeof stepTips] || [];
  const personalizedAdvice = getPersonalizedAdvice();

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed top-6 right-6 z-40"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Bot className="w-6 h-6" />
          </motion.div>
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
      <Card className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50 border-blue-200 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar de AsesorIA mejorado */}
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 0 0 rgba(59, 130, 246, 0.4)",
                  "0 0 0 10px rgba(59, 130, 246, 0)",
                  "0 0 0 0 rgba(59, 130, 246, 0)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
            >
              <Bot className="w-7 h-7 text-white" />
            </motion.div>

            <div className="flex-1">
              {/* Header mejorado */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-800 text-lg">AsesorIA</h3>
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4 text-blue-500" />
                    </motion.div>
                    <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                      Tu asesora financiera personal
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {personalizedAdvice.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPersonalizedAdvice(!showPersonalizedAdvice)}
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      <Target className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTips(!showTips)}
                    className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
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

              {/* Mensaje principal mejorado */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-700 leading-relaxed mb-4"
              >
                <p className="text-base">{message}</p>
                
                {userProgress?.profileLevel && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-3 p-3 bg-blue-100 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Progreso de tu perfil: {userProgress.profileLevel}%
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${userProgress.profileLevel}%` }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Consejos personalizados */}
              <AnimatePresence>
                {showPersonalizedAdvice && personalizedAdvice.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-purple-200 pt-4 mt-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-slate-700">Consejos personalizados para ti:</span>
                    </div>
                    <div className="space-y-2">
                      {personalizedAdvice.map((advice, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-2 text-sm text-slate-600 bg-purple-50 p-2 rounded"
                        >
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                          <span>{advice}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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

              {/* Indicador de actividad mejorado */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 mt-4"
              >
                <div className="flex gap-1">
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-blue-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-cyan-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  Activa • Analizando tu perfil • Lista para ayudarte
                </span>
              </motion.div>

              {/* Garantía SBS */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-2 mt-3 text-xs text-slate-500 bg-slate-50 p-2 rounded"
              >
                <Shield className="w-3 h-3 text-green-500" />
                <span>Información validada con entidades supervisadas por la SBS</span>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Elementos decorativos mejorados */}
      <motion.div
        animate={{ 
          y: [0, -8, 0],
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-30"
      />
      <motion.div
        animate={{ 
          y: [0, 8, 0],
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
        className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20"
      />
    </motion.div>
  );
};
