import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Users, TrendingUp, Clock, Filter, FileText, Smartphone, Monitor, Download } from "lucide-react";
import { UserData } from "@/types/user";
import { userTrackingService, UserProfile, UserSession } from "@/services/userTracking";
import { fileStorageService } from "@/services/fileStorage";

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userHistory, setUserHistory] = useState<any>(null);
  const [storageStats, setStorageStats] = useState<any>(null);

  useEffect(() => {
    loadMetrics();
    loadUserProfiles();
    loadStorageStats();
  }, []);

  const loadMetrics = () => {
    const allMetrics = userTrackingService.getAllMetrics();
    setMetrics(allMetrics);
  };

  const loadUserProfiles = () => {
    const allUsers = Array.from(userTrackingService['profiles'].values());
    setUserProfiles(allUsers);
  };

  const loadStorageStats = () => {
    const stats = fileStorageService.getStorageStats();
    setStorageStats(stats);
  };

  const handleViewUser = (email: string) => {
    const history = userTrackingService.getUserHistory(email);
    setUserHistory(history);
    setSelectedUser(email);
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 to-neza-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 mx-auto text-neza-blue-600 mb-4 animate-spin" />
          <p className="text-neza-blue-800">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 to-neza-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neza-blue-900">Panel Administrativo NEZA</h1>
          <p className="text-neza-blue-700 mt-2">Métricas completas y análisis de usuarios</p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-neza-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-neza-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-neza-silver-600">Total Usuarios</p>
                  <p className="text-2xl font-bold text-neza-blue-900">{metrics.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neza-cyan-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-neza-cyan-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-neza-silver-600">Total Sesiones</p>
                  <p className="text-2xl font-bold text-neza-blue-900">{metrics.totalSessions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neza-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-neza-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-neza-silver-600">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-neza-blue-900">
                    {formatDuration(metrics.averageSessionTime)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neza-cyan-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-neza-cyan-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-neza-silver-600">Archivos Subidos</p>
                  <p className="text-2xl font-bold text-neza-blue-900">{metrics.totalFilesUploaded}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="usuarios" className="space-y-4">
          <TabsList className="bg-white border border-neza-silver-200">
            <TabsTrigger value="usuarios" className="data-[state=active]:bg-neza-blue-100">Usuarios</TabsTrigger>
            <TabsTrigger value="metricas" className="data-[state=active]:bg-neza-blue-100">Métricas Detalladas</TabsTrigger>
            <TabsTrigger value="archivos" className="data-[state=active]:bg-neza-blue-100">Gestión de Archivos</TabsTrigger>
            <TabsTrigger value="productos" className="data-[state=active]:bg-neza-blue-100">Productos</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios" className="space-y-4">
            <Card className="border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Perfiles de Usuarios</CardTitle>
                <CardDescription className="text-neza-silver-600">
                  Historial completo de actividad por usuario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-neza-blue-700">Email</TableHead>
                      <TableHead className="text-neza-blue-700">Última Visita</TableHead>
                      <TableHead className="text-neza-blue-700">Total Sesiones</TableHead>
                      <TableHead className="text-neza-blue-700">Tiempo Total</TableHead>
                      <TableHead className="text-neza-blue-700">Procesos</TableHead>
                      <TableHead className="text-neza-blue-700">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userProfiles.map((profile) => (
                      <TableRow key={profile.email}>
                        <TableCell className="font-medium text-neza-blue-800">{profile.email}</TableCell>
                        <TableCell className="text-neza-silver-600">
                          {new Date(profile.lastVisit).toLocaleDateString('es-PE')}
                        </TableCell>
                        <TableCell className="text-neza-silver-600">{profile.totalSessions}</TableCell>
                        <TableCell className="text-neza-silver-600">
                          {formatDuration(profile.totalTimeSpent)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge className="bg-neza-blue-100 text-neza-blue-800">
                              ✓ {profile.completedProcesses}
                            </Badge>
                            <Badge className="bg-red-100 text-red-800">
                              ✗ {profile.abandonedProcesses}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewUser(profile.email)}
                            className="border-neza-blue-300 text-neza-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metricas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Breakdown por dispositivos */}
              <Card className="border-neza-blue-200">
                <CardHeader>
                  <CardTitle className="text-neza-blue-800 flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Distribución por Dispositivo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Monitor className="w-5 h-5 text-neza-blue-600 mr-2" />
                        <span className="text-neza-silver-700">Web</span>
                      </div>
                      <Badge className="bg-neza-blue-100 text-neza-blue-800">
                        {metrics.deviceBreakdown.web} sesiones
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Smartphone className="w-5 h-5 text-neza-cyan-600 mr-2" />
                        <span className="text-neza-silver-700">Móvil</span>
                      </div>
                      <Badge className="bg-neza-cyan-100 text-neza-cyan-800">
                        {metrics.deviceBreakdown.mobile} sesiones
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tasa de conversión */}
              <Card className="border-neza-cyan-200">
                <CardHeader>
                  <CardTitle className="text-neza-blue-800 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Tasa de Conversión
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-neza-blue-900 mb-2">
                      {metrics.conversionRate.toFixed(1)}%
                    </div>
                    <p className="text-neza-silver-600">
                      Usuarios que completaron procesos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Productos más vistos */}
            <Card className="border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Productos Más Consultados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.topProducts.map((product: any, index: number) => (
                    <div key={product.product} className="flex items-center justify-between p-3 bg-neza-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="font-semibold text-neza-blue-900 mr-2">#{index + 1}</span>
                        <span className="text-neza-blue-800">{product.product}</span>
                      </div>
                      <Badge className="bg-neza-blue-100 text-neza-blue-800">
                        {product.views} visualizaciones
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archivos" className="space-y-4">
            {storageStats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="border-neza-blue-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <FileText className="w-8 h-8 mx-auto text-neza-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-neza-blue-900">{storageStats.totalFiles}</p>
                        <p className="text-sm text-neza-silver-600">Total de Archivos</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-neza-cyan-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Download className="w-8 h-8 mx-auto text-neza-cyan-600 mb-2" />
                        <p className="text-2xl font-bold text-neza-blue-900">
                          {formatFileSize(storageStats.totalSize)}
                        </p>
                        <p className="text-sm text-neza-silver-600">Espacio Utilizado</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-neza-blue-200">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <TrendingUp className="w-8 h-8 mx-auto text-neza-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-neza-blue-900">
                          {storageStats.fileTypes.length}
                        </p>
                        <p className="text-sm text-neza-silver-600">Tipos de Archivo</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-neza-blue-200">
                  <CardHeader>
                    <CardTitle className="text-neza-blue-800">Distribución de Tipos de Documento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {storageStats.documentTypes.map((docType: any) => (
                        <div key={docType.type} className="flex items-center justify-between p-3 bg-neza-blue-50 rounded-lg">
                          <span className="text-neza-blue-800 capitalize">{docType.type.replace('-', ' ')}</span>
                          <Badge className="bg-neza-blue-100 text-neza-blue-800">
                            {docType.count} archivos
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="productos" className="space-y-4">
            <Card className="border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Análisis de Productos Financieros</CardTitle>
                <CardDescription className="text-neza-silver-600">
                  Rendimiento y popularidad de productos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-neza-blue-600 mb-4" />
                  <p className="text-neza-silver-600">Análisis de productos en desarrollo</p>
                  <p className="text-sm text-neza-silver-500 mt-2">
                    Próximamente: métricas detalladas por tipo de producto
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de detalles de usuario */}
        {selectedUser && userHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[80vh] overflow-y-auto border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Historial Detallado - {selectedUser}</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 border-neza-blue-300 text-neza-blue-600"
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Información del perfil */}
                {userHistory.profile && (
                  <div className="p-4 bg-neza-blue-50 rounded-lg">
                    <h4 className="font-semibold text-neza-blue-800 mb-2">Perfil del Usuario</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neza-silver-600">Nombre:</span>
                        <span className="ml-2 text-neza-blue-800">
                          {userHistory.profile.firstName} {userHistory.profile.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-neza-silver-600">Teléfono:</span>
                        <span className="ml-2 text-neza-blue-800">{userHistory.profile.phone}</span>
                      </div>
                      <div>
                        <span className="text-neza-silver-600">DNI:</span>
                        <span className="ml-2 text-neza-blue-800">{userHistory.profile.dni}</span>
                      </div>
                      <div>
                        <span className="text-neza-silver-600">Ingresos:</span>
                        <span className="ml-2 text-neza-blue-800">
                          S/ {userHistory.profile.monthlyIncome?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Historial de sesiones */}
                <div>
                  <h4 className="font-semibold text-neza-blue-800 mb-3">Historial de Sesiones</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {userHistory.sessions.map((session: UserSession) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-white border border-neza-silver-200 rounded">
                        <div className="flex items-center">
                          {session.deviceType === 'mobile' ? 
                            <Smartphone className="w-4 h-4 text-neza-cyan-600 mr-2" /> :
                            <Monitor className="w-4 h-4 text-neza-blue-600 mr-2" />
                          }
                          <span className="text-sm text-neza-blue-800">
                            {new Date(session.startTime).toLocaleString('es-PE')}
                          </span>
                        </div>
                        <Badge className="bg-neza-silver-100 text-neza-silver-800">
                          {session.duration ? formatDuration(session.duration) : 'En curso'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Archivos subidos */}
                <div>
                  <h4 className="font-semibold text-neza-blue-800 mb-3">Archivos Subidos</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {userHistory.files.map((file: any) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-neza-silver-200 rounded">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-neza-blue-600 mr-2" />
                          <div>
                            <span className="text-sm font-medium text-neza-blue-800">{file.fileName}</span>
                            <p className="text-xs text-neza-silver-600">{file.documentType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-neza-silver-600">
                            {new Date(file.uploadTime).toLocaleDateString('es-PE')}
                          </p>
                          <p className="text-xs text-neza-silver-500">
                            {formatFileSize(file.fileSize)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
