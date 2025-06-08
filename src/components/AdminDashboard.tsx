
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CreditCard, FileText, TrendingUp, MessageSquare, Settings, BarChart3, LogOut, Shield } from "lucide-react";
import { UserSuggestions } from "./admin/UserSuggestions";
import { AdminLogin } from "./admin/AdminLogin";
import { AdvancedMetrics } from "./admin/AdvancedMetrics";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si hay un token guardado
    const savedToken = localStorage.getItem('nezaAdminToken');
    if (savedToken === 'NEZA_ADMIN_2024_SECURE_TOKEN') {
      setIsAuthenticated(true);
      setAdminToken(savedToken);
    }
  }, []);

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
    setAdminToken(token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminToken(null);
    localStorage.removeItem('nezaAdminToken');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Datos simulados para el dashboard
  const stats = {
    totalUsers: 1247,
    activeApplications: 89,
    completedApplications: 234,
    pendingSuggestions: JSON.parse(localStorage.getItem('nezaPlatformSuggestions') || '[]').filter((s: any) => s.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 via-white to-neza-blue-50">
      {/* Header con branding NEZA */}
      <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-neza-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neza-blue-800">NEZA</h1>
                <p className="text-neza-blue-600">Panel de Administración</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/60 backdrop-blur-sm border border-neza-blue-200">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-neza-blue-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger 
              value="metrics" 
              className="flex items-center gap-2 data-[state=active]:bg-neza-blue-600 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4" />
              Métricas Avanzadas
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 data-[state=active]:bg-neza-blue-600 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger 
              value="applications" 
              className="flex items-center gap-2 data-[state=active]:bg-neza-blue-600 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4" />
              Solicitudes
            </TabsTrigger>
            <TabsTrigger 
              value="suggestions" 
              className="flex items-center gap-2 data-[state=active]:bg-neza-blue-600 data-[state=active]:text-white"
            >
              <MessageSquare className="w-4 h-4" />
              Sugerencias
              {stats.pendingSuggestions > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {stats.pendingSuggestions}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neza-blue-700">Usuarios Totales</CardTitle>
                  <Users className="h-4 w-4 text-neza-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neza-blue-800">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+12% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neza-blue-700">Solicitudes Activas</CardTitle>
                  <CreditCard className="h-4 w-4 text-neza-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neza-blue-800">{stats.activeApplications}</div>
                  <p className="text-xs text-neza-blue-600">En proceso de evaluación</p>
                </CardContent>
              </Card>

              <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neza-blue-700">Solicitudes Completadas</CardTitle>
                  <FileText className="h-4 w-4 text-neza-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neza-blue-800">{stats.completedApplications}</div>
                  <p className="text-xs text-neza-blue-600">Este mes</p>
                </CardContent>
              </Card>

              <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neza-blue-700">Sugerencias Pendientes</CardTitle>
                  <MessageSquare className="h-4 w-4 text-neza-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neza-blue-800">{stats.pendingSuggestions}</div>
                  <p className="text-xs text-neza-blue-600">Requieren revisión</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-neza-blue-800">Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-neza-blue-800">Nueva solicitud de crédito hipotecario</p>
                        <p className="text-xs text-neza-blue-600">Hace 5 minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-neza-blue-800">Usuario completó onboarding</p>
                        <p className="text-xs text-neza-blue-600">Hace 12 minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-neza-blue-800">Nueva sugerencia recibida</p>
                        <p className="text-xs text-neza-blue-600">Hace 1 hora</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-neza-blue-800">Productos Más Solicitados</CardTitle>
                  <CardDescription>Top 3 productos financieros</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neza-blue-800">Crédito Personal</span>
                      <Badge className="bg-neza-blue-100 text-neza-blue-800">42%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neza-blue-800">Crédito Hipotecario</span>
                      <Badge className="bg-neza-blue-100 text-neza-blue-800">28%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neza-blue-800">Tarjeta de Crédito</span>
                      <Badge className="bg-neza-blue-100 text-neza-blue-800">19%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="metrics">
            <AdvancedMetrics />
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Gestión de Usuarios</CardTitle>
                <CardDescription>Administra los usuarios registrados en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neza-blue-600">Sección en desarrollo...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Solicitudes de Productos</CardTitle>
                <CardDescription>Monitorea y gestiona las solicitudes de productos financieros</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neza-blue-600">Sección en desarrollo...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions">
            <UserSuggestions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
