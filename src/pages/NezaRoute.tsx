
import { useState, useEffect } from "react";
import { ProductCatalog } from "@/components/neza/ProductCatalog";
import { UserOnboarding } from "@/components/neza/UserOnboarding";
import { SBSEntitiesCarousel } from "@/components/neza/SBSEntitiesCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AsesorIAChat } from "@/components/AsesorIAChat";
import { useAsesorIA } from "@/hooks/useAsesorIA";
import { userTrackingService } from "@/services/userTracking";
import { motion } from "framer-motion";
import { Sparkles, FileText, TrendingUp, Shield, Users, Zap, AlertTriangle, Clock, Brain, Trophy, Target } from "lucide-react";

const NezaRoute = () => {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'onboarding'>('home');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [tutorialMode, setTutorialMode] = useState(false);
  const [countdownDays, setCountdownDays] = useState(7); // Contador por defecto
  const { isChatOpen, toggleChat } = useAsesorIA();

  useEffect(() => {
    userTrackingService.trackActivity('page_visit', { page: 'home' });
    
    // Simular actualización del countdown cada minuto
    const interval = setInterval(() => {
      setCountdownDays(prev => Math.max(prev - 1, 0));
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (currentView === 'catalog') {
    return (
      <>
        <ProductCatalog onBack={() => setCurrentView('home')} />
        <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
      </>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <>
        <UserOnboarding onBack={() => setCurrentView('home')} />
        <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 via-white to-neza-cyan-50">
      {/* Mensaje de Bienvenida - Solo se muestra una vez */}
      {showWelcomeMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-neza-blue-700 to-neza-cyan-600 text-white py-6 px-4 relative"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-neza-cyan-200" />
                  <h3 className="text-xl font-bold">🔒 La transparencia es clave para encontrar tu mejor opción</h3>
                </div>
                <p className="text-neza-cyan-100 mb-3 text-lg leading-relaxed">
                  Sé completamente transparente con tu información. Esto nos permite encontrar las mejores opciones reales 
                  para tu perfil financiero y aumentar significativamente tus posibilidades de aprobación.
                </p>
                <div className="flex items-center gap-2 text-neza-cyan-200">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">
                    ⚠️ Importante: Información falsa o incompleta afecta tu evaluación y reduce tus oportunidades.
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWelcomeMessage(false)}
                className="text-white hover:bg-white/20 ml-4"
              >
                ✕
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* MENSAJE FIJO OBLIGATORIO - SIEMPRE VISIBLE DURANTE FORMULARIO */}
      <div className="bg-neza-blue-600 text-white py-3 px-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-neza-cyan-200" />
            <p className="font-medium">
              Por favor, no nos mientas. Esta información es clave para brindarte los mejores productos.
            </p>
          </div>
          
          {/* Contador Regresivo */}
          <div className="flex items-center gap-4">
            <div className="bg-neza-cyan-500 rounded-lg px-3 py-1 text-center">
              <div className="flex items-center gap-1 text-white">
                <Clock className="w-4 h-4" />
                <span className="font-bold text-lg">{countdownDays}</span>
              </div>
              <div className="text-xs text-neza-cyan-100">días restantes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
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
            className="bg-neza-cyan-50 border border-neza-cyan-200 rounded-lg p-4 text-sm text-neza-blue-800 max-w-2xl mx-auto"
          >
            <strong>🏛️ Aquí los bancos compiten para darte lo mejor:</strong> Las entidades financieras luchan en tiempo real 
            para ofrecerte las mejores condiciones. Tú eliges la ganadora.
          </motion.div>
        </motion.div>

        {/* Activar Tutorial con Asesoría */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mb-8"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-purple-800 mb-2">
                    🧑‍🏫 Tutorial con Asesoría (Tipo Duolingo)
                  </h3>
                  <p className="text-purple-600 text-sm mb-3">
                    "¡Hola! Soy Asesoría, tu pata en este proceso. No te preocupes, yo te guío paso a paso."
                  </p>
                  <Button
                    onClick={() => setTutorialMode(!tutorialMode)}
                    className={`${tutorialMode 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-purple-500 hover:bg-purple-600'
                    } text-white`}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {tutorialMode ? '✅ Asesoría Activada' : '🧠 Activar Asesoría Paso a Paso'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tutorial Messages - Solo si está activado */}
        {tutorialMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-800 mb-2">Asesoría te explica:</h4>
                    <p className="text-orange-700 text-sm leading-relaxed">
                      "¿No sabes qué es un crédito vehicular? ¡Yo te lo explico! 
                      Escoge la opción que más se adapte a ti. Yo te diré por qué puede funcionar. 
                      Dale clic a cualquier opción y verás lo que los bancos están dispuestos a ofrecerte."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto mb-16"
        >
          <Card 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm border-neza-blue-200" 
            onClick={() => {
              userTrackingService.trackActivity('button_click', { button: 'catalog', section: 'main_actions' });
              setCurrentView('catalog');
            }}
          >
            <CardHeader className="text-center pb-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-r from-neza-blue-500 to-neza-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl text-neza-blue-800 flex items-center justify-center gap-2">
                📊 Catálogo de Productos
                <span className="text-sm bg-neza-blue-100 text-neza-blue-600 px-2 py-1 rounded-full">SUBASTA</span>
              </CardTitle>
              <CardDescription className="text-base text-neza-silver-600">
                Mira lo que los bancos están dispuestos a ofrecerte - En tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-neza-blue-50 rounded-lg p-3 text-center">
                <div className="text-neza-blue-700 font-semibold">🏆 Tienes 12 opciones disponibles</div>
                <div className="text-sm text-neza-blue-600">3 preaprobadas • 2 aprobadas • 7 en subasta</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1 text-neza-blue-600">
                  <span>💳</span> Tarjetas de Crédito
                </div>
                <div className="flex items-center gap-1 text-neza-blue-600">
                  <span>💰</span> Créditos S/ Soles
                </div>
                <div className="flex items-center gap-1 text-neza-blue-600">
                  <span>🏠</span> Créditos Hipotecarios
                </div>
                <div className="flex items-center gap-1 text-neza-blue-600">
                  <span>🏦</span> Cuentas de Ahorro
                </div>
              </div>
              <Button className="w-full bg-neza-blue-600 hover:bg-neza-blue-700 text-lg py-6">
                Ver Subasta en Vivo
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm border-neza-cyan-200" 
            onClick={() => {
              userTrackingService.trackActivity('button_click', { button: 'onboarding', section: 'main_actions' });
              setCurrentView('onboarding');
            }}
          >
            <CardHeader className="text-center pb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-r from-neza-cyan-500 to-neza-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <FileText className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl text-neza-blue-800 flex items-center justify-center gap-2">
                ✓ Participar en Subasta
                <span className="text-sm bg-neza-cyan-100 text-neza-cyan-600 px-2 py-1 rounded-full">RÁPIDO</span>
              </CardTitle>
              <CardDescription className="text-base text-neza-silver-600">
                Que los bancos compitan por ti - Sistema automático
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-neza-cyan-50 rounded-lg p-3 text-center">
                <div className="text-neza-cyan-700 font-semibold">🎯 Mejor propuesta actualizada</div>
                <div className="text-sm text-neza-cyan-600">Cada 45 segundos • En tiempo real</div>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-1 text-neza-cyan-600">
                  <Sparkles className="w-3 h-3" /> Formulario automático (3 minutos)
                </div>
                <div className="flex items-center gap-1 text-neza-cyan-600">
                  <Zap className="w-3 h-3" /> Los bancos compiten por ti
                </div>
                <div className="flex items-center gap-1 text-neza-cyan-600">
                  <Trophy className="w-3 h-3" /> Eliges la mejor propuesta
                </div>
              </div>
              <Button className="w-full bg-neza-cyan-600 hover:bg-neza-cyan-700 text-lg py-6">
                Iniciar Subasta Ahora
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section actualizada con nueva identidad */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center text-neza-blue-800 mb-8">
            ¿Por qué usar nuestro Sistema de Subasta?
          </h3>
          <div className="grid gap-6 md:grid-cols-5 max-w-6xl mx-auto">
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
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-cyan-200"
            >
              <div className="w-16 h-16 bg-neza-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-neza-cyan-600" />
              </div>
              <h4 className="font-semibold text-neza-cyan-800 text-lg mb-2">🎯 Tú Eliges</h4>
              <p className="text-sm text-neza-silver-600">
                El poder está en tus manos para elegir la mejor alternativa
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200"
            >
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">🔒 Seguro SBS</h4>
              <p className="text-sm text-neza-silver-600">
                Supervisado por la SBS. Todas las entidades están reguladas.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-cyan-200"
            >
              <div className="w-16 h-16 bg-neza-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-neza-cyan-600" />
              </div>
              <h4 className="font-semibold text-neza-cyan-800 text-lg mb-2">⚡ Tiempo Real</h4>
              <p className="text-sm text-neza-silver-600">
                Las mejores ofertas se actualizan automáticamente cada minuto.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200"
            >
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">📱 S/ Soles</h4>
              <p className="text-sm text-neza-silver-600">
                100% en moneda nacional. Compara en soles peruanos.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Carrusel de Entidades SBS */}
      <motion.div
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
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-neza-cyan-400" />
            <span className="text-neza-cyan-400 font-semibold">Sistema de Subasta Certificado SBS</span>
          </div>
          <p className="text-neza-silver-300 text-sm max-w-2xl mx-auto">
            NEZA es un sistema de subasta financiera donde las entidades autorizadas y supervisadas 
            por la Superintendencia de Banca, Seguros y AFP (SBS) del Perú compiten para ofrecerte las mejores condiciones.
          </p>
          <div className="mt-4 text-xs text-neza-silver-400">
            Última actualización de subastas: {new Date().toLocaleDateString('es-PE')} • {new Date().toLocaleTimeString('es-PE')}
          </div>
        </div>
      </motion.div>

      {/* AsesorIA Chat Global */}
      <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
    </div>
  );
};

export default NezaRoute;
