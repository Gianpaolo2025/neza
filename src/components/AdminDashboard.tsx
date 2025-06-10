
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CreditCard, FileText, TrendingUp, MessageSquare, Settings, BarChart3, LogOut, Shield, RefreshCw } from "lucide-react";
import { UserSuggestions } from "./admin/UserSuggestions";
import { AdminLogin } from "./admin/AdminLogin";
import { AdvancedMetrics } from "./admin/AdvancedMetrics";
import { userTrackingService } from "@/services/userTracking";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [realTimeStats, setRealTimeStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado
    const savedToken = localStorage.getItem('nezaAdminToken');
    if (savedToken === 'NEZA_ADMIN_2024_SECURE_TOKEN') {
      setIsAuthenticated(true);
      setAdminToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadRealTimeStats();
      // Actualizar stats cada 30 segundos
      const interval = setInterval(loadRealTimeStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadRealTimeStats = () => {
    setLoading(true);
    try {
      const metrics = userTrackingService.getAllMetrics();
      
      // Obtener sugerencias pendientes
      const suggestions = JSON.parse(localStorage.getItem('nezaPlatformSuggestions') || '[]');
      const pendingSuggestions = suggestions.filter((s: any) => s.status === 'pending').length;
      
      // Calcular usuarios activos (con sesiones en las últimas 24 horas)
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const recentUsers = Array.from(userTrackingService['profiles'].values()).filter(
        profile => new Date(profile.lastVisit) > yesterday
      );

      // Calcular solicitudes activas y completadas
      const profiles = Array.from(userTrackingService['profiles'].values());
      const activeSolicitudes = profiles.filter(p => p.currentStatus === 'applying' || p.currentStatus === 'pending' || p.currentStatus === 'validating').length;
      const completedSolicitudes = profiles.filter(p => p.currentStatus === 'approved' || p.currentStatus === 'qualified').length;

      setRealTimeStats({
        totalUsers: metrics.totalUsers,
        activeUsers: recentUsers.length,
        activeSolicitudes,
        completedSolicitudes,
        pendingSuggestions,
        totalSessions: metrics.totalSessions,
        averageSessionTime: metrics.averageSessionTime,
        conversionRate: metrics.conversionRate,
        recentActivity: metrics.recentActivity.slice(0, 5),
        topProducts: metrics.topProducts.slice(0, 3)
      });
    } catch (error) {
      console.error('Error loading real-time stats:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 via-white to-neza-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <RefreshCw className="w-8 h-8 animate-spin text-neza-blue-600" />
          <span className="text-lg text-neza-blue-600">Cargando datos reales...</span>
        </div>
      </div>
    );
  }

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
                <p className="text-neza-blue-600">Panel de Administración - Datos Reales</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={loadRealTimeStats} 
                variant="outline" 
                size="sm"
                className="border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </Button>
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
              {realTimeStats?.pendingSuggestions > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {realTimeStats.pendingSuggestions}
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
                  <div className="text-2xl font-bold text-neza-blue-800">
                    {realTimeStats?.totalUsers || 0}
                  </div>
                  <p className="text-xs text-neza-blue-600">Usuarios registrados en NEZA</p>
                </CardContent>
              </Card>

              <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neza-blue-700">Solicitudes Activas</CardTitle>
                  <CreditCard className="h-4 w-4 text-neza-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neza-blue-800">
                    {realTimeStats?.activeSolicitudes || 0}
                  </div>
                  <p className="text-xs text-neza-blue-600">En proceso de evaluación</p>
                </CardContent>
              </Card>

              <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neza-blue-700">Solicitudes Completadas</CardTitle>
                  <FileText className="h-4 w-4 text-neza-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neza-blue-800">
                    {realTimeStats?.completedSolicitudes || 0}
                  </div>
                  <p className="text-xs text-neza-blue-600">Aprobadas/Calificadas</p>
                </CardContent>
              </Card>

              <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neza-blue-700">Sugerencias Pendientes</CardTitle>
                  <MessageSquare className="h-4 w-4 text-neza-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neza-blue-800">
                    {realTimeStats?.pendingSuggestions || 0}
                  </div>
                  <p className="text-xs text-neza-blue-600">Requieren revisión</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-neza-blue-800">Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones reales de usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  {realTimeStats?.recentActivity?.length > 0 ? (
                    <div className="space-y-4">
                      {realTimeStats.recentActivity.map((activity: any, index: number) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm text-neza-blue-800">{activity.description}</p>
                            <p className="text-xs text-neza-blue-600">
                              {new Date(activity.timestamp).toLocaleString('es-ES')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neza-blue-600 text-center py-4">
                      No hay actividad reciente registrada
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-neza-blue-800">Productos Más Solicitados</CardTitle>
                  <CardDescription>Basado en datos reales de usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  {realTimeStats?.topProducts?.length > 0 ? (
                    <div className="space-y-4">
                      {realTimeStats.topProducts.map((product: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-neza-blue-800 capitalize">{product.product}</span>
                          <Badge className="bg-neza-blue-100 text-neza-blue-800">
                            {product.views} vistas
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neza-blue-600 text-center py-4">
                      No hay datos de productos disponibles
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Estadísticas de Sesión</CardTitle>
                <CardDescription>Métricas de uso de la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neza-blue-800">
                      {realTimeStats?.totalSessions || 0}
                    </div>
                    <p className="text-sm text-neza-blue-600">Total de Sesiones</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neza-blue-800">
                      {realTimeStats?.averageSessionTime ? 
                        Math.round(realTimeStats.averageSessionTime / 60000) : 0}m
                    </div>
                    <p className="text-sm text-neza-blue-600">Tiempo Promedio</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neza-blue-800">
                      {realTimeStats?.conversionRate ? realTimeStats.conversionRate.toFixed(1) : 0}%
                    </div>
                    <p className="text-sm text-neza-blue-600">Tasa de Conversión</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics">
            <AdvancedMetrics />
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Gestión de Usuarios</CardTitle>
                <CardDescription>Usuarios reales registrados en NEZA</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neza-blue-600">Funcionalidad de gestión de usuarios en desarrollo...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Usuarios totales registrados: {realTimeStats?.totalUsers || 0}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Solicitudes de Productos</CardTitle>
                <CardDescription>Solicitudes reales de productos financieros</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-neza-blue-700">Solicitudes Activas:</span>
                    <Badge variant="outline">{realTimeStats?.activeSolicitudes || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neza-blue-700">Solicitudes Completadas:</span>
                    <Badge variant="outline">{realTimeStats?.completedSolicitudes || 0}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Gestión detallada de solicitudes en desarrollo...
                </p>
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
