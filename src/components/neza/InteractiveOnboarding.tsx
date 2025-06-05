
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, Target, User, Briefcase, Heart } from "lucide-react";

interface InteractiveOnboardingProps {
  onBack: () => void;
  onComplete: (data: any) => void;
}

interface QuestionData {
  category: string;
  question: string;
  options: { id: string; text: string; emoji: string }[];
  multiSelect?: boolean;
}

const questions: QuestionData[] = [
  // Preguntas del Usuario (Preferencias)
  {
    category: "preferences",
    question: "¿Qué tipo de producto financiero te interesa más?",
    options: [
      { id: "ahorro", text: "Productos de Ahorro", emoji: "🏦" },
      { id: "credito", text: "Créditos y Préstamos", emoji: "💰" },
      { id: "inversion", text: "Inversiones", emoji: "📈" },
      { id: "tarjetas", text: "Tarjetas de Crédito", emoji: "💳" }
    ]
  },
  {
    category: "preferences",
    question: "¿Cuál es tu principal objetivo financiero?",
    options: [
      { id: "casa", text: "Comprar una casa", emoji: "🏠" },
      { id: "auto", text: "Comprar un vehículo", emoji: "🚗" },
      { id: "negocio", text: "Invertir en mi negocio", emoji: "💼" },
      { id: "emergencia", text: "Fondo de emergencia", emoji: "🆘" },
      { id: "educacion", text: "Financiar educación", emoji: "🎓" }
    ]
  },
  {
    category: "preferences",
    question: "¿Qué tan urgente es tu necesidad?",
    options: [
      { id: "inmediato", text: "Lo necesito ya", emoji: "🔥" },
      { id: "semana", text: "Esta semana", emoji: "📅" },
      { id: "mes", text: "Este mes", emoji: "📆" },
      { id: "planificando", text: "Estoy planificando", emoji: "🤔" }
    ]
  },
  
  // Información Personal
  {
    category: "personal",
    question: "¿Cuál es tu situación laboral actual?",
    options: [
      { id: "dependiente", text: "Empleado dependiente", emoji: "👔" },
      { id: "independiente", text: "Trabajo independiente", emoji: "💻" },
      { id: "empresario", text: "Tengo mi empresa", emoji: "🏢" },
      { id: "pensionista", text: "Jubilado/Pensionista", emoji: "👴" }
    ]
  },
  {
    category: "personal",
    question: "¿Cuál es tu rango de ingresos mensual?",
    options: [
      { id: "menos-1000", text: "Menos de S/ 1,000", emoji: "💸" },
      { id: "1000-2500", text: "S/ 1,000 - S/ 2,500", emoji: "💵" },
      { id: "2500-5000", text: "S/ 2,500 - S/ 5,000", emoji: "💶" },
      { id: "5000-10000", text: "S/ 5,000 - S/ 10,000", emoji: "💷" },
      { id: "mas-10000", text: "Más de S/ 10,000", emoji: "💎" }
    ]
  },
  {
    category: "personal",
    question: "¿Cuánto tiempo llevas en tu trabajo actual?",
    options: [
      { id: "menos-6", text: "Menos de 6 meses", emoji: "🆕" },
      { id: "6-12", text: "6 meses - 1 año", emoji: "📅" },
      { id: "1-3", text: "1 - 3 años", emoji: "⏰" },
      { id: "mas-3", text: "Más de 3 años", emoji: "🏆" }
    ]
  },
  
  // Perfil del Cliente
  {
    category: "profile",
    question: "¿Has tenido créditos anteriormente?",
    options: [
      { id: "nunca", text: "Nunca he tenido créditos", emoji: "🆕" },
      { id: "pocos", text: "He tenido algunos", emoji: "📝" },
      { id: "varios", text: "He tenido varios", emoji: "📋" },
      { id: "experiencia", text: "Tengo mucha experiencia", emoji: "🎯" }
    ]
  },
  {
    category: "profile",
    question: "¿Qué bancos prefieres?",
    multiSelect: true,
    options: [
      { id: "bcp", text: "BCP", emoji: "🏦" },
      { id: "bbva", text: "BBVA", emoji: "🏛️" },
      { id: "scotiabank", text: "Scotiabank", emoji: "🏦" },
      { id: "interbank", text: "Interbank", emoji: "🏛️" },
      { id: "otros", text: "Otros bancos", emoji: "🏢" }
    ]
  },
  {
    category: "profile",
    question: "¿Cómo prefieres que te contactemos?",
    options: [
      { id: "whatsapp", text: "WhatsApp", emoji: "📱" },
      { id: "llamada", text: "Llamada telefónica", emoji: "📞" },
      { id: "email", text: "Correo electrónico", emoji: "📧" },
      { id: "presencial", text: "Reunión presencial", emoji: "🤝" }
    ]
  }
];

