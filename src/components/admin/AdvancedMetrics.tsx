
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Smartphone, 
  Monitor, 
  Tablet,
  Download,
  ArrowUp,
  ArrowDown,
  Activity,
  Target,
  RefreshCw,
  Calendar,
  Filter
} from "lucide-react";
import { userTrackingService } from "@/services/userTracking";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, FunnelChart, Funnel, LabelList } from 'recharts';

export const AdvancedMetrics = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = () => {
    setLoading(true);
    // Simular carga de datos
    setTimeout(() => {
      const data = userTrackingService.getAllMetrics();
      setMetrics(data);
      setLoading(false);
    }, 1000);
  };

  const exportData = () => {
    if (!metrics) return;
    
    const csvData = [
      ['Métrica', 'Valor'],
      ['Total Usuarios', metrics.totalUsers],
      ['Total Sesiones', metrics.totalSessions],
      ['Tiempo Promedio Sesión (min)', Math.round(metrics.averageSessionTime / 60000)],
      ['Tasa Conversión (%)', metrics.conversionRate.toFixed(2)],
      ['Archivos Subidos', metrics.totalFilesUploaded],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `neza-metrics-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-neza-blue-600" />
        <span className="ml-2 text-neza-blue-600">Cargando métricas...</span>
      </div>
    );
  }

  if (!metrics) return null;

  const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

  const trafficData = metrics.hourlyTraffic.slice(6, 23).map((item: any) => ({
    hour: `${item.hour}:00`,
    sessions: item.sessions
  }));

  const deviceData = [
    { name: 'Escritorio', value: metrics.deviceBreakdown.web, color: '#1e40af' },
    { name: 'Móvil', value: metrics.deviceBreakdown.mobile, color: '#3b82f6' }
  ];

  const funnelData = [
    { name: 'Visitantes', value: 1000, fill: '#1e40af' },
    { name: 'Interacción', value: 650, fill: '#3b82f6' },
    { name: 'Registro', value: 420, fill: '#60a5fa' },
    { name: 'Solicitud', value: 280, fill: '#93c5fd' }
  ];

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neza-blue-800">Métricas Avanzadas NEZA</h2>
          <p className="text-neza-blue-600">Análisis detallado del comportamiento de usuarios</p>
        </div>
        <div className="flex gap-3">
          <div className="flex rounded-lg bg-neza-blue-50 p-1">
            {(['day', 'week', 'month'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                className={timeRange === range ? 'bg-neza-blue-600 hover:bg-neza-blue-700' : 'hover:bg-neza-blue-100'}
                onClick={() => setTimeRange(range)}
              >
                {range === 'day' ? '24h' : range === 'week' ? '7d' : '30d'}
              </Button>
            ))}
          </div>
          <Button onClick={exportData} variant="outline" className="border-neza-blue-300 text-neza-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-neza-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neza-blue-700">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-neza-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neza-blue-800">{metrics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUp className="w-3 h-3 mr-1" />
              +12% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-neza-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neza-blue-700">Sesiones Activas</CardTitle>
            <Activity className="h-4 w-4 text-neza-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neza-blue-800">{metrics.totalSessions}</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUp className="w-3 h-3 mr-1" />
              +8% esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="border-neza-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neza-blue-700">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-neza-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neza-blue-800">
              {Math.round(metrics.averageSessionTime / 60000)}m
            </div>
            <p className="text-xs text-red-600 flex items-center">
              <ArrowDown className="w-3 h-3 mr-1" />
              -2% vs promedio
            </p>
          </CardContent>
        </Card>

        <Card className="border-neza-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neza-blue-700">Tasa Conversión</CardTitle>
            <Target className="h-4 w-4 text-neza-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neza-blue-800">{metrics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600 flex items-center">
              <ArrowUp className="w-3 h-3 mr-1" />
              +5% este mes
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-neza-blue-50">
          <TabsTrigger value="traffic" className="data-[state=active]:bg-neza-blue-600 data-[state=active]:text-white">
            Tráfico
          </TabsTrigger>
          <TabsTrigger value="behavior" className="data-[state=active]:bg-neza-blue-600 data-[state=active]:text-white">
            Comportamiento
          </TabsTrigger>
          <TabsTrigger value="conversion" className="data-[state=active]:bg-neza-blue-600 data-[state=active]:text-white">
            Conversión
          </TabsTrigger>
          <TabsTrigger value="retention" className="data-[state=active]:bg-neza-blue-600 data-[state=active]:text-white">
            Retención
          </TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Tráfico por Hora</CardTitle>
                <CardDescription>Distribución de sesiones durante el día</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                    <XAxis dataKey="hour" stroke="#1e40af" />
                    <YAxis stroke="#1e40af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#f0f9ff', 
                        border: '1px solid #1e40af',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="sessions" fill="#1e40af" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Dispositivos</CardTitle>
                <CardDescription>Distribución por tipo de dispositivo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Productos Más Vistos</CardTitle>
                <CardDescription>Top productos por interacciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.topProducts.map((product: any, index: number) => (
                    <div key={product.product} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="text-neza-blue-800">{product.product}</span>
                      </div>
                      <span className="font-semibold text-neza-blue-600">{product.views}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Estados de Usuario</CardTitle>
                <CardDescription>Distribución actual por estado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.userStatusBreakdown.map((status: any, index: number) => (
                    <div key={status.status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-neza-blue-800 capitalize">{status.status}</span>
                      </div>
                      <Badge variant="outline">{status.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <Card className="border-neza-blue-200">
            <CardHeader>
              <CardTitle className="text-neza-blue-800">Embudo de Conversión</CardTitle>
              <CardDescription>Flujo de usuarios a través del proceso</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={funnelData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
                  <XAxis type="number" stroke="#1e40af" />
                  <YAxis dataKey="name" type="category" stroke="#1e40af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f0f9ff', 
                      border: '1px solid #1e40af',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="value" fill="#1e40af" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Actividad Reciente</CardTitle>
                <CardDescription>Últimas 10 actividades de usuarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.recentActivity.slice(0, 10).map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-2 bg-neza-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-neza-blue-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm text-neza-blue-800">{activity.description}</p>
                        <p className="text-xs text-neza-blue-600">
                          {new Date(activity.timestamp).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Archivos Subidos</CardTitle>
                <CardDescription>Tipos de documentos más frecuentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.fileTypeBreakdown.map((fileType: any, index: number) => (
                    <div key={fileType.type} className="flex items-center justify-between">
                      <span className="text-neza-blue-800">{fileType.type.toUpperCase()}</span>
                      <Badge variant="outline">{fileType.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
