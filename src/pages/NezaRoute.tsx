
import { useState } from "react";
import { ProductCatalog } from "@/components/neza/ProductCatalog";
import { UserOnboarding } from "@/components/neza/UserOnboarding";
import { SBSEntitiesCarousel } from "@/components/neza/SBSEntitiesCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AsesorIAChat } from "@/components/AsesorIAChat";
import { useAsesorIA } from "@/hooks/useAsesorIA";
import { motion } from "framer-motion";
import { Sparkles, FileText, TrendingUp, Shield, Users, Zap } from "lucide-react";

const NezaRoute = () => {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'onboarding'>('home');
  const { isChatOpen, toggleChat } = useAsesorIA();

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
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
            className="text-4xl md:text-6xl font-bold text-emerald-800 mb-4"
          >
            NEZA
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-emerald-600 text-lg md:text-xl mb-4"
          >
            Tu neobanco de confianza
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 max-w-2xl mx-auto"
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
            className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm border-emerald-200" 
            onClick={() => setCurrentView('catalog')}
          >
            <CardHeader className="text-center pb-4">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <TrendingUp className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl text-emerald-800 flex items-center justify-center gap-2">
                📊 Catálogo de Productos
                <span className="text-sm bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full">NUEVO</span>
              </CardTitle>
              <CardDescription className="text-base">
                Explora nuestra "Leyenda Financiera" con productos categorizados por tipo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1 text-emerald-600">
                  <span>💳</span> Tarjetas de Crédito
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <span>💰</span> Créditos de Consumo
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <span>🏠</span> Créditos Hipotecarios
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <span>🏦</span> Cuentas de Ahorro
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6">
                Ver Productos Categorizados
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm border-teal-200" 
            onClick={() => setCurrentView('onboarding')}
          >
            <CardHeader className="text-center pb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <FileText className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl text-teal-800 flex items-center justify-center gap-2">
                ✓ Validación de Usuario
                <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">SBS</span>
              </CardTitle>
              <CardDescription className="text-base">
                Completa tu onboarding financiero con sistema de subasta automática
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-1 text-teal-600">
                  <Sparkles className="w-3 h-3" /> Experiencia interactiva tipo Duolingo
                </div>
                <div className="flex items-center gap-1 text-teal-600">
                  <Zap className="w-3 h-3" /> Validación en tiempo real
                </div>
                <div className="flex items-center gap-1 text-teal-600">
                  <Users className="w-3 h-3" /> Sistema de subasta automática
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-lg py-6">
                Iniciar Validación
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center text-slate-800 mb-8">
            ¿Por qué elegir NEZA?
          </h3>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-emerald-200"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-emerald-800 text-lg mb-2">🔒 Seguro</h4>
              <p className="text-sm text-gray-600">
                Supervisado por la SBS. Todas las entidades están reguladas y autorizadas.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-teal-200"
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-teal-600" />
              </div>
              <h4 className="font-semibold text-teal-800 text-lg mb-2">⚡ Rápido</h4>
              <p className="text-sm text-gray-600">
                Sistema de subasta en tiempo real. Las mejores ofertas en segundos.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-lg border border-cyan-200"
            >
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-cyan-600" />
              </div>
              <h4 className="font-semibold text-cyan-800 text-lg mb-2">📱 Digital</h4>
              <p className="text-sm text-gray-600">
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
        className="bg-slate-800 text-white py-8 mt-12"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Certificado SBS</span>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto">
            NEZA es una plataforma de comparación financiera que conecta usuarios con entidades financieras 
            autorizadas y supervisadas por la Superintendencia de Banca, Seguros y AFP (SBS) del Perú.
          </p>
          <div className="mt-4 text-xs text-slate-400">
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
