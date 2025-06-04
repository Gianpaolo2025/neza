
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle, Circle, Heart, Target, MessageCircle, Phone, Mail, TrendingUp } from "lucide-react";

interface ClientProfile {
  hasPreviousCredit: boolean;
  hasFixedIncome: boolean;
  workType: string;
  incomeRange: string;
  creditPurpose: string;
  financialGoals: string[];
  financialKnowledge: string;
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
    subtitle: 'Esta información nos ayuda a conocer tu experiencia crediticia',
    emoji: '💳',
    type: 'boolean',
    motivationalText: '¡Perfecto! Conozcamos tu historial financiero'
  },
  {
    id: 'fixedIncome',
    title: '¿Tienes ingresos mensuales fijos?',
    subtitle: 'Esto nos ayuda a evaluar tu estabilidad financiera',
    emoji: '💰',
    type: 'boolean',
    motivationalText: 'Excelente, sigamos evaluando tu situación'
  },
  {
    id: 'workType',
    title: '¿Trabajas formal o informalmente?',
    subtitle: 'Queremos entender mejor tu situación laboral',
    emoji: '👔',
    type: 'choice',
    options: [
      { id: 'formal', label: 'Trabajo formal', subtitle: 'Con contratos y beneficios', icon: '🏢' },
      { id: 'informal', label: 'Trabajo informal', subtitle: 'Sin contrato fijo', icon: '🛠️' },
      { id: 'mixed', label: 'Mixto', subtitle: 'Combino ambos tipos', icon: '⚖️' }
    ],
    motivationalText: '¡Genial! Cada tipo de trabajo tiene sus ventajas'
  },
  {
    id: 'incomeRange',
    title: '¿Cuál es tu ingreso mensual aproximado?',
    subtitle: 'Esta información es confidencial y nos ayuda a ofrecerte las mejores opciones',
    emoji: '📊',
    type: 'choice',
    options: [
      { id: 'low', label: 'Menos de S/1,000', subtitle: 'Productos accesibles disponibles', icon: '🌱' },
      { id: 'medium', label: 'Entre S/1,000 y S/2,500', subtitle: 'Gran variedad de opciones', icon: '🌳' },
      { id: 'high', label: 'Más de S/2,500', subtitle: 'Acceso a productos premium', icon: '🌟' }
    ],
    motivationalText: 'Perfecto, esto nos ayuda a personalizar tus opciones'
  },
  {
    id: 'creditPurpose',
    title: '¿Para qué necesitas el producto financiero?',
    subtitle: 'Conocer tu objetivo nos permite recomendarte la mejor opción',
    emoji: '🎯',
    type: 'choice',
    options: [
      { id: 'business', label: 'Emprender o hacer crecer mi negocio', icon: '🚀' },
      { id: 'education', label: 'Estudios o capacitación', icon: '🎓' },
      { id: 'debt', label: 'Pagar deudas o consolidar', icon: '💳' },
      { id: 'purchase', label: 'Comprar algo importante', icon: '🏠' },
      { id: 'emergency', label: 'Emergencia o imprevisto', icon: '🆘' },
      { id: 'other', label: 'Otro motivo', icon: '💡' }
    ],
    motivationalText: '¡Excelente objetivo! Vamos a ayudarte a lograrlo'
  },
  {
    id: 'financialGoals',
    title: '¿Qué te gustaría lograr con tu dinero?',
    subtitle: 'Puedes seleccionar varias opciones que te interesen',
    emoji: '🎯',
    type: 'multiple',
    options: [
      { id: 'save', label: 'Ahorrar para el futuro', icon: '🏦' },
      { id: 'invest', label: 'Invertir y hacer crecer mi dinero', icon: '📈' },
      { id: 'credit', label: 'Obtener un crédito favorable', icon: '💸' },
      { id: 'score', label: 'Mejorar mi historial crediticio', icon: '⭐' },
      { id: 'financial-education', label: 'Aprender más sobre finanzas', icon: '📚' },
      { id: 'stability', label: 'Tener estabilidad financiera', icon: '🛡️' }
    ],
    motivationalText: '¡Increíble! Tienes metas claras, eso es muy valioso'
  },
  {
    id: 'financialKnowledge',
    title: '¿Cuánto sabes de finanzas personales?',
    subtitle: 'Esto nos ayuda a explicarte todo de la manera más clara',
    emoji: '🧠',
    type: 'choice',
    options: [
      { id: 'none', label: 'Muy poco o nada', subtitle: 'Te explicaremos todo paso a paso', icon: '🌱' },
      { id: 'basic', label: 'Lo básico', subtitle: 'Conoces algunos conceptos', icon: '🌿' },
      { id: 'advanced', label: 'Bastante', subtitle: 'Manejas bien los temas financieros', icon: '🌳' }
    ],
    motivationalText: 'Perfecto, adaptaremos todo a tu nivel de conocimiento'
  },
  {
    id: 'contact',
    title: '¿Cómo prefieres que te contactemos?',
    subtitle: 'Elige la forma más cómoda para recibir información',
    emoji: '📞',
    type: 'choice',
    options: [
      { id: 'whatsapp', label: 'WhatsApp', subtitle: 'Rápido y directo', icon: MessageCircle },
      { id: 'phone', label: 'Llamada telefónica', subtitle: 'Conversación personalizada', icon: Phone },
      { id: 'email', label: 'Correo electrónico', subtitle: 'Información detallada', icon: Mail }
    ],
    motivationalText: '¡Casi terminamos! Solo falta saber cómo contactarte'
  }
];

