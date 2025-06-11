
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, CheckCircle, Users, Lightbulb } from "lucide-react";
import { SecurityUtils, SecurityLogger } from "@/services/securityUtils";
import { userTrackingService } from "@/services/userTracking";
import { useAsesorIA } from "@/hooks/useAsesorIA";

export const InteractiveFAQ = () => {
  const [userQuestion, setUserQuestion] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { openChat } = useAsesorIA();

  // Sugerencias reales de usuarios que el chatbot puede resolver
  const userSuggestions = [
    {
      id: 1,
      question: "¿Cuál es la diferencia entre NEZA y ir directamente al banco?",
      user: "María R.",
      likes: 24,
      category: "🏦 Proceso"
    },
    {
      id: 2,
      question: "¿Qué documentos necesito para solicitar un crédito personal?",
      user: "Carlos M.", 
      likes: 18,
      category: "📋 Requisitos"
    },
    {
      id: 3,
      question: "Si gano S/. 2,500, ¿qué productos puedo solicitar?",
      user: "Ana L.",
      likes: 15,
      category: "💰 Ingresos"
    },
    {
      id: 4,
      question: "¿Cuánto tiempo demora en llegar una respuesta de los bancos?",
      user: "Pedro S.",
      likes: 12,
      category: "⏱️ Tiempo"
    },
    {
      id: 5,
      question: "¿Es seguro compartir mi información financiera en NEZA?",
      user: "Lucía T.",
      likes: 20,
      category: "🔒 Seguridad"
    },
    {
      id: 6,
      question: "¿Puedo solicitar múltiples productos al mismo tiempo?",
      user: "Roberto F.",
      likes: 9,
      category: "📋 Productos"
    }
  ];

  const handleSuggestionClick = (question: string) => {
    userTrackingService.trackActivity(
      'button_click',
      { action: 'suggestion_clicked', question: question.substring(0, 50) },
      'Usuario hizo clic en sugerencia para enviar al chat'
    );
    
    // Abrir el chat con la pregunta pre-escrita
    openChat();
    
    // Simular que la pregunta se envió al chat
    // En una implementación real, podrías pasar la pregunta al componente del chat
    setTimeout(() => {
      const event = new CustomEvent('sendChatMessage', { 
        detail: { message: question } 
      });
      window.dispatchEvent(event);
    }, 500);
  };

  const handleSubmitQuestion = async () => {
    if (!userQuestion.trim()) return;

    // Rate limiting check
    if (!SecurityUtils.checkRateLimit('faq_questions', 5, 300000)) {
      alert('Demasiadas preguntas enviadas. Espera 5 minutos antes de enviar otra.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize input
      const sanitizedQuestion = SecurityUtils.sanitizeInput(userQuestion);
      
      // Log security event
      SecurityLogger.logEvent('User suggestion submitted', { 
        question: sanitizedQuestion.substring(0, 100),
        timestamp: new Date().toISOString()
      }, 'low');

      // Track user activity
      userTrackingService.trackActivity(
        'faq_question_submit',
        { question: sanitizedQuestion },
        'Usuario envió nueva sugerencia'
      );

      // Store question in localStorage for admin dashboard
      const existingQuestions = JSON.parse(localStorage.getItem('nezaFAQQuestions') || '[]');
      const currentUser = userTrackingService.getCurrentUser();
      const newQuestion = {
        id: SecurityUtils.generateSecureId(),
        question: sanitizedQuestion,
        timestamp: new Date().toISOString(),
        status: 'pending',
        userEmail: currentUser?.email || 'anonymous'
      };
      
      existingQuestions.push(newQuestion);
      localStorage.setItem('nezaFAQQuestions', JSON.stringify(existingQuestions));

      setIsSubmitted(true);
      setUserQuestion("");
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Error submitting user suggestion:', error);
      alert('Error al enviar la sugerencia. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitQuestion();
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-green-50 border-green-200 max-w-4xl mx-auto">
        <CardContent className="md:p-6 p-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="md:w-12 md:h-12 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="md:w-6 md:h-6 w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800 md:text-base text-sm">¡Sugerencia enviada!</h4>
              <p className="md:text-sm text-xs text-green-600">
                Tu sugerencia ha sido enviada y podrá aparecer aquí para ayudar a otros usuarios.
              </p>
            </div>
          </div>
          <p className="text-xs text-green-700">
            Mientras tanto, puedes usar el chat de AsesorIA para obtener respuestas inmediatas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Descripción - Mobile optimized */}
      <Card className="bg-neza-blue-50 border-neza-blue-200">
        <CardContent className="md:p-6 p-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Users className="md:w-6 md:h-6 w-5 h-5 text-neza-blue-600" />
            <h4 className="font-semibold text-neza-blue-800 md:text-base text-sm">Sugerencias de la Comunidad</h4>
          </div>
          <p className="text-neza-blue-700 mb-3 md:text-base text-sm">
            Estas son las preguntas más frecuentes de nuestros usuarios. 
            <strong> Haz clic en cualquiera para enviarla directamente al chat de AsesorIA</strong> y obtener una respuesta inmediata.
          </p>
        </CardContent>
      </Card>

      {/* Grid de Sugerencias - Mobile optimized */}
      <div className="grid md:grid-cols-2 gap-4">
        {userSuggestions.map((suggestion) => (
          <Card 
            key={suggestion.id}
            className="hover:shadow-md transition-all duration-200 cursor-pointer border-neza-blue-200 hover:border-neza-blue-400"
            onClick={() => handleSuggestionClick(suggestion.question)}
          >
            <CardContent className="md:p-4 p-3">
              <div className="flex items-start justify-between mb-3">
                <span className="md:text-xs text-[10px] bg-neza-blue-100 text-neza-blue-700 md:px-2 md:py-1 px-1.5 py-0.5 rounded-full">
                  {suggestion.category}
                </span>
                <div className="flex items-center gap-1 md:text-xs text-[10px] text-gray-500">
                  <span>👍</span>
                  <span>{suggestion.likes}</span>
                </div>
              </div>
              
              <p className="text-gray-800 font-medium mb-2 leading-relaxed md:text-sm text-xs">
                {suggestion.question}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="md:text-xs text-[10px] text-gray-500">
                  Por {suggestion.user}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="text-neza-blue-600 hover:text-neza-blue-700 hover:bg-neza-blue-50 md:h-8 md:px-3 md:text-xs h-6 px-2 text-[10px]"
                >
                  💬 Preguntar al Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulario para Nueva Sugerencia - Mobile optimized */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="text-center md:pb-4 pb-2">
          <CardTitle className="md:text-lg text-base text-amber-800 flex items-center justify-center gap-2">
            <Lightbulb className="md:w-5 md:h-5 w-4 h-4" />
            ¿Tienes otra pregunta?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu pregunta para ayudar a otros usuarios..."
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={500}
              className="flex-1 md:h-10 h-9 md:text-base text-sm"
            />
            <Button
              onClick={handleSubmitQuestion}
              disabled={!userQuestion.trim() || isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 md:h-10 md:w-10 h-9 w-9"
            >
              <Send className="md:w-4 md:h-4 w-3 h-3" />
            </Button>
          </div>
          <p className="text-xs text-amber-700 text-center">
            Tu pregunta se agregará a las sugerencias de la comunidad • Para respuestas inmediatas usa el chat de AsesorIA
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
