
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, XCircle, Plus, Trash2, RefreshCw, Eye, Settings } from "lucide-react";
import { bankApiService, BankApiConfig, BankProduct } from "@/services/bankApiService";

export const BankApiManagement = () => {
  const [apiConfigs, setApiConfigs] = useState<BankApiConfig[]>([]);
  const [bankProducts, setBankProducts] = useState<BankProduct[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const [newConfig, setNewConfig] = useState({
    bankName: '',
    apiUrl: '',
    authType: 'token' as const,
    authValue: '',
    updateFrequency: 10,
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setApiConfigs(bankApiService.getApiConfigs());
    setBankProducts(bankApiService.getBankProducts());
  };

  const handleAddConfig = async () => {
    if (!newConfig.bankName || !newConfig.apiUrl || !newConfig.authValue) {
      return;
    }

    setLoading(true);
    try {
      await bankApiService.addApiConfig(newConfig);
      loadData();
      setShowAddDialog(false);
      setNewConfig({
        bankName: '',
        apiUrl: '',
        authType: 'token',
        authValue: '',
        updateFrequency: 10,
        isActive: true
      });
    } catch (error) {
      console.error('Error adding API config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (config: BankApiConfig) => {
    setTestingConnection(config.id);
    try {
      const isConnected = await bankApiService.testConnection(config);
      await bankApiService.updateApiConfig(config.id, {
        connectionStatus: isConnected ? 'connected' : 'error'
      });
      loadData();
    } catch (error) {
      console.error('Error testing connection:', error);
    } finally {
      setTestingConnection(null);
    }
  };

  const handleToggleActive = async (configId: string, isActive: boolean) => {
    await bankApiService.updateApiConfig(configId, { isActive });
    loadData();
  };

  const handleDeleteConfig = async (configId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta configuración de API?')) {
      await bankApiService.deleteApiConfig(configId);
      loadData();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Desconectado</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neza-blue-800">Gestión de APIs Bancarias</h2>
          <p className="text-neza-blue-600">Conecta las APIs de bancos para obtener datos en tiempo real</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-neza-blue-600 hover:bg-neza-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Agregar API
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Conectar Nueva API Bancaria</DialogTitle>
              <DialogDescription>
                Configura la conexión con la API de un banco o entidad financiera
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bankName">Nombre del Banco</Label>
                <Input
                  id="bankName"
                  value={newConfig.bankName}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, bankName: e.target.value }))}
                  placeholder="Ej: Banco de Crédito del Perú"
                />
              </div>
              <div>
                <Label htmlFor="apiUrl">URL del Endpoint</Label>
                <Input
                  id="apiUrl"
                  value={newConfig.apiUrl}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                  placeholder="https://api.banco.com/products"
                />
              </div>
              <div>
                <Label htmlFor="authType">Tipo de Autenticación</Label>
                <Select
                  value={newConfig.authType}
                  onValueChange={(value: any) => setNewConfig(prev => ({ ...prev, authType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="token">Bearer Token</SelectItem>
                    <SelectItem value="api_key">API Key</SelectItem>
                    <SelectItem value="oauth">OAuth</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="authValue">Valor de Autenticación</Label>
                <Input
                  id="authValue"
                  type="password"
                  value={newConfig.authValue}
                  onChange={(e) => setNewConfig(prev => ({ ...prev, authValue: e.target.value }))}
                  placeholder="Token, API Key, credenciales, etc."
                />
              </div>
              <div>
                <Label htmlFor="updateFrequency">Frecuencia de Actualización (minutos)</Label>
                <Select
                  value={newConfig.updateFrequency.toString()}
                  onValueChange={(value) => setNewConfig(prev => ({ ...prev, updateFrequency: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutos</SelectItem>
                    <SelectItem value="10">10 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newConfig.isActive}
                  onCheckedChange={(checked) => setNewConfig(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Activar automáticamente</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddConfig} disabled={loading}>
                {loading ? 'Conectando...' : 'Conectar API'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="configs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configs">Configuraciones de API</TabsTrigger>
          <TabsTrigger value="products">Productos Bancarios</TabsTrigger>
        </TabsList>

        <TabsContent value="configs">
          <div className="grid gap-4">
            {apiConfigs.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay APIs conectadas
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Conecta las APIs de bancos para obtener datos de productos en tiempo real
                  </p>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Conectar primera API
                  </Button>
                </CardContent>
              </Card>
            ) : (
              apiConfigs.map((config) => (
                <Card key={config.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(config.connectionStatus)}
                        <div>
                          <CardTitle className="text-lg">{config.bankName}</CardTitle>
                          <CardDescription>{config.apiUrl}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(config.connectionStatus)}
                        <Switch
                          checked={config.isActive}
                          onCheckedChange={(checked) => handleToggleActive(config.id, checked)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Autenticación:</span>
                        <div className="font-medium capitalize">{config.authType.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Frecuencia:</span>
                        <div className="font-medium">{config.updateFrequency} min</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Última actualización:</span>
                        <div className="font-medium">
                          {config.lastUpdated 
                            ? new Date(config.lastUpdated).toLocaleString('es-ES')
                            : 'Nunca'
                          }
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Estado:</span>
                        <div className="font-medium">
                          {config.isActive ? 'Activo' : 'Inactivo'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection(config)}
                        disabled={testingConnection === config.id}
                      >
                        {testingConnection === config.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                        {testingConnection === config.id ? 'Probando...' : 'Probar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteConfig(config.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Productos Bancarios Sincronizados</CardTitle>
              <CardDescription>
                Productos obtenidos de las APIs conectadas ({bankProducts.length} productos disponibles)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bankProducts.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay productos sincronizados
                  </h3>
                  <p className="text-gray-600">
                    Los productos aparecerán aquí cuando las APIs estén conectadas y funcionando
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bankProducts
                    .sort((a, b) => a.tea - b.tea)
                    .map((product) => (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{product.bankName}</h4>
                            <p className="text-sm text-gray-600">{product.productName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{product.tea}% TEA</div>
                            <div className="text-sm text-gray-500">{product.tcea}% TCEA</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Tipo:</span>
                            <div className="font-medium capitalize">{product.productType.replace('-', ' ')}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Monto:</span>
                            <div className="font-medium">
                              S/ {product.minAmount.toLocaleString()} - S/ {product.maxAmount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Plazo:</span>
                            <div className="font-medium">{product.minTerm} - {product.maxTerm} meses</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Actualizado:</span>
                            <div className="font-medium">
                              {product.lastUpdated.toLocaleString('es-ES')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
