
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, Lightbulb } from "lucide-react";
import { SecurityUtils, SecurityLogger } from "@/services/securityUtils";
import { userTrackingService } from "@/services/userTracking";

export const PlatformSuggestions = () => {
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitSuggestion = async () => {
    if (!suggestion.trim()) return;

    // Rate limiting check
    if (!SecurityUtils.checkRateLimit('platform_suggestions', 3, 300000)) {
      alert('Demasiadas sugerencias enviadas. Espera 5 minutos antes de enviar otra.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize input
      const sanitizedSuggestion = SecurityUtils.sanitizeInput(suggestion);
      
      // Log security event
      SecurityLogger.logEvent('Platform suggestion submitted', { 
        suggestion: sanitizedSuggestion.substring(0, 100),
        timestamp: new Date().toISOString()
      }, 'low');

      // Track user activity using a valid activity type
      userTrackingService.trackActivity(
        'form_submit',
        { suggestion: sanitizedSuggestion },
        'Usuario envió sugerencia para mejorar la plataforma'
      );

      // Store suggestion in localStorage for admin dashboard
      const existingSuggestions = JSON.parse(localStorage.getItem('nezaPlatformSuggestions') || '[]');
      const currentUser = userTrackingService.getCurrentUser();
      const newSuggestion = {
        id: SecurityUtils.generateSecureId(),
        suggestion: sanitizedSuggestion,
        timestamp: new Date().toISOString(),
        status: 'pending',
        userEmail: currentUser?.email || 'anonymous'
      };
      
      existingSuggestions.push(newSuggestion);
      localStorage.setItem('nezaPlatformSuggestions', JSON.stringify(existingSuggestions));

      setIsSubmitted(true);
      setSuggestion("");
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('Error submitting platform suggestion:', error);
      alert('Error al enviar la sugerencia. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitSuggestion();
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-green-50 border-green-200 max-w-4xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-green-800">¡Sugerencia enviada!</h4>
              <p className="text-sm text-green-600">
                Tu sugerencia ha sido recibida y será revisada por nuestro equipo.
              </p>
            </div>
          </div>
          <p className="text-xs text-green-700">
            Gracias por ayudarnos a mejorar NEZA.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-neza-blue-50 border-neza-blue-200 max-w-4xl mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg text-neza-blue-800 flex items-center justify-center gap-2">
          <Lightbulb className="w-5 h-5" />
          ¿Tienes alguna sugerencia para que podamos mejorar NEZA?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-neza-blue-700 text-center text-sm">
          Déjala aquí y ayúdanos a crear una mejor experiencia para todos.
        </p>
        <div className="space-y-3">
          <Textarea
            placeholder="Escribe tu sugerencia para mejorar la plataforma..."
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength={500}
            className="min-h-[60px] resize-none"
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-neza-blue-600">
              {suggestion.length}/500 caracteres
            </span>
            <Button
              onClick={handleSubmitSuggestion}
              disabled={!suggestion.trim() || isSubmitting}
              className="bg-neza-blue-600 hover:bg-neza-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Sugerencia
            </Button>
          </div>
        </div>
        <p className="text-xs text-neza-blue-700 text-center">
          Tu opinión es muy valiosa para nosotros. Todas las sugerencias son revisadas por nuestro equipo.
        </p>
      </CardContent>
    </Card>
  );
};
