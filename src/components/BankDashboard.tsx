
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign, Users, Target, Edit } from "lucide-react";
import { UserData } from "@/pages/Index";

interface BankApplication {
  id: string;
  user: UserData;
  timestamp: Date;
  currentBestRate: number;
  currentBestBank: string;
  myCurrentOffer?: {
    interestRate: number;
    monthlyPayment: number;
    status: "pending" | "submitted" | "won" | "lost";
  };
  riskScore: number;
  competitorCount: number;
}

interface BankDashboardProps {
  bankName: string;
}

export const BankDashboard = ({ bankName }: BankDashboardProps) => {
  const [applications, setApplications] = useState<BankApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<BankApplication | null>(null);
  const [newOffer, setNewOffer] = useState({ interestRate: "", monthlyPayment: "" });

  useEffect(() => {
    // Simular aplicaciones disponibles para el banco
    const mockApplications: BankApplication[] = [
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
        currentBestRate: 16.5,
        currentBestBank: "BCP",
        riskScore: 75,
        competitorCount: 4,
        myCurrentOffer: {
          interestRate: 17.2,
          monthlyPayment: 850,
          status: "submitted"
        }
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
        currentBestRate: 14.2,
        currentBestBank: "Scotiabank",
        riskScore: 95,
        competitorCount: 5
      }
    ];

    setApplications(mockApplications);
  }, []);

  const handleSubmitOffer = (appId: string) => {
    if (!newOffer.interestRate) return;

    setApplications(prev => prev.map(app => 
      app.id === appId 
        ? {
            ...app,
            myCurrentOffer: {
              interestRate: parseFloat(newOffer.interestRate),
              monthlyPayment: parseFloat(newOffer.monthlyPayment),
              status: "submitted" as const
            }
          }
        : app
    ));

    setNewOffer({ interestRate: "", monthlyPayment: "" });
    setSelectedApp(null);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const stats = {
    totalOpportunities: applications.length,
    myOffers: applications.filter(app => app.myCurrentOffer).length,
    winningOffers: applications.filter(app => 
      app.myCurrentOffer && app.currentBestBank === bankName
    ).length,
    avgRiskScore: Math.round(
      applications.reduce((sum, app) => sum + app.riskScore, 0) / applications.length
    )
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard {bankName}</h1>
          <p className="text-gray-600 mt-2">Compite por nuevos clientes en tiempo real</p>
        </div>

        {/* Estadísticas del banco */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Oportunidades</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOpportunities}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mis Ofertas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.myOffers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ganando</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.winningOffers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Riesgo Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgRiskScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="opportunities" className="space-y-4">
          <TabsList>
            <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
            <TabsTrigger value="my-offers">Mis Ofertas</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {applications.map((app) => (
                <Card key={app.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {app.user.firstName} {app.user.lastName}
                        </CardTitle>
                        <CardDescription>
                          DNI: {app.user.dni} • {app.user.productType}
                        </CardDescription>
                      </div>
                      <Badge className={getRiskColor(app.riskScore)}>
                        Riesgo: {app.riskScore}%
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Monto Solicitado</p>
                        <p className="font-semibold">S/ {app.user.requestedAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Ingresos Mensuales</p>
                        <p className="font-semibold">S/ {app.user.monthlyIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Mejor Oferta Actual</p>
                        <p className="font-semibold text-red-600">{app.currentBestRate}% ({app.currentBestBank})</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Competidores</p>
                        <p className="font-semibold">{app.competitorCount} bancos</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      {app.myCurrentOffer ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Mi Oferta Actual</p>
                            <p className="font-semibold">{app.myCurrentOffer.interestRate}%</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={app.myCurrentOffer.status === "won" ? "default" : "secondary"}>
                              {app.myCurrentOffer.status}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedApp(app)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={() => setSelectedApp(app)}
                        >
                          Crear Oferta
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-offers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Ofertas Activas</CardTitle>
                <CardDescription>
                  Gestiona y monitorea tus ofertas en tiempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">Lista de ofertas activas</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Rendimiento</CardTitle>
                <CardDescription>
                  Métricas de éxito y competitividad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600">Próximamente: Análisis detallado</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal para crear/editar oferta */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>
                  {selectedApp.myCurrentOffer ? "Mejorar Oferta" : "Nueva Oferta"}
                </CardTitle>
                <CardDescription>
                  Cliente: {selectedApp.user.firstName} {selectedApp.user.lastName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="interestRate">Tasa de Interés Anual (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={newOffer.interestRate}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, interestRate: e.target.value }))}
                    placeholder="16.5"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Mejor oferta actual: {selectedApp.currentBestRate}%
                  </p>
                </div>

                <div>
                  <Label htmlFor="monthlyPayment">Cuota Mensual (S/)</Label>
                  <Input
                    id="monthlyPayment"
                    type="number"
                    value={newOffer.monthlyPayment}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, monthlyPayment: e.target.value }))}
                    placeholder="850"
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedApp(null)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleSubmitOffer(selectedApp.id)}
                    disabled={!newOffer.interestRate}
                  >
                    Enviar Oferta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
