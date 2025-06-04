
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle, Circle, Heart, Target, MessageCircle, Phone, Mail } from "lucide-react";

interface ClientProfile {
  hasPreviousCredit: boolean;
  riskProfile: string;
  wantsAdvice: boolean;
  financialGoals: string[];
  preferredContact: string;
}

interface ClientProfileStepProps {
  data: ClientProfile;
  onUpdate: (data: ClientProfile) => void;
  onNext: () => void;
  onPrev: () => void;
}

const questions = [
  {
    id: 'previousCredit',
    title: '¿Has tenido un crédito antes?',
    subtitle: 'Esto nos ayuda a conocer tu experiencia',
    emoji: '💳',
    type: 'boolean'
  },
  {
    id: 'riskProfile',
    title: '¿Cómo te describirías financieramente?',
    subtitle: 'Sé honesto, esto nos ayuda a darte mejores opciones',
    emoji: '🎯',
    type: 'choice',
    options: [
      { id: 'conservative', label: 'Conservador', subtitle: 'Prefiero opciones seguras' },
      { id: 'moderate', label: 'Moderado', subtitle: 'Balance entre riesgo y beneficio' },
      { id: 'aggressive', label: 'Arriesgado', subtitle: 'Busco las mejores oportunidades' }
    ]
  },
  {
    id: 'financialGoals',
    title: '¿Cuáles son tus objetivos financieros?',
    subtitle: 'Puedes seleccionar varios',
    emoji: '🎯',
    type: 'multiple',
    options: [
      { id: 'buy-house', label: 'Comprar una casa' },
      { id: 'start-business', label: 'Iniciar un negocio' },
      { id: 'education', label: 'Estudiar o capacitarme' },
      { id: 'travel', label: 'Viajar' },
      { id: 'emergency-fund', label: 'Fondo de emergencia' },
      { id: 'investment', label: 'Invertir mi dinero' }
    ]
  },
  {
    id: 'advice',
    title: '¿Te gustaría recibir asesoría financiera personalizada?',
    subtitle: 'Nuestros expertos pueden ayudarte a tomar mejores decisiones',
    emoji: '🤝',
    type: 'boolean'
  },
  {
    id: 'contact',
    title: '¿Cómo prefieres que te contactemos?',
    subtitle: 'Elige la forma más cómoda para ti',
    emoji: '📞',
    type: 'choice',
    options: [
      { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
      { id: 'phone', label: 'Llamada telefónica', icon: Phone },
      { id: 'email', label: 'Correo electrónico', icon: Mail }
    ]
  }
];

export const ClientProfileStep = ({ data, onUpdate, onNext, onPrev }: ClientProfileStepProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const question = questions[currentQuestion];

  const handleBooleanAnswer = (answer: boolean, field: string) => {
    if (field === 'hasPreviousCredit') {
      onUpdate({ ...data, hasPreviousCredit: answer });
    } else if (field === 'wantsAdvice') {
      onUpdate({ ...data, wantsAdvice: answer });
    }
    nextQuestion();
  };

  const handleChoiceAnswer = (choice: string, field: string) => {
    if (field === 'riskProfile') {
      onUpdate({ ...data, riskProfile: choice });
    } else if (field === 'preferredContact') {
      onUpdate({ ...data, preferredContact: choice });
    }
    nextQuestion();
  };

  const handleMultipleAnswer = (goalId: string) => {
    const newGoals = data.financialGoals.includes(goalId)
      ? data.financialGoals.filter(g => g !== goalId)
      : [...data.financialGoals, goalId];
    onUpdate({ ...data, financialGoals: newGoals });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const getProfileType = () => {
    let score = 0;
    
    if (data.hasPreviousCredit) score += 2;
    if (data.riskProfile === 'conservative') score += 1;
    else if (data.riskProfile === 'moderate') score += 2;
    else if (data.riskProfile === 'aggressive') score += 3;
    
    score += data.financialGoals.length;
    if (data.wantsAdvice) score += 1;

    if (score >= 8) return { type: 'Responsable y Ambicioso', emoji: '🏆', color: 'from-green-500 to-emerald-600' };
    if (score >= 6) return { type: 'Responsable y Elegible', emoji: '✅', color: 'from-blue-500 to-cyan-600' };
    if (score >= 4) return { type: 'Prudente y Confiable', emoji: '🛡️', color: 'from-purple-500 to-pink-600' };
    return { type: 'Comenzando tu Camino', emoji: '🌱', color: 'from-orange-500 to-yellow-600' };
  };

  if (showResults) {
    const profile = getProfileType();
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <Card>
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`w-24 h-24 bg-gradient-to-r ${profile.color} rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <span className="text-4xl">{profile.emoji}</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-gray-800 mb-4"
            >
              ¡Tu perfil es:
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`inline-block px-6 py-3 bg-gradient-to-r ${profile.color} text-white rounded-full text-xl font-semibold mb-6`}
            >
              {profile.type}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-4 mb-8"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-700">Experiencia crediticia</div>
                  <div className="text-gray-600">
                    {data.hasPreviousCredit ? 'Con experiencia' : 'Primera vez'}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-700">Perfil de riesgo</div>
                  <div className="text-gray-600 capitalize">{data.riskProfile}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-700">Objetivos</div>
                  <div className="text-gray-600">{data.financialGoals.length} seleccionados</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-gray-700">Asesoría</div>
                  <div className="text-gray-600">
                    {data.wantsAdvice ? 'Sí, me interesa' : 'No necesito'}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-gray-600 mb-8"
            >
              ¡Perfecto! Ahora buscaremos las mejores opciones financieras para ti. 
              Nuestro sistema inteligente analizará tu perfil con entidades reguladas por la SBS.
            </motion.p>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowResults(false)} className="flex-1">
                Revisar respuestas
              </Button>
              <Button onClick={onNext} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                ¡Buscar mis opciones! 🚀
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progreso */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2">
          {questions.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentQuestion ? 1.2 : 1,
                backgroundColor: index <= currentQuestion ? '#10b981' : '#e5e7eb'
              }}
              className="w-3 h-3 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Pregunta actual */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card>
            <CardContent className="p-8">
              {/* Header de la pregunta */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl mb-4"
                >
                  {question.emoji}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {question.title}
                </h3>
                <p className="text-gray-600">
                  {question.subtitle}
                </p>
              </div>

              {/* Opciones de respuesta */}
              <div className="space-y-4">
                {question.type === 'boolean' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleBooleanAnswer(true, question.id.replace('Credit', '').replace('Advice', ''))}
                      className="h-16 text-lg"
                    >
                      Sí 👍
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleBooleanAnswer(false, question.id.replace('Credit', '').replace('Advice', ''))}
                      className="h-16 text-lg"
                    >
                      No 👎
                    </Button>
                  </div>
                )}

                {question.type === 'choice' && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={option.id}
                          variant="outline"
                          onClick={() => handleChoiceAnswer(option.id, question.id)}
                          className="w-full p-6 h-auto text-left justify-start"
                        >
                          <div className="flex items-center gap-4">
                            {Icon && <Icon className="w-6 h-6" />}
                            <div>
                              <div className="font-semibold">{option.label}</div>
                              {option.subtitle && (
                                <div className="text-sm text-gray-500">{option.subtitle}</div>
                              )}
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                )}

                {question.type === 'multiple' && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option) => {
                      const isSelected = data.financialGoals.includes(option.id);
                      return (
                        <Button
                          key={option.id}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => handleMultipleAnswer(option.id)}
                          className="w-full p-4 h-auto text-left justify-start"
                        >
                          <div className="flex items-center gap-3">
                            {isSelected ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                            <span>{option.label}</span>
                          </div>
                        </Button>
                      );
                    })}
                    
                    {question.type === 'multiple' && data.financialGoals.length > 0 && (
                      <Button
                        onClick={nextQuestion}
                        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
                      >
                        Continuar ({data.financialGoals.length} seleccionados)
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navegación */}
      {question.type !== 'multiple' && (
        <div className="flex gap-4 mt-6">
          <Button 
            variant="outline" 
            onClick={currentQuestion === 0 ? onPrev : prevQuestion}
            className="flex-1"
          >
            Anterior
          </Button>
        </div>
      )}
    </div>
  );
};
