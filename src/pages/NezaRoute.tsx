
import { useState, useEffect } from "react";
import { ProductCatalog } from "@/components/neza/ProductCatalog";
import { UserOnboarding } from "@/components/neza/UserOnboarding";
import { SBSEntitiesCarousel } from "@/components/neza/SBSEntitiesCarousel";
import { ProductsCarousel } from "@/components/neza/ProductsCarousel";
import { InteractiveFAQ } from "@/components/neza/InteractiveFAQ";
import { InteractiveTutorial } from "@/components/neza/InteractiveTutorial";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AsesorIAChat } from "@/components/AsesorIAChat";
import { useAsesorIA } from "@/hooks/useAsesorIA";
import { userTrackingService } from "@/services/userTracking";
import { Sparkles, FileText, TrendingUp, Shield, Users, Zap, AlertTriangle, Clock, Brain, Trophy, Target, MessageCircle, X, Filter, CheckCircle } from "lucide-react";

const NezaRoute = () => {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'onboarding'>('home');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [showTutorialPopup, setShowTutorialPopup] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [forceOnboarding, setForceOnboarding] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const { isChatOpen, toggleChat, openChat } = useAsesorIA();

  useEffect(() => {
    // Generar email temporal para usuarios anónimos
    const tempEmail = `anonimo_${Date.now()}@neza.temp`;
    setUserEmail(tempEmail);
    
    // Iniciar sesión de tracking automáticamente
    userTrackingService.startSession(tempEmail, 'direct', 'Visita directa a página principal');
    userTrackingService.trackActivity('page_visit', { page: 'home' }, 'Usuario visitó la página principal');

    // Mostrar popup de tutorial después de 3 segundos, solo una vez
    const timer = setTimeout(() => {
      if (!localStorage.getItem('nezaTutorialShown')) {
        setShowTutorialPopup(true);
      }
    }, 3000);

    // Cleanup al salir
    return () => {
      clearTimeout(timer);
      userTrackingService.endSession();
    };
  }, []);

  const handleStartTutorial = () => {
    userTrackingService.trackActivity('button_click', { action: 'start_tutorial' }, 'Usuario inició el tutorial');
    setShowTutorialPopup(false);
    setShowTutorial(true);
    localStorage.setItem('nezaTutorialShown', 'true');
  };

  const handleSkipTutorial = () => {
    userTrackingService.trackActivity('button_click', { action: 'skip_tutorial' }, 'Usuario omitió el tutorial');
    setShowTutorialPopup(false);
    localStorage.setItem('nezaTutorialShown', 'true');
  };

  const handleProductRequest = () => {
    userTrackingService.trackActivity('button_click', { 
      action: 'product_request', 
      section: 'main_experience',
      forced: true 
    }, 'Usuario inició solicitud obligatoria de producto');
    setForceOnboarding(true);
    setCurrentView('onboarding');
  };

  if (currentView === 'catalog') {
    return (
      <>
        <ProductCatalog onBack={() => {
          userTrackingService.trackActivity('button_click', { action: 'back_to_home', from: 'catalog' }, 'Usuario regresó del catálogo a la página principal');
          setCurrentView('home');
        }} />
        <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
      </>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <>
        <UserOnboarding 
          onBack={() => {
            userTrackingService.trackActivity('button_click', { 
              action: 'back_to_home', 
              from: 'onboarding',
              forced: forceOnboarding 
            }, forceOnboarding ? 'Usuario canceló solicitud obligatoria' : 'Usuario regresó del onboarding a la página principal');
            setForceOnboarding(false);
            setCurrentView('home');
          }}
          forceFlow={forceOnboarding}
        />
        <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 via-white to-neza-blue-50 overflow-x-hidden">
      {/* Tutorial Interactivo */}
      <InteractiveTutorial 
        isVisible={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />

      {/* Popup de Tutorial */}
      {showTutorialPopup && (
        <div className="fixed bottom-24 right-6 z-40">
          <Card className="bg-white border-2 border-blue-200 shadow-xl max-w-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Tutorial Interactivo</h4>
                  <p className="text-sm text-gray-600">Conoce cómo funciona la plataforma paso a paso.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleStartTutorial}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  ✅ Iniciar Tour
                </Button>
                <Button
                  onClick={handleSkipTutorial}
                  size="sm"
                  variant="outline"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 flex-1"
                >
                  ❌ Omitir
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mensaje de Bienvenida */}
      {showWelcomeMessage && (
        <div className="bg-gradient-to-r from-neza-blue-700 to-neza-blue-600 text-white py-6 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-neza-blue-200" />
                  <h3 className="text-xl font-bold">🔒 La transparencia es clave para encontrar tu mejor opción</h3>
                </div>
                <p className="text-neza-blue-100 mb-3 text-lg leading-relaxed">
                  Sé completamente transparente con tu información. Esto nos permite encontrar las mejores opciones reales 
                  para tu perfil financiero y aumentar significativamente tus posibilidades de aprobación.
                </p>
                <div className="flex items-center gap-2 text-neza-blue-200">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">
                    ⚠️ Importante: Información falsa o incompleta afecta tu evaluación y reduce tus oportunidades.
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  userTrackingService.trackActivity('button_click', { action: 'close_welcome_message' }, 'Usuario cerró el mensaje de bienvenida');
                  setShowWelcomeMessage(false);
                }}
                className="text-white hover:bg-white/20 ml-4"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal Centrado */}
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        {/* Header con nueva identidad */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-neza-blue-800 mb-4">
            NEZA
          </h1>
          <p className="text-neza-blue-600 text-lg md:text-xl mb-4">
            Sistema de Subasta Financiera Inteligente
          </p>
          <div className="bg-neza-blue-50 border border-neza-blue-200 rounded-lg p-4 text-sm text-neza-blue-800 max-w-2xl mx-auto">
            <strong>🏛️ Aquí los bancos compiten para darte lo mejor:</strong> Las entidades financieras luchan en tiempo real 
            para ofrecerte las mejores condiciones. Tú eliges la ganadora.
          </div>
        </div>

        {/* Experiencia Interactiva - Bloque Principal con ícono animado */}
        <div 
          id="interactive-experience"
          className="max-w-4xl mx-auto mb-16"
        >
          <Card 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm border-neza-blue-200" 
            onClick={handleProductRequest}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-neza-blue-500 to-neza-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                <FileText className="w-10 h-10 text-white animate-bounce" />
              </div>
              <CardTitle className="text-3xl text-neza-blue-800 flex items-center justify-center gap-2 mb-4">
                ✓ Solicitar Producto Financiero
              </CardTitle>
              <CardDescription className="text-lg text-neza-silver-600 mb-6">
                Proceso 100% digital y transparente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-neza-blue-50 rounded-lg p-4 text-center">
                <div className="text-neza-blue-700 font-semibold text-lg">🎯 Evaluación en tiempo real</div>
                <div className="text-sm text-neza-blue-600">Sistema inteligente de análisis</div>
              </div>
              
              {/* Mensajes horizontales */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">✅ Formulario obligatorio</div>
                    <div className="text-sm text-green-600">Completa 8 preguntas</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">✅ Subasta automática</div>
                    <div className="text-sm text-blue-600">Bancos compiten por ti</div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-neza-blue-600 hover:bg-neza-blue-700 text-xl py-8">
                Comenzar Solicitud
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Carrusel de Productos */}
        <div
          id="products-section"
          className="mb-16"
        >
          <ProductsCarousel onViewCatalog={() => setCurrentView('catalog')} />
        </div>

        {/* Features Section - 4 pilares restaurados */}
        <div 
          id="why-system"
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center text-neza-blue-800 mb-8">
            ¿Por qué usar nuestro Sistema de Subasta?
          </h3>
          <div className="grid gap-6 md:grid-cols-4 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200 hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">🔒 Transparente</h4>
              <p className="text-sm text-neza-silver-600">
                Los bancos compiten abiertamente por darte su mejor propuesta
              </p>
            </div>
            
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200 hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">🎯 Tú Eliges</h4>
              <p className="text-sm text-neza-silver-600">
                El poder está en tus manos para elegir la mejor alternativa
              </p>
            </div>
            
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200 hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">⚡ Tiempo Real</h4>
              <p className="text-sm text-neza-silver-600">
                Las mejores ofertas se actualizan automáticamente cada minuto
              </p>
            </div>

            <div 
              id="filter-section"
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200 hover:scale-105 transition-transform duration-200"
            >
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">🔍 Filtros Inteligentes</h4>
              <p className="text-sm text-neza-silver-600">
                Encuentra automáticamente tu mejor opción según tu perfil
              </p>
            </div>
          </div>
        </div>

        {/* Sección FAQ mejorada */}
        <div 
          id="faq-section"
          className="mb-16 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-center text-neza-blue-800 mb-8">
            Preguntas Frecuentes
          </h3>
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card className="bg-white/60 backdrop-blur-sm border border-neza-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-neza-blue-800 mb-2">¿Cómo funciona la subasta?</h4>
                <p className="text-sm text-neza-silver-600">
                  Las entidades financieras compiten automáticamente para ofrecerte las mejores condiciones según tu perfil.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border border-neza-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-neza-blue-800 mb-2">¿Es seguro el proceso?</h4>
                <p className="text-sm text-neza-silver-600">
                  Sí, todas las entidades están reguladas y supervisadas por la SBS del Perú.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* FAQ Interactiva */}
          <InteractiveFAQ />
        </div>
      </div>

      {/* Carrusel de Entidades SBS */}
      <div id="sbs-entities">
        <SBSEntitiesCarousel />
      </div>

      {/* Footer actualizado */}
      <div className="bg-neza-blue-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-neza-blue-400" />
            <span className="text-neza-blue-400 font-semibold">Evaluación en tiempo real</span>
          </div>
          <p className="text-neza-silver-300 text-sm max-w-2xl mx-auto">
            NEZA es un sistema de subasta financiera donde las entidades autorizadas y supervisadas 
            por la Superintendencia de Banca, Seguros y AFP (SBS) del Perú compiten para ofrecerte las mejores condiciones.
          </p>
          <div className="mt-4 text-xs text-neza-silver-400">
            Te conectamos con todas las entidades reguladas por la SBS • Última actualización: {new Date().toLocaleDateString('es-PE')} • {new Date().toLocaleTimeString('es-PE')}
          </div>
        </div>
      </div>

      {/* AsesorIA Chat Global */}
      <div id="chat-button">
        <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
      </div>
    </div>
  );
};

export default NezaRoute;
