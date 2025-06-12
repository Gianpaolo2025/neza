import { useState, useEffect } from "react";
import { ProductCatalog } from "@/components/neza/ProductCatalog";
import { UserOnboarding } from "@/components/neza/UserOnboarding";
import { SBSEntitiesCarousel } from "@/components/neza/SBSEntitiesCarousel";
import { ProductsCarousel } from "@/components/neza/ProductsCarousel";
import { PlatformSuggestions } from "@/components/neza/PlatformSuggestions";
import { InteractiveTutorial } from "@/components/neza/InteractiveTutorial";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AsesorIAChat } from "@/components/AsesorIAChat";
import { useAsesorIA } from "@/hooks/useAsesorIA";
import { userTrackingService } from "@/services/userTracking";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sparkles, FileText, TrendingUp, Shield, Users, Zap, AlertTriangle, Clock, Brain, Trophy, Target, MessageCircle, X, Filter, CheckCircle, PlayCircle } from "lucide-react";

const NezaRoute = () => {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'onboarding'>('home');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [forceOnboarding, setForceOnboarding] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const { isChatOpen, toggleChat, openChat } = useAsesorIA();
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      // Generate temporary email for anonymous users
      const tempEmail = `anonimo_${Date.now()}@neza.temp`;
      setUserEmail(tempEmail);
      
      // Start tracking session automatically
      userTrackingService.startSession(tempEmail, 'direct', 'Visita directa a página principal');
      userTrackingService.trackActivity('page_visit', { page: 'home' }, 'Usuario visitó la página principal');

      // Check if it's the first visit to show tutorial automatically
      const hasSeenTutorial = localStorage.getItem('nezaTutorialShown');
      if (!hasSeenTutorial) {
        // On mobile, don't show automatically to avoid issues
        // On desktop show automatically after 2 seconds
        if (!isMobile) {
          const timer = setTimeout(() => {
            setShowTutorial(true);
          }, 2000);
          
          return () => clearTimeout(timer);
        }
      }
    } catch (error) {
      console.error('Error initializing NezaRoute:', error);
    }

    return () => {
      try {
        userTrackingService.endSession();
      } catch (error) {
        console.error('Error ending session:', error);
      }
    };
  }, [isMobile]);

  const handleStartTutorial = () => {
    try {
      userTrackingService.trackActivity('tutorial_start', { action: 'start_tutorial' }, 'Usuario inició el tutorial manualmente');
      setShowTutorial(true);
      localStorage.setItem('nezaTutorialShown', 'true');
    } catch (error) {
      console.error('Error starting tutorial:', error);
    }
  };

  const handleProductRequest = () => {
    try {
      userTrackingService.trackActivity('button_click', { 
        action: 'product_request', 
        section: 'main_experience',
        forced: true 
      }, 'Usuario inició solicitud obligatoria de producto');
      setForceOnboarding(true);
      setCurrentView('onboarding');
    } catch (error) {
      console.error('Error handling product request:', error);
      setCurrentView('onboarding');
    }
  };

  const handleCatalogProductRequest = (productId?: string) => {
    try {
      userTrackingService.trackActivity('button_click', { 
        action: 'product_catalog_request',
        productId: productId || 'unknown',
        forced: true 
      }, `Usuario solicitó producto ${productId || 'desconocido'} desde catálogo`);
      setForceOnboarding(true);
      setCurrentView('onboarding');
    } catch (error) {
      console.error('Error handling catalog product request:', error);
      setCurrentView('onboarding');
    }
  };

  const handleViewChange = (view: 'home' | 'catalog' | 'onboarding', source?: string) => {
    try {
      userTrackingService.trackActivity('navigation', { 
        from: currentView, 
        to: view,
        source: source || 'unknown'
      }, `Usuario navegó de ${currentView} a ${view}`);
      setCurrentView(view);
    } catch (error) {
      console.error('Error handling view change:', error);
      setCurrentView(view);
    }
  };

  if (currentView === 'catalog') {
    return (
      <div className="relative">
        <ProductCatalog 
          onBack={() => handleViewChange('home', 'catalog_back')}
          onProductRequest={handleCatalogProductRequest}
        />
        
        <InteractiveTutorial 
          isVisible={showTutorial} 
          onClose={() => setShowTutorial(false)} 
        />
        
        {/* Chatbot in vertical mid-high position */}
        <div className={`fixed ${isMobile ? 'bottom-20 right-3' : 'bottom-32 right-4'} z-50`}>
          <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
        </div>
        
        {/* Tutorial button in bottom left corner */}
        {!isChatOpen && !showTutorial && (
          <div className={`fixed ${isMobile ? 'bottom-3 left-3' : 'bottom-4 left-4'} z-40`}>
            <Button
              onClick={handleStartTutorial}
              variant="outline"
              className={`border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50 flex items-center gap-2 shadow-lg bg-white ${isMobile ? 'text-xs px-2 py-1 h-8' : ''}`}
            >
              <PlayCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              {isMobile ? 'Tutorial' : 'Ver Tutorial'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <div className="relative">
        <UserOnboarding 
          onBack={() => {
            try {
              userTrackingService.trackActivity('button_click', { 
                action: 'back_to_home', 
                from: 'onboarding',
                forced: forceOnboarding 
              }, forceOnboarding ? 'Usuario canceló solicitud obligatoria' : 'Usuario regresó del onboarding a la página principal');
              setForceOnboarding(false);
              setCurrentView('home');
            } catch (error) {
              console.error('Error handling onboarding back:', error);
              setForceOnboarding(false);
              setCurrentView('home');
            }
          }}
          forceFlow={forceOnboarding}
        />
        
        <InteractiveTutorial 
          isVisible={showTutorial} 
          onClose={() => setShowTutorial(false)} 
        />
        
        {/* Chatbot in vertical mid-high position */}
        <div className={`fixed ${isMobile ? 'bottom-20 right-3' : 'bottom-32 right-4'} z-50`}>
          <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
        </div>
        
        {/* Tutorial button in bottom left corner */}
        {!isChatOpen && !showTutorial && (
          <div className={`fixed ${isMobile ? 'bottom-3 left-3' : 'bottom-4 left-4'} z-40`}>
            <Button
              onClick={handleStartTutorial}
              variant="outline"
              className={`border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50 flex items-center gap-2 shadow-lg bg-white ${isMobile ? 'text-xs px-2 py-1 h-8' : ''}`}
            >
              <PlayCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              {isMobile ? 'Tutorial' : 'Ver Tutorial'}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 via-white to-neza-blue-50 overflow-x-hidden relative">
      
      {/* Interactive Tutorial - Always visible when showTutorial is true */}
      <InteractiveTutorial 
        isVisible={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />

      {/* Welcome Message */}
      {showWelcomeMessage && (
        <div className="bg-gradient-to-r from-neza-blue-700 to-neza-blue-600 text-white py-6 px-4 relative z-30">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-neza-blue-200`} />
                  <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>🔒 La transparencia es clave para encontrar tu mejor opción</h3>
                </div>
                <p className={`text-neza-blue-100 mb-3 ${isMobile ? 'text-base' : 'text-lg'} leading-relaxed`}>
                  Sé completamente transparente con tu información. Esto nos permite encontrar las mejores opciones reales 
                  para tu perfil financiero y aumentar significativamente tus posibilidades de aprobación.
                </p>
                <div className="flex items-center gap-2 text-neza-blue-200">
                  <AlertTriangle className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
                    ⚠️ Importante: Información falsa o incompleta afecta tu evaluación y reduce tus oportunidades.
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  try {
                    userTrackingService.trackActivity('button_click', { action: 'close_welcome_message' }, 'Usuario cerró el mensaje de bienvenida');
                    setShowWelcomeMessage(false);
                  } catch (error) {
                    console.error('Error closing welcome message:', error);
                    setShowWelcomeMessage(false);
                  }
                }}
                className="text-white hover:bg-white/20 ml-4"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto px-4 py-8 relative z-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`${isMobile ? 'text-3xl md:text-4xl' : 'text-4xl md:text-6xl'} font-bold text-neza-blue-800 mb-4`}>
            NEZA
          </h1>
          <p className={`text-neza-blue-600 ${isMobile ? 'text-base md:text-lg' : 'text-lg md:text-xl'} mb-4`}>
            Sistema de Subasta Financiera Inteligente
          </p>
          <div className={`bg-neza-blue-50 border border-neza-blue-200 rounded-lg p-4 ${isMobile ? 'text-xs' : 'text-sm'} text-neza-blue-800 max-w-2xl mx-auto mb-6`}>
            <strong>🏛️ Aquí los bancos compiten para darte lo mejor:</strong> Las entidades financieras luchan en tiempo real 
            para ofrecerte las mejores condiciones. Tú eliges la ganadora.
          </div>
        </div>

        {/* Interactive Experience - MANDATORY Request */}
        <div 
          id="interactive-experience"
          className="max-w-4xl mx-auto mb-16"
        >
          <Card 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm border-neza-blue-200" 
            onClick={handleProductRequest}
          >
            <CardHeader className="text-center pb-4">
              <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-gradient-to-r from-neza-blue-500 to-neza-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse`}>
                <FileText className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} text-white animate-bounce`} />
              </div>
              <CardTitle className={`${isMobile ? 'text-xl' : 'text-3xl'} text-neza-blue-800 flex items-center justify-center gap-2 mb-4`}>
                ✓ Solicitar Producto Financiero
              </CardTitle>
              <CardDescription className={`${isMobile ? 'text-base' : 'text-lg'} text-neza-silver-600 mb-6`}>
                Proceso 100% digital y transparente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-neza-blue-50 rounded-lg p-4 text-center">
                <div className={`text-neza-blue-700 font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>🎯 Evaluación en tiempo real</div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-neza-blue-600`}>Sistema inteligente de análisis</div>
              </div>
              
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-2 gap-4'}`}>
                <div className="flex items-center gap-3 bg-neza-blue-50 border border-neza-blue-200 rounded-lg p-4">
                  <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-neza-blue-500 rounded-full flex items-center justify-center`}>
                    <Clock className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                  </div>
                  <div>
                    <div className={`font-semibold text-neza-blue-800 ${isMobile ? 'text-sm' : ''}`}>✅ Formulario obligatorio</div>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-neza-blue-600`}>Completa 8 preguntas</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-neza-blue-50 border border-neza-blue-200 rounded-lg p-4">
                  <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-neza-blue-500 rounded-full flex items-center justify-center`}>
                    <Trophy className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
                  </div>
                  <div>
                    <div className={`font-semibold text-neza-blue-800 ${isMobile ? 'text-sm' : ''}`}>✅ Subasta automática</div>
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-neza-blue-600`}>Bancos compiten por ti</div>
                  </div>
                </div>
              </div>

              <Button className={`w-full bg-neza-blue-600 hover:bg-neza-blue-700 ${isMobile ? 'text-lg py-6' : 'text-xl py-8'}`}>
                Comenzar Solicitud
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Products Carousel */}
        <div id="products-section" className="mb-16">
          <ProductsCarousel onViewCatalog={() => handleViewChange('catalog', 'products_carousel')} />
        </div>

        {/* Features Section */}
        <div id="why-system" className="mb-16">
          <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-center text-neza-blue-800 mb-8`}>
            ¿Por qué usar nuestro Sistema de Subasta?
          </h3>
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-2' : 'md:grid-cols-4'} max-w-6xl mx-auto`}>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200 hover:scale-105 transition-transform duration-200">
              <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Shield className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-neza-blue-600`} />
              </div>
              <h4 className={`font-semibold text-neza-blue-800 ${isMobile ? 'text-base' : 'text-lg'} mb-2`}>🔒 Transparente</h4>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-neza-silver-600`}>
                Los bancos compiten abiertamente por darte su mejor propuesta
              </p>
            </div>
            
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200 hover:scale-105 transition-transform duration-200">
              <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Target className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-neza-blue-600`} />
              </div>
              <h4 className={`font-semibold text-neza-blue-800 ${isMobile ? 'text-base' : 'text-lg'} mb-2`}>🎯 Tú Eliges</h4>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-neza-silver-600`}>
                El poder está en tus manos para elegir la mejor alternativa
              </p>
            </div>
            
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200 hover:scale-105 transition-transform duration-200">
              <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Zap className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-neza-blue-600`} />
              </div>
              <h4 className={`font-semibold text-neza-blue-800 ${isMobile ? 'text-base' : 'text-lg'} mb-2`}>⚡ Tiempo Real</h4>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-neza-silver-600`}>
                Las mejores ofertas se actualizan automáticamente cada minuto
              </p>
            </div>

            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200 hover:scale-105 transition-transform duration-200">
              <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <Filter className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-neza-blue-600`} />
              </div>
              <h4 className={`font-semibold text-neza-blue-800 ${isMobile ? 'text-base' : 'text-lg'} mb-2`}>🔍 Filtros Inteligentes</h4>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-neza-silver-600`}>
                Encuentra automáticamente tu mejor opción según tu perfil
              </p>
            </div>
          </div>
        </div>

        {/* User Suggestions for platform improvement */}
        <div id="suggestions-section" className="mb-16 max-w-4xl mx-auto">
          <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-center text-neza-blue-800 mb-8`}>
            💡 Sugerencias de los Usuarios
          </h3>
          <PlatformSuggestions />
        </div>
      </div>

      {/* SBS and SMV Entities Carousel */}
      <div id="sbs-entities" className="relative z-20">
        <SBSEntitiesCarousel />
      </div>

      {/* Footer */}
      <div className="bg-neza-blue-800 text-white py-8 mt-12 relative z-20">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-neza-blue-400`} />
            <span className={`text-neza-blue-400 font-semibold ${isMobile ? 'text-sm' : ''}`}>Evaluación en tiempo real</span>
          </div>
          <p className={`text-neza-silver-300 ${isMobile ? 'text-xs' : 'text-sm'} max-w-2xl mx-auto`}>
            NEZA es un sistema de subasta financiera donde las entidades autorizadas y supervisadas por la Superintendencia de Banca, Seguros y AFP (SBS) y la Superintendencia del Mercado de Valores (SMV) del Perú compiten para ofrecerte las mejores condiciones.
          </p>
          <p className={`text-neza-silver-400 ${isMobile ? 'text-xs' : 'text-xs'} mt-2`}>
            Todos nuestros aliados están supervisados por la Superintendencia de Banca, Seguros y AFP (SBS) y por la Superintendencia del Mercado de Valores (SMV).
          </p>
        </div>
      </div>

      {/* Chatbot repositioned higher to not interfere with tutorial */}
      <div className={`fixed ${isMobile ? 'bottom-20 right-3' : 'bottom-32 right-4'} z-50`}>
        <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
      </div>
      
      {/* Tutorial button - Bottom left corner */}
      {!isChatOpen && !showTutorial && (
        <div className={`fixed ${isMobile ? 'bottom-3 left-3' : 'bottom-4 left-4'} z-40`}>
          <Button
            onClick={handleStartTutorial}
            variant="outline"
            className={`border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50 flex items-center gap-2 shadow-lg bg-white ${isMobile ? 'text-xs px-2 py-1 h-8' : ''}`}
          >
            <PlayCircle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            {isMobile ? 'Tutorial' : 'Ver Tutorial'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NezaRoute;
