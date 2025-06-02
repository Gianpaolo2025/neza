
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Users, TrendingUp, Clock, Filter } from "lucide-react";
import { UserData } from "@/pages/Index";

interface ApplicationWithOffers {
  id: string;
  user: UserData;
  timestamp: Date;
  status: "nuevo" | "en-proceso" | "finalizado";
  offersCount: number;
  bestOffer?: {
    bankName: string;
    interestRate: number;
  };
}

export const AdminDashboard = () => {
  const [applications, setApplications] = useState<ApplicationWithOffers[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithOffers | null>(null);

  useEffect(() => {
    // Simular datos de solicitudes existentes
    const mockApplications: ApplicationWithOffers[] = [
      {
        id: "APP-001",
        user: {
          dni: "12345678",
          firstName: "Juan Carlos",
          lastName: "García López",
          email: "juan@email.com",
          phone: "999888777",
          monthlyIncome: 3500,
          requestedAmount: 15000,
          employmentType: "dependiente",
          creditHistory: "bueno",
          productType: "credito-personal",
          hasOtherDebts: "pocas",
          bankingRelationship: "un-banco",
          urgencyLevel: "rapido",
          preferredBank: "bcp"
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: "en-proceso",
        offersCount: 5,
        bestOffer: { bankName: "BCP", interestRate: 16.5 }
      },
      {
        id: "APP-002",
        user: {
          dni: "87654321",
          firstName: "María Elena",
          lastName: "Rodríguez Silva",
          email: "maria@email.com",
          phone: "999777666",
          monthlyIncome: 5000,
          requestedAmount: 25000,
          employmentType: "independiente",
          creditHistory: "excelente",
          productType: "credito-vehicular",
          hasOtherDebts: "no",
          bankingRelationship: "varios-bancos",
          urgencyLevel: "normal",
          preferredBank: "scotiabank"
        },
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: "nuevo",
        offersCount: 3,
        bestOffer: { bankName: "Scotiabank", interestRate: 14.2 }
      },
      {
        id: "APP-003",
        user: {
          dni: "11223344",
          firstName: "Pedro José",
          lastName: "Mendoza Vargas",
          email: "pedro@email.com",
          phone: "999666555",
          monthlyIncome: 2800,
          requestedAmount: 8000,
          employmentType: "dependiente",
          creditHistory: "regular",
          productType: "credito-personal",
          hasOtherDebts: "moderadas",
          bankingRelationship: "nuevo",
          urgencyLevel: "inmediato",
          preferredBank: "ninguno"
        },
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: "nuevo",
        offersCount: 6,
        bestOffer: { bankName: "Mi Banco", interestRate: 22.8 }
      }
    ];

    setApplications(mockApplications);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "nuevo": return "bg-blue-100 text-blue-800";
      case "en-proceso": return "bg-yellow-100 text-yellow-800";
      case "finalizado": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProductDisplayName = (productType: string) => {
    const names = {
      "credito-personal": "Crédito Personal",
      "credito-vehicular": "Crédito Vehicular",
      "credito-hipotecario": "Crédito Hipotecario",
      "tarjeta-credito": "Tarjeta de Crédito",
      "credito-empresarial": "Crédito Empresarial"
    };
    return names[productType as keyof typeof names] || "Producto Financiero";
  };

  const stats = {
    totalApplications: applications.length,
    newApplications: applications.filter(app => app.status === "nuevo").length,
    inProgress: applications.filter(app => app.status === "en-proceso").length,
    avgOffers: Math.round(applications.reduce((sum, app) => sum + app.offersCount, 0) / applications.length)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
          <p className="text-gray-600 mt-2">Gestiona solicitudes de crédito y competencia bancaria</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Solicitudes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Nuevas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.newApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Proceso</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Filter className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Promedio Ofertas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgOffers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="solicitudes" className="space-y-4">
          <TabsList>
            <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
            <TabsTrigger value="competencia">Competencia Bancaria</TabsTrigger>
            <TabsTrigger value="analisis">Análisis</TabsTrigger>
          </TabsList>

          <TabsContent value="solicitudes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes de Crédito</CardTitle>
                <CardDescription>
                  Administra todas las solicitudes de crédito recibidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Ingresos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Ofertas</TableHead>
                      <TableHead>Mejor Tasa</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono">{app.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.user.firstName} {app.user.lastName}</p>
                            <p className="text-sm text-gray-600">DNI: {app.user.dni}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getProductDisplayName(app.user.productType || "")}</TableCell>
                        <TableCell>S/ {app.user.requestedAmount.toLocaleString()}</TableCell>
                        <TableCell>S/ {app.user.monthlyIncome.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{app.offersCount} ofertas</TableCell>
                        <TableCell>
                          {app.bestOffer && (
                            <div>
                              <p className="font-medium">{app.bestOffer.interestRate}%</p>
                              <p className="text-sm text-gray-600">{app.bestOffer.bankName}</p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedApplication(app)}
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

          <TabsContent value="competencia" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Competencia Bancaria en Tiempo Real</CardTitle>
                <CardDescription>
                  Monitorea cómo los bancos compiten por cada cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">Próximamente: Dashboard de competencia bancaria</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Aquí verás las mejoras de ofertas en tiempo real
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analisis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Conversión</CardTitle>
                <CardDescription>
                  Estadísticas de éxito y patrones de comportamiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">Próximamente: Análisis detallado</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Métricas de conversión y insights del negocio
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de detalles */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Detalles de Solicitud - {selectedApplication.id}</CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedApplication(null)}
                  className="absolute top-4 right-4"
                >
                  ✕
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Información Personal</h4>
                    <p>Nombre: {selectedApplication.user.firstName} {selectedApplication.user.lastName}</p>
                    <p>DNI: {selectedApplication.user.dni}</p>
                    <p>Email: {selectedApplication.user.email}</p>
                    <p>Teléfono: {selectedApplication.user.phone}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Información Financiera</h4>
                    <p>Ingresos: S/ {selectedApplication.user.monthlyIncome.toLocaleString()}</p>
                    <p>Monto: S/ {selectedApplication.user.requestedAmount.toLocaleString()}</p>
                    <p>Empleo: {selectedApplication.user.employmentType}</p>
                    <p>Historial: {selectedApplication.user.creditHistory}</p>
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
