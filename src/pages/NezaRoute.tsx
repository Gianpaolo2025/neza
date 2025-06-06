
import { useState } from "react";
import { ProductCatalog } from "@/components/neza/ProductCatalog";
import { UserOnboarding } from "@/components/neza/UserOnboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AsesorIAChat } from "@/components/AsesorIAChat";
import { useAsesorIA } from "@/hooks/useAsesorIA";

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">NEZA</h1>
          <p className="text-emerald-600 text-lg">Tu neobanco de confianza</p>
        </div>

        {/* Main Actions */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('catalog')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <CardTitle className="text-emerald-800">Catálogo de Productos</CardTitle>
              <CardDescription>
                Explora nuestra "Leyenda Financiera" con todos los productos disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                Ver Productos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('onboarding')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <CardTitle className="text-teal-800">Validación de Usuario</CardTitle>
              <CardDescription>
                Completa tu onboarding financiero y carga tus documentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                Iniciar Validación
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">🔒</span>
            </div>
            <h3 className="font-semibold text-emerald-800">Seguro</h3>
            <p className="text-sm text-gray-600">Protegemos tu información</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">⚡</span>
            </div>
            <h3 className="font-semibold text-emerald-800">Rápido</h3>
            <p className="text-sm text-gray-600">Procesos ágiles</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg">📱</span>
            </div>
            <h3 className="font-semibold text-emerald-800">Digital</h3>
            <p className="text-sm text-gray-600">100% móvil</p>
          </div>
        </div>
      </div>

      {/* AsesorIA Chat Global */}
      <AsesorIAChat isVisible={isChatOpen} onToggle={toggleChat} />
    </div>
  );
};

export default NezaRoute;
