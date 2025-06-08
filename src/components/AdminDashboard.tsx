import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Users, TrendingUp, Clock, Filter, FileText, Smartphone, Monitor, Download, Calendar, User, Activity, MessageSquare, Upload, AlertCircle, CheckCircle, XCircle, Pause } from "lucide-react";
import { UserData } from "@/types/user";
import { userTrackingService, UserProfile, UserSession } from "@/services/userTracking";
import { fileStorageService } from "@/services/fileStorage";

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userHistory, setUserHistory] = useState<any>(null);
  const [storageStats, setStorageStats] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <User className="w-4 h-4 text-blue-500" />;
      case 'exploring': return <Eye className="w-4 h-4 text-yellow-500" />;
      case 'applying': return <FileText className="w-4 h-4 text-orange-500" />;
      case 'pending': return <Pause className="w-4 h-4 text-purple-500" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'activity': return <Activity className="w-4 h-4 text-blue-500" />;
      case 'event': return <AlertCircle className="w-4 h-4 text-green-500" />;
      case 'file': return <Upload className="w-4 h-4 text-purple-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredUsers = statusFilter === 'all' 
    ? userProfiles 
    : userProfiles.filter(user => user.currentStatus === statusFilter);

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
          <p className="text-neza-blue-700 mt-2">Expedientes completos y seguimiento en tiempo real</p>
        </div>

        {/* Estadísticas principales mejoradas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

          <Card className="border-neza-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-neza-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-neza-silver-600">Conversión</p>
                  <p className="text-2xl font-bold text-neza-blue-900">{metrics.conversionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estado de usuarios */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          {metrics.userStatusBreakdown.map((status: any) => (
            <Card key={status.status} className="border-neza-blue-200">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(status.status)}
                    <span className="ml-2 text-sm font-medium text-neza-blue-800 capitalize">
                      {status.status === 'new' ? 'Nuevos' :
                       status.status === 'exploring' ? 'Explorando' :
                       status.status === 'applying' ? 'Aplicando' :
                       status.status === 'pending' ? 'Pendientes' :
                       status.status === 'approved' ? 'Aprobados' :
                       status.status === 'rejected' ? 'Rechazados' : status.status}
                    </span>
                  </div>
                  <Badge className="bg-neza-blue-100 text-neza-blue-800">
                    {status.count}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="expedientes" className="space-y-4">
          <TabsList className="bg-white border border-neza-silver-200">
            <TabsTrigger value="expedientes" className="data-[state=active]:bg-neza-blue-100">Expedientes de Usuarios</TabsTrigger>
            <TabsTrigger value="actividad" className="data-[state=active]:bg-neza-blue-100">Actividad Reciente</TabsTrigger>
            <TabsTrigger value="metricas" className="data-[state=active]:bg-neza-blue-100">Métricas Detalladas</TabsTrigger>
            <TabsTrigger value="archivos" className="data-[state=active]:bg-neza-blue-100">Gestión de Archivos</TabsTrigger>
          </TabsList>

          <TabsContent value="expedientes" className="space-y-4">
            <Card className="border-neza-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-neza-blue-800">Expedientes de Usuarios</CardTitle>
                    <CardDescription className="text-neza-silver-600">
                      Historial completo tipo expediente clínico para cada usuario
                    </CardDescription>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="new">Nuevos</SelectItem>
                      <SelectItem value="exploring">Explorando</SelectItem>
                      <SelectItem value="applying">Aplicando</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="approved">Aprobados</SelectItem>
                      <SelectItem value="rejected">Rechazados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-neza-blue-700">Usuario</TableHead>
                      <TableHead className="text-neza-blue-700">Estado</TableHead>
                      <TableHead className="text-neza-blue-700">Solicitud Actual</TableHead>
                      <TableHead className="text-neza-blue-700">Última Actividad</TableHead>
                      <TableHead className="text-neza-blue-700">Total Sesiones</TableHead>
                      <TableHead className="text-neza-blue-700">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((profile) => (
                      <TableRow key={profile.email} className="hover:bg-neza-blue-50">
                        <TableCell className="font-medium text-neza-blue-800">
                          <div>
                            <p className="font-semibold">{profile.firstName} {profile.lastName}</p>
                            <p className="text-sm text-neza-silver-600">{profile.email}</p>
                            <p className="text-xs text-neza-silver-500">DNI: {profile.dni}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(profile.currentStatus)}
                            <Badge className={`capitalize ${
                              profile.currentStatus === 'approved' ? 'bg-green-100 text-green-800' :
                              profile.currentStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                              profile.currentStatus === 'pending' ? 'bg-purple-100 text-purple-800' :
                              profile.currentStatus === 'applying' ? 'bg-orange-100 text-orange-800' :
                              'bg-neza-blue-100 text-neza-blue-800'
                            }`}>
                              {profile.currentStatus === 'new' ? 'Nuevo' :
                               profile.currentStatus === 'exploring' ? 'Explorando' :
                               profile.currentStatus === 'applying' ? 'Aplicando' :
                               profile.currentStatus === 'pending' ? 'Pendiente' :
                               profile.currentStatus === 'approved' ? 'Aprobado' :
                               profile.currentStatus === 'rejected' ? 'Rechazado' : profile.currentStatus}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-neza-silver-600">
                          <div>
                            <p className="font-medium">{profile.currentRequest || 'Sin solicitud activa'}</p>
                            {profile.monthlyIncome && (
                              <p className="text-xs text-neza-silver-500">
                                Ingresos: S/ {profile.monthlyIncome.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-neza-silver-600">
                          <div>
                            <p className="text-sm">{new Date(profile.lastUpdate).toLocaleDateString('es-PE')}</p>
                            <p className="text-xs text-neza-silver-500">
                              {new Date(profile.lastUpdate).toLocaleTimeString('es-PE')}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-neza-silver-600">{profile.totalSessions}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewUser(profile.email)}
                            className="border-neza-blue-300 text-neza-blue-600"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Expediente
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actividad" className="space-y-4">
            <Card className="border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Actividad Reciente del Sistema</CardTitle>
                <CardDescription className="text-neza-silver-600">
                  Últimas 20 actividades registradas en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {metrics.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white border border-neza-silver-200 rounded-lg">
                      <div className="mt-1">
                        <Calendar className="w-4 h-4 text-neza-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neza-blue-800">{activity.description}</p>
                        <div className="flex items-center gap-4 text-xs text-neza-silver-500 mt-1">
                          <span>Usuario: {activity.userId}</span>
                          <span>{new Date(activity.timestamp).toLocaleString('es-PE')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

        {/* Modal de expediente detallado */}
        {selectedUser && userHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-6xl w-full max-h-[90vh] overflow-y-auto border-neza-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-neza-blue-800 flex items-center gap-2">
                      <FileText className="w-6 h-6" />
                      Expediente Completo - {selectedUser}
                    </CardTitle>
                    <CardDescription className="text-neza-silver-600">
                      Historial tipo expediente clínico con toda la trazabilidad
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedUser(null)}
                    className="border-neza-blue-300 text-neza-blue-600"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Información del perfil mejorada */}
                {userHistory.profile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-neza-blue-50 rounded-lg">
                      <h4 className="font-semibold text-neza-blue-800 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Información Personal
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div><span className="text-neza-silver-600">Nombre:</span> <span className="ml-2 text-neza-blue-800 font-medium">{userHistory.profile.firstName} {userHistory.profile.lastName}</span></div>
                        <div><span className="text-neza-silver-600">Email:</span> <span className="ml-2 text-neza-blue-800">{userHistory.profile.email}</span></div>
                        <div><span className="text-neza-silver-600">DNI:</span> <span className="ml-2 text-neza-blue-800">{userHistory.profile.dni}</span></div>
                        <div><span className="text-neza-silver-600">Teléfono:</span> <span className="ml-2 text-neza-blue-800">{userHistory.profile.phone}</span></div>
                        <div><span className="text-neza-silver-600">Ingresos:</span> <span className="ml-2 text-neza-blue-800">S/ {userHistory.profile.monthlyIncome?.toLocaleString()}</span></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Estado y Métricas
                      </h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">Estado actual:</span> 
                          <div className="flex items-center gap-1">
                            {getStatusIcon(userHistory.profile.currentStatus)}
                            <Badge className="capitalize">{userHistory.profile.currentStatus}</Badge>
                          </div>
                        </div>
                        <div><span className="text-green-600">Solicitud actual:</span> <span className="ml-2 text-green-800 font-medium">{userHistory.profile.currentRequest || 'Ninguna'}</span></div>
                        <div><span className="text-green-600">Registrado:</span> <span className="ml-2 text-green-800">{new Date(userHistory.profile.registrationDate).toLocaleDateString('es-PE')}</span></div>
                        <div><span className="text-green-600">Última actividad:</span> <span className="ml-2 text-green-800">{new Date(userHistory.profile.lastUpdate).toLocaleString('es-PE')}</span></div>
                        <div><span className="text-green-600">Total sesiones:</span> <span className="ml-2 text-green-800">{userHistory.profile.totalSessions}</span></div>
                        <div><span className="text-green-600">Tiempo total:</span> <span className="ml-2 text-green-800">{formatDuration(userHistory.profile.totalTimeSpent)}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline completo */}
                <div>
                  <h4 className="font-semibold text-neza-blue-800 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Timeline Completo de Actividad ({userHistory.timeline.length} eventos)
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto border border-neza-silver-200 rounded-lg p-4">
                    {userHistory.timeline.map((item: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white border-l-4 border-l-neza-blue-300 rounded">
                        <div className="mt-1">
                          {getTimelineIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-neza-blue-800">{item.description}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.type === 'activity' ? 'Actividad' : 
                               item.type === 'event' ? 'Evento' : 
                               item.type === 'file' ? 'Archivo' : 'Otro'}
                            </Badge>
                          </div>
                          <p className="text-xs text-neza-silver-500">
                            {new Date(item.timestamp).toLocaleString('es-PE')}
                          </p>
                          {item.data.previousState && item.data.newState && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              <strong>Cambios detectados:</strong> Ver detalles técnicos en consola
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historial de sesiones */}
                <div>
                  <h4 className="font-semibold text-neza-blue-800 mb-3 flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Historial de Sesiones ({userHistory.sessions.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {userHistory.sessions.map((session: UserSession) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-white border border-neza-silver-200 rounded">
                        <div className="flex items-center">
                          {session.deviceType === 'mobile' ? 
                            <Smartphone className="w-4 h-4 text-neza-cyan-600 mr-2" /> :
                            <Monitor className="w-4 h-4 text-neza-blue-600 mr-2" />
                          }
                          <div>
                            <span className="text-sm text-neza-blue-800 font-medium">
                              {new Date(session.startTime).toLocaleDateString('es-PE')}
                            </span>
                            <p className="text-xs text-neza-silver-600">
                              {session.entryReason} • {session.entryMethod}
                            </p>
                          </div>
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
                  <h4 className="font-semibold text-neza-blue-800 mb-3 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Documentos Subidos ({userHistory.files.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {userHistory.files.map((file: any) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-neza-silver-200 rounded">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-neza-blue-600 mr-2" />
                          <div>
                            <span className="text-sm font-medium text-neza-blue-800">{file.fileName}</span>
                            <p className="text-xs text-neza-silver-600 capitalize">{file.documentType.replace('-', ' ')}</p>
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
