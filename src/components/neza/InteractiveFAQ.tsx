
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, CheckCircle } from "lucide-react";
import { SecurityUtils, SecurityLogger } from "@/services/securityUtils";
import { userTrackingService } from "@/services/userTracking";

export const InteractiveFAQ = () => {
  const [userQuestion, setUserQuestion] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      SecurityLogger.logEvent('FAQ question submitted', { 
        question: sanitizedQuestion.substring(0, 100),
        timestamp: new Date().toISOString()
      }, 'low');

      // Track user activity
      userTrackingService.trackActivity(
        'faq_question_submit',
        { question: sanitizedQuestion },
        'Usuario envió pregunta en FAQ'
      );

      // Store question in localStorage for admin dashboard
      const existingQuestions = JSON.parse(localStorage.getItem('nezaFAQQuestions') || '[]');
      const newQuestion = {
        id: SecurityUtils.generateSecureId(),
        question: sanitizedQuestion,
        timestamp: new Date().toISOString(),
        status: 'pending',
        userEmail: userTrackingService.getCurrentUser()?.email || 'anonymous'
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
      console.error('Error submitting FAQ question:', error);
      alert('Error al enviar la pregunta. Inténtalo de nuevo.');
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
      <Card className="bg-green-50 border-green-200 max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800">¡Pregunta enviada!</h4>
              <p className="text-sm text-green-600">
                Tu pregunta ha sido enviada. Pronto tendremos una respuesta.
              </p>
            </div>
          </div>
          <p className="text-xs text-green-700">
            Nuestro equipo revisará tu consulta y la agregará a nuestras FAQ si es de interés general.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-blue-50 border-blue-200 max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg text-blue-800 flex items-center justify-center gap-2">
          <MessageCircle className="w-5 h-5" />
          ¿Tienes otra duda?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Escribe tu pregunta aquí..."
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength={500}
            className="flex-1"
          />
          <Button
            onClick={handleSubmitQuestion}
            disabled={!userQuestion.trim() || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-blue-600 text-center">
          Presiona Enter para enviar • Máximo 500 caracteres
        </p>
      </CardContent>
    </Card>
  );
};
