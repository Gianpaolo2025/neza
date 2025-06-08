
import { useState, useEffect } from "react";
import { ProductCatalog } from "@/components/neza/ProductCatalog";
import { UserOnboarding } from "@/components/neza/UserOnboarding";
import { SBSEntitiesCarousel } from "@/components/neza/SBSEntitiesCarousel";
import { ProductsCarousel } from "@/components/neza/ProductsCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AsesorIAChat } from "@/components/AsesorIAChat";
import { useAsesorIA } from "@/hooks/useAsesorIA";
import { userTrackingService } from "@/services/userTracking";
import { motion } from "framer-motion";
import { Sparkles, FileText, TrendingUp, Shield, Users, Zap, AlertTriangle, Clock, Brain, Trophy, Target, MessageCircle, X } from "lucide-react";

const NezaRoute = () => {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'onboarding'>('home');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [showTutorialPopup, setShowTutorialPopup] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
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
    setTutorialStep(0);
    localStorage.setItem('nezaTutorialShown', 'true');
  };

  const handleSkipTutorial = () => {
    userTrackingService.trackActivity('button_click', { action: 'skip_tutorial' }, 'Usuario omitió el tutorial');
    setShowTutorialPopup(false);
    localStorage.setItem('nezaTutorialShown', 'true');
  };

  const nextTutorialStep = () => {
    if (tutorialStep < 4) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const tutorialSteps = [
    {
      target: "#products-section",
      title: "Ver Productos",
      description: "Aquí puedes explorar todos nuestros productos financieros disponibles"
    },
    {
      target: "#interactive-experience",
      title: "Revisar Ofertas",
      description: "En esta sección inicias el proceso para recibir ofertas personalizadas"
    },
    {
      target: "#why-system",
      title: "Cómo Calificar",
      description: "Conoce las ventajas de nuestro sistema de subasta financiera"
    },
    {
      target: "#sbs-entities",
      title: "Comparar Entidades",
      description: "Todas estas entidades pueden participar en tu subasta financiera"
    },
    {
      target: "#chat-button",
      title: "Contactar Asesor",
      description: "Usa este chat para obtener asesoría personalizada en cualquier momento"
    }
  ];

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
        <UserOnboarding onBack={() => {
          userTrackingService.trackActivity('button_click', { action: 'back_to_home', from: 'onboarding' }, 'Usuario regresó del onboarding a la página principal');
          setCurrentView('home');
        }} />
        <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 via-white to-neza-blue-50 overflow-x-hidden">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative">
            <button
              onClick={() => setShowTutorial(false)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold mb-2">{tutorialSteps[tutorialStep].title}</h3>
            <p className="text-gray-600 mb-4">{tutorialSteps[tutorialStep].description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Paso {tutorialStep + 1} de {tutorialSteps.length}
              </span>
              <Button onClick={nextTutorialStep}>
                {tutorialStep < tutorialSteps.length - 1 ? 'Siguiente' : 'Finalizar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Tutorial */}
      {showTutorialPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bottom-24 right-6 z-40"
        >
          <Card className="bg-white border-2 border-blue-200 shadow-xl max-w-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Tutorial</h4>
                  <p className="text-sm text-gray-600">Hola. Presiona aquí para darte un tutorial de la página.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleStartTutorial}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                >
                  ✅ Iniciar Tutorial
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
        </motion.div>
      )}

      {/* Mensaje de Bienvenida - Solo se muestra una vez */}
      {showWelcomeMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-neza-blue-700 to-neza-blue-600 text-white py-6 px-4 relative"
        >
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
        </motion.div>
      )}

      {/* Contenido Principal Centrado */}
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        {/* Header con nueva identidad */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-neza-blue-800 mb-4"
          >
            NEZA
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neza-blue-600 text-lg md:text-xl mb-4"
          >
            Sistema de Subasta Financiera Inteligente
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-neza-blue-50 border border-neza-blue-200 rounded-lg p-4 text-sm text-neza-blue-800 max-w-2xl mx-auto"
          >
            <strong>🏛️ Aquí los bancos compiten para darte lo mejor:</strong> Las entidades financieras luchan en tiempo real 
            para ofrecerte las mejores condiciones. Tú eliges la ganadora.
          </motion.div>
        </motion.div>

        {/* Experiencia Interactiva - Bloque Principal */}
        <motion.div 
          id="interactive-experience"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm border-neza-blue-200" 
            onClick={() => {
              userTrackingService.trackActivity('button_click', { button: 'onboarding', section: 'main_experience' }, 'Usuario inició el proceso de onboarding');
              setCurrentView('onboarding');
            }}
          >
            <CardHeader className="text-center pb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-gradient-to-r from-neza-blue-500 to-neza-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <FileText className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-3xl text-neza-blue-800 flex items-center justify-center gap-2 mb-4">
                ✓ Experiencia Interactiva
              </CardTitle>
              <CardDescription className="text-lg text-neza-silver-600 mb-6">
                Que los bancos compitan por ti - Sistema automático
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-neza-blue-50 rounded-lg p-4 text-center">
                <div className="text-neza-blue-700 font-semibold text-lg">🎯 Sistema de Subasta Financiera</div>
                <div className="text-sm text-neza-blue-600">Evaluación en tiempo real</div>
              </div>
              
              {/* Mensajes horizontales fijos */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-800">✅ Formulario automático</div>
                    <div className="text-sm text-green-600">En solo 3 minutos</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-blue-800">✅ Tú eliges</div>
                    <div className="text-sm text-blue-600">La mejor propuesta</div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-neza-blue-600 hover:bg-neza-blue-700 text-xl py-8">
                Comenzar Ahora
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carrusel de Productos */}
        <motion.div
          id="products-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <ProductsCarousel onViewCatalog={() => setCurrentView('catalog')} />
        </motion.div>

        {/* Features Section actualizada */}
        <motion.div 
          id="why-system"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center text-neza-blue-800 mb-8">
            ¿Por qué usar nuestro Sistema de Subasta?
          </h3>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200"
            >
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">🔒 Transparente</h4>
              <p className="text-sm text-neza-silver-600">
                Los bancos compiten abiertamente por darte su mejor propuesta
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200"
            >
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">🎯 Tú Eliges</h4>
              <p className="text-sm text-neza-silver-600">
                El poder está en tus manos para elegir la mejor alternativa
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200"
            >
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">⚡ Tiempo Real</h4>
              <p className="text-sm text-neza-silver-600">
                Las mejores ofertas se actualizan automáticamente cada minuto.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Carrusel de Entidades SBS */}
      <motion.div
        id="sbs-entities"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <SBSEntitiesCarousel />
      </motion.div>

      {/* Footer actualizado con nueva identidad */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="bg-neza-blue-800 text-white py-8 mt-12"
      >
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-neza-blue-400" />
            <span className="text-neza-blue-400 font-semibold">Sistema de Subasta Certificado SBS</span>
          </div>
          <p className="text-neza-silver-300 text-sm max-w-2xl mx-auto">
            NEZA es un sistema de subasta financiera donde las entidades autorizadas y supervisadas 
            por la Superintendencia de Banca, Seguros y AFP (SBS) del Perú compiten para ofrecerte las mejores condiciones.
          </p>
          <div className="mt-4 text-xs text-neza-silver-400">
            Última actualización: {new Date().toLocaleDateString('es-PE')} • {new Date().toLocaleTimeString('es-PE')}
          </div>
        </div>
      </motion.div>

      {/* AsesorIA Chat Global */}
      <div id="chat-button">
        <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
      </div>
    </div>
  );
};

export default NezaRoute;
