
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, CreditCard, FileText, TrendingUp, MessageSquare, Settings, BarChart3 } from "lucide-react";
import { UserSuggestions } from "./admin/UserSuggestions";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Datos simulados para el dashboard
  const stats = {
    totalUsers: 1247,
    activeApplications: 89,
    completedApplications: 234,
    pendingSuggestions: JSON.parse(localStorage.getItem('nezaPlatformSuggestions') || '[]').filter((s: any) => s.status === 'pending').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración NEZA</h1>
          <p className="text-gray-600">Gestiona el sistema de subasta financiera</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Solicitudes
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Solicitudes Activas</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeApplications}</div>
                  <p className="text-xs text-muted-foreground">En proceso de evaluación</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Solicitudes Completadas</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completedApplications}</div>
                  <p className="text-xs text-muted-foreground">Este mes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sugerencias Pendientes</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingSuggestions}</div>
                  <p className="text-xs text-muted-foreground">Requieren revisión</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad Reciente</CardTitle>
                  <CardDescription>Últimas acciones en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Nueva solicitud de crédito hipotecario</p>
                        <p className="text-xs text-gray-500">Hace 5 minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Usuario completó onboarding</p>
                        <p className="text-xs text-gray-500">Hace 12 minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Nueva sugerencia recibida</p>
                        <p className="text-xs text-gray-500">Hace 1 hora</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Productos Más Solicitados</CardTitle>
                  <CardDescription>Top 3 productos financieros</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Crédito Personal</span>
                      <Badge>42%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Crédito Hipotecario</span>
                      <Badge>28%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tarjeta de Crédito</span>
                      <Badge>19%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra los usuarios registrados en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Sección en desarrollo...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Productos</CardTitle>
                <CardDescription>Monitorea y gestiona las solicitudes de productos financieros</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Sección en desarrollo...</p>
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