export const InteractiveOnboarding = ({ onBack, onComplete }: InteractiveOnboardingProps) => {
  const [currentTab, setCurrentTab] = useState("preferences");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [showingQuestion, setShowingQuestion] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const tabs = [
    { id: "preferences", label: "Preferencias", icon: Heart, color: "text-pink-600" },
    { id: "personal", label: "Personal", icon: User, color: "text-blue-600" },
    { id: "profile", label: "Perfil", icon: Briefcase, color: "text-green-600" }
  ];

  const currentTabQuestions = questions.filter(q => q.category === currentTab);
  const currentQuestion = currentTabQuestions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleAnswerSelect = (optionId: string) => {
    if (currentQuestion.multiSelect) {
      setSelectedAnswers(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedAnswers([optionId]);
    }
  };

  const handleNext = () => {
    const questionKey = `${currentQuestion.category}-${currentQuestionIndex}`;
    setAnswers(prev => ({
      ...prev,
      [questionKey]: currentQuestion.multiSelect ? selectedAnswers : selectedAnswers[0]
    }));

    setSelectedAnswers([]);
    setShowingQuestion(false);

    setTimeout(() => {
      if (currentQuestionIndex < currentTabQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Ir a la siguiente pestaña o completar
        const currentTabIndex = tabs.findIndex(tab => tab.id === currentTab);
        if (currentTabIndex < tabs.length - 1) {
          setCurrentTab(tabs[currentTabIndex + 1].id);
          setCurrentQuestionIndex(0);
        } else {
          // Completar onboarding
          onComplete(answers);
          return;
        }
      }
      setShowingQuestion(true);
    }, 300);
  };

  const canProceed = selectedAnswers.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Experiencia Interactiva</h1>
            <p className="text-gray-600">Descubre tus productos financieros ideales</p>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</div>
            <div className="text-sm text-gray-600">Completado</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-3 mb-4" />
          <div className="text-center text-sm text-gray-600">
            Pregunta {answeredQuestions + 1} de {totalQuestions}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const tabQuestions = questions.filter(q => q.category === tab.id);
              const tabAnswered = tabQuestions.every((_, i) => answers[`${tab.id}-${i}`]);
              
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${tab.color}`} />
                  {tab.label}
                  {tabAnswered && <CheckCircle className="w-4 h-4 text-green-500" />}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <AnimatePresence mode="wait">
                {showingQuestion && currentQuestion && (
                  <motion.div
                    key={`${currentTab}-${currentQuestionIndex}`}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-4xl mx-auto"
                  >
                    {/* Question */}
                    <Card className="mb-8 bg-white/80 backdrop-blur-sm border-purple-200">
                      <CardContent className="p-8 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-4xl mb-4"
                        >
                          <Target className="w-16 h-16 mx-auto text-purple-600" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          {currentQuestion.question}
                        </h2>
                        {currentQuestion.multiSelect && (
                          <p className="text-sm text-gray-600">
                            Puedes seleccionar múltiples opciones
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {currentQuestion.options.map((option, index) => (
                        <motion.div
                          key={option.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <Card 
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                              selectedAnswers.includes(option.id) 
                                ? 'ring-2 ring-purple-500 bg-purple-50' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => handleAnswerSelect(option.id)}
                          >
                            <CardContent className="p-6 text-center">
                              <div className="text-4xl mb-3">{option.emoji}</div>
                              <h3 className="font-semibold text-gray-800">
                                {option.text}
                              </h3>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Next Button */}
                    <div className="text-center">
                      <Button
                        onClick={handleNext}
                        disabled={!canProceed}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
                      >
                        {currentQuestionIndex === currentTabQuestions.length - 1 
                          ? (currentTab === tabs[tabs.length - 1].id ? "¡Finalizar!" : "Siguiente sección")
                          : "Continuar"
                        }
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