export const ClientProfileStep = ({ data, onUpdate, onNext, onPrev }: ClientProfileStepProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [profileScore, setProfileScore] = useState(0);

  const question = questions[currentQuestion];

  const calculateProfileScore = (updatedData: ClientProfile) => {
    let score = 0;
    
    // Experiencia crediticia
    if (updatedData.hasPreviousCredit) score += 15;
    
    // Estabilidad de ingresos
    if (updatedData.hasFixedIncome) score += 20;
    
    // Tipo de trabajo
    if (updatedData.workType === 'formal') score += 20;
    else if (updatedData.workType === 'mixed') score += 15;
    else if (updatedData.workType === 'informal') score += 10;
    
    // Rango de ingresos
    if (updatedData.incomeRange === 'high') score += 25;
    else if (updatedData.incomeRange === 'medium') score += 20;
    else if (updatedData.incomeRange === 'low') score += 10;
    
    // Propósito del crédito
    if (updatedData.creditPurpose === 'business') score += 10;
    else if (updatedData.creditPurpose === 'education') score += 8;
    else if (updatedData.creditPurpose === 'debt') score += 5;
    
    // Objetivos financieros
    score += Math.min(updatedData.financialGoals.length * 3, 15);
    
    // Conocimiento financiero
    if (updatedData.financialKnowledge === 'advanced') score += 10;
    else if (updatedData.financialKnowledge === 'basic') score += 5;
    
    setProfileScore(Math.min(score, 100));
    return score;
  };

  const handleBooleanAnswer = (answer: boolean, field: string) => {
    const updatedData = { ...data, [field]: answer };
    onUpdate(updatedData);
    calculateProfileScore(updatedData);
    nextQuestion();
  };

  const handleChoiceAnswer = (choice: string, field: string) => {
    const updatedData = { ...data, [field]: choice };
    onUpdate(updatedData);
    calculateProfileScore(updatedData);
    nextQuestion();
  };

  const handleMultipleAnswer = (goalId: string) => {
    const newGoals = data.financialGoals.includes(goalId)
      ? data.financialGoals.filter(g => g !== goalId)
      : [...data.financialGoals, goalId];
    const updatedData = { ...data, financialGoals: newGoals };
    onUpdate(updatedData);
    calculateProfileScore(updatedData);
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
    if (profileScore >= 80) return { 
      type: 'Perfil Premium', 
      emoji: '👑', 
      color: 'from-yellow-500 to-amber-600',
      description: 'Excelente perfil crediticio con acceso a las mejores condiciones del mercado'
    };
    if (profileScore >= 65) return { 
      type: 'Perfil Sólido', 
      emoji: '⭐', 
      color: 'from-emerald-500 to-green-600',
      description: 'Buen perfil con acceso a múltiples productos financieros'
    };
    if (profileScore >= 45) return { 
      type: 'Perfil en Desarrollo', 
      emoji: '🌱', 
      color: 'from-blue-500 to-cyan-600',
      description: 'Perfil con potencial, ideal para construir historial crediticio'
    };
    return { 
      type: 'Perfil Inicial', 
      emoji: '🚀', 
      color: 'from-purple-500 to-pink-600',
      description: 'Perfecto para comenzar tu camino financiero con productos especializados'
    };
  };

  if (showResults) {
    const profile = getProfileType();
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`w-28 h-28 bg-gradient-to-r ${profile.color} rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg`}
            >
              <span className="text-5xl">{profile.emoji}</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-gray-800 mb-4"
            >
              ¡Listo! Tu perfil está completo
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`inline-block px-8 py-4 bg-gradient-to-r ${profile.color} text-white rounded-full text-2xl font-bold mb-6 shadow-lg`}
            >
              {profile.type}
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg text-gray-600 mb-8 leading-relaxed"
            >
              {profile.description}
            </motion.p>
            
            {/* Score visual */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-700">Puntaje de perfil</span>
                <span className="text-3xl font-bold text-emerald-600">{profileScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileScore}%` }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className={`h-4 bg-gradient-to-r ${profile.color} rounded-full flex items-center justify-end pr-2`}
                >
                  {profileScore >= 30 && <TrendingUp className="w-3 h-3 text-white" />}
                </motion.div>
              </div>
            </motion.div>
            
            {/* Resumen de respuestas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="grid grid-cols-2 gap-4 mb-8 text-sm"
            >
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold text-gray-700">Experiencia crediticia</div>
                <div className="text-gray-600">
                  {data.hasPreviousCredit ? 'Sí, he tenido créditos' : 'Primera experiencia'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold text-gray-700">Tipo de trabajo</div>
                <div className="text-gray-600 capitalize">{data.workType || 'No especificado'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold text-gray-700">Rango de ingresos</div>
                <div className="text-gray-600">
                  {data.incomeRange === 'low' && 'Menos de S/1,000'}
                  {data.incomeRange === 'medium' && 'S/1,000 - S/2,500'}
                  {data.incomeRange === 'high' && 'Más de S/2,500'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-semibold text-gray-700">Objetivos</div>
                <div className="text-gray-600">{data.financialGoals.length} seleccionados</div>
              </div>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="text-gray-600 mb-8 text-lg"
            >
              🎉 ¡Excelente! Ahora nuestro sistema inteligente "Asesoría" analizará tu perfil 
              y te mostrará las mejores opciones financieras de entidades reguladas por la SBS.
            </motion.p>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowResults(false)} className="flex-1 py-6 text-lg">
                Revisar respuestas
              </Button>
              <Button onClick={onNext} className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-6 text-lg">
                ¡Activar Asesoría IA! 🤖✨
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Mensaje motivacional */}
      <motion.div
        key={`motivation-${currentQuestion}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-4xl mb-3"
        >
          {question.emoji}
        </motion.div>
        <p className="text-xl text-gray-700 font-medium">
          {question.motivationalText}
        </p>
      </motion.div>

      {/* Progreso */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2">
          {questions.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentQuestion ? 1.3 : 1,
                backgroundColor: index <= currentQuestion ? '#10b981' : '#e5e7eb',
                boxShadow: index === currentQuestion ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none'
              }}
              className="w-4 h-4 rounded-full transition-all duration-300"
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
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-8">
              {/* Header de la pregunta */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {question.title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {question.subtitle}
                </p>
              </div>

              {/* Opciones de respuesta */}
              <div className="space-y-4">
                {question.type === 'boolean' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleBooleanAnswer(true, question.id.replace('Credit', '').replace('Income', ''))}
                      className="h-20 text-xl border-2 hover:border-emerald-500 hover:bg-emerald-50"
                    >
                      <span className="mr-3 text-2xl">✅</span>
                      Sí
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleBooleanAnswer(false, question.id.replace('Credit', '').replace('Income', ''))}
                      className="h-20 text-xl border-2 hover:border-red-500 hover:bg-red-50"
                    >
                      <span className="mr-3 text-2xl">❌</span>
                      No
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
                          className="w-full p-6 h-auto text-left justify-start border-2 hover:border-emerald-500 hover:bg-emerald-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">
                              {typeof Icon === 'string' ? Icon : Icon && <Icon className="w-8 h-8" />}
                            </div>
                            <div>
                              <div className="font-semibold text-lg">{option.label}</div>
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
                          className={`w-full p-6 h-auto text-left justify-start border-2 ${
                            isSelected 
                              ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600' 
                              : 'hover:border-emerald-500 hover:bg-emerald-50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {isSelected ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              <Circle className="w-6 h-6" />
                            )}
                            <div className="text-2xl">{option.icon}</div>
                            <span className="font-semibold">{option.label}</span>
                          </div>
                        </Button>
                      );
                    })}
                    
                    {data.financialGoals.length > 0 && (
                      <Button
                        onClick={nextQuestion}
                        className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 py-6 text-lg"
                      >
                        Continuar ({data.financialGoals.length} seleccionados) →
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
            className="flex-1 py-6 text-lg"
          >
            ← Anterior
          </Button>
        </div>
      )}
      
      {/* Progreso textual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-6 text-sm text-gray-500"
      >
        Pregunta {currentQuestion + 1} de {questions.length} • Perfil del cliente
      </motion.div>
    </div>
  );
};
