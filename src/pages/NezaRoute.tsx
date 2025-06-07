
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
import { Sparkles, FileText, TrendingUp, Shield, Users, Zap, AlertTriangle } from "lucide-react";

const NezaRoute = () => {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'onboarding'>('home');
  const { isChatOpen, toggleChat } = useAsesorIA();

  useEffect(() => {
    // Trackear visita a la página principal
    userTrackingService.trackActivity('page_visit', { page: 'home' });
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
      {/* Mensaje obligatorio de transparencia */}
      <div className="bg-neza-blue-600 text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-neza-cyan-200" />
          <p className="text-center font-medium">
            Por favor, no nos mientas. Esta información es clave para brindarte los mejores productos.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
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
            Tu neobanco de confianza
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-neza-cyan-50 border border-neza-cyan-200 rounded-lg p-4 text-sm text-neza-blue-800 max-w-2xl mx-auto"
          >
            <strong>🏛️ Sistema de Subasta Financiera:</strong> Las entidades financieras compiten en tiempo real para ofrecerte las mejores condiciones. 
            Todas supervisadas por la SBS del Perú.
          </motion.div>
        </motion.div>

        {/* Main Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
                <span className="text-sm bg-neza-blue-100 text-neza-blue-600 px-2 py-1 rounded-full">NUEVO</span>
              </CardTitle>
              <CardDescription className="text-base text-neza-silver-600">
                Explora nuestra "Leyenda Financiera" con productos categorizados por tipo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1 text-neza-blue-600">
                  <span>💳</span> Tarjetas de Crédito
                </div>
                <div className="flex items-center gap-1 text-neza-blue-600">
                  <span>💰</span> Créditos de Consumo
                </div>
                <div className="flex items-center gap-1 text-neza-blue-600">
                  <span>🏠</span> Créditos Hipotecarios
                </div>
                <div className="flex items-center gap-1 text-neza-blue-600">
                  <span>🏦</span> Cuentas de Ahorro
                </div>
              </div>
              <Button className="w-full bg-neza-blue-600 hover:bg-neza-blue-700 text-lg py-6">
                Ver Productos Categorizados
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
                ✓ Validación de Usuario
                <span className="text-sm bg-neza-cyan-100 text-neza-cyan-600 px-2 py-1 rounded-full">SBS</span>
              </CardTitle>
              <CardDescription className="text-base text-neza-silver-600">
                Completa tu onboarding financiero con sistema de subasta automática
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-1 text-neza-cyan-600">
                  <Sparkles className="w-3 h-3" /> Experiencia interactiva tipo Duolingo
                </div>
                <div className="flex items-center gap-1 text-neza-cyan-600">
                  <Zap className="w-3 h-3" /> Validación en tiempo real
                </div>
                <div className="flex items-center gap-1 text-neza-cyan-600">
                  <Users className="w-3 h-3" /> Sistema de subasta automática
                </div>
              </div>
              <Button className="w-full bg-neza-cyan-600 hover:bg-neza-cyan-700 text-lg py-6">
                Iniciar Validación
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section combinada con Valores */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center text-neza-blue-800 mb-8">
            ¿Por qué elegir NEZA?
          </h3>
          <div className="grid gap-6 md:grid-cols-5 max-w-6xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200"
            >
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">Transparencia</h4>
              <p className="text-sm text-neza-silver-600">
                Información clara y honesta en todos nuestros procesos
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-cyan-200"
            >
              <div className="w-16 h-16 bg-neza-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-neza-cyan-600" />
              </div>
              <h4 className="font-semibold text-neza-cyan-800 text-lg mb-2">Empoderamiento al Usuario</h4>
              <p className="text-sm text-neza-silver-600">
                Ponemos el control en tus manos para tomar las mejores decisiones
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200"
            >
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">🔒 Seguro</h4>
              <p className="text-sm text-neza-silver-600">
                Supervisado por la SBS. Todas las entidades están reguladas y autorizadas.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-cyan-200"
            >
              <div className="w-16 h-16 bg-neza-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-neza-cyan-600" />
              </div>
              <h4 className="font-semibold text-neza-cyan-800 text-lg mb-2">⚡ Rápido</h4>
              <p className="text-sm text-neza-silver-600">
                Sistema de subasta en tiempo real. Las mejores ofertas en segundos.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-neza-blue-200"
            >
              <div className="w-16 h-16 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-neza-blue-600" />
              </div>
              <h4 className="font-semibold text-neza-blue-800 text-lg mb-2">📱 Digital</h4>
              <p className="text-sm text-neza-silver-600">
                100% móvil. Compara y elige desde cualquier dispositivo.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Carrusel de Entidades SBS */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <SBSEntitiesCarousel />
      </motion.div>

      {/* Footer adicional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="bg-neza-blue-800 text-white py-8 mt-12"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-neza-cyan-400" />
            <span className="text-neza-cyan-400 font-semibold">Certificado SBS</span>
          </div>
          <p className="text-neza-silver-300 text-sm max-w-2xl mx-auto">
            NEZA es una plataforma de comparación financiera que conecta usuarios con entidades financieras 
            autorizadas y supervisadas por la Superintendencia de Banca, Seguros y AFP (SBS) del Perú.
          </p>
          <div className="mt-4 text-xs text-neza-silver-400">
            Última actualización del catálogo: {new Date().toLocaleDateString('es-PE')}
          </div>
        </div>
      </motion.div>

      {/* AsesorIA Chat Global */}
      <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
    </div>
  );
};

export default NezaRoute;
