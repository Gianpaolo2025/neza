import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trophy, TrendingUp, Shield, Clock, AlertTriangle, FileText } from "lucide-react";
import { UserProfile, DocumentAnalyzer, DocumentAnalysis } from "@/services/documentAnalyzer";
import { MatchingEngine, ProductMatch, AuctionOffer } from "@/services/matchingEngine";
import { DocumentsSection } from "./DocumentsSection";

interface IntelligentSystemProps {
  userProfile: UserProfile;
  onBack: () => void;
}

export const IntelligentSystem = ({ userProfile, onBack }: IntelligentSystemProps) => {
  const [matches, setMatches] = useState<ProductMatch[]>([]);
  const [auctionOffers, setAuctionOffers] = useState<AuctionOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductType, setSelectedProductType] = useState<string>('');
  const [activeTab, setActiveTab] = useState('offers');

  useEffect(() => {
    loadMatches();
    // Actualizar ofertas cada 30 segundos para simular subasta dinámica
    const interval = setInterval(updateAuction, 30000);
    return () => clearInterval(interval);
  }, [userProfile, selectedProductType]);

  const loadMatches = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simular carga
    
    const productMatches = MatchingEngine.findCompatibleProducts(userProfile, selectedProductType);
    setMatches(productMatches);
    
    const auction = MatchingEngine.createDynamicAuction(productMatches);
    setAuctionOffers(auction);
    
    setLoading(false);
  };

  const updateAuction = () => {
    if (matches.length > 0) {
      const updatedAuction = MatchingEngine.createDynamicAuction(matches);
      setAuctionOffers(updatedAuction);
    }
  };

  const getQualityLevel = (score: number) => {
    if (score >= 85) return { level: 'Alta', color: 'bg-green-500', text: 'text-green-700' };
    if (score >= 70) return { level: 'Media', color: 'bg-yellow-500', text: 'text-yellow-700' };
    return { level: 'Baja', color: 'bg-red-500', text: 'text-red-700' };
  };

  const handleDocumentUpload = (documentType: string, file: File, analysis: DocumentAnalysis, fileId: string) => {
    // Update user profile quality score based on documents
    console.log(`Document uploaded: ${documentType}`, { file: file.name, analysis, fileId });
    
    // Simulate improvement in quality score
    if (userProfile.qualityScore < 95) {
      userProfile.qualityScore = Math.min(95, userProfile.qualityScore + 5);
    }
    
    // Trigger a re-evaluation of matches
    loadMatches();
  };

  const quality = getQualityLevel(userProfile.qualityScore);
  const eligibleProducts = matches.filter(m => m.meetsRequirements);
  const totalProducts = matches.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-emerald-800 mb-2">
              Analizando tu perfil financiero...
            </h2>
            <p className="text-emerald-600">
              Evaluando compatibilidad con {totalProducts} productos de entidades SBS
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-emerald-800">Sistema Inteligente NEZA</h1>
            <p className="text-emerald-600">Productos personalizados según tu perfil SBS</p>
          </div>
        </div>

        {/* Quality Score */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-emerald-600" />
              Calidad de tu Información
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Puntuación de Calidad</span>
                <Badge className={quality.color}>{quality.level} - {userProfile.qualityScore}%</Badge>
              </div>
              <Progress value={userProfile.qualityScore} className="h-2" />
              
              {userProfile.qualityScore < 80 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-yellow-800 font-medium">Mejora tu perfil para acceder a mejores ofertas:</p>
                      <ul className="mt-2 space-y-1 text-yellow-700">
                        <li>• Sube documentos más recientes y de mejor calidad</li>
                        <li>• Actualiza tu reporte crediticio</li>
                        <li>• Verifica que todos los datos sean consistentes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="offers" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Ofertas y Subastas
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Subir Documentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{eligibleProducts.length}</div>
                    <p className="text-sm text-gray-600">Productos Disponibles</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalProducts - eligibleProducts.length}</div>
                    <p className="text-sm text-gray-600">Productos Bloqueados</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{auctionOffers.length}</div>
                    <p className="text-sm text-gray-600">En Subasta Activa</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Type Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Filtrar por Tipo de Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={selectedProductType === '' ? 'default' : 'outline'}
                    onClick={() => setSelectedProductType('')}
                    size="sm"
                  >
                    Todos
                  </Button>
                  {['credito-personal', 'credito-vehicular', 'credito-hipotecario', 'credito-empresarial'].map(type => (
                    <Button
                      key={type}
                      variant={selectedProductType === type ? 'default' : 'outline'}
                      onClick={() => setSelectedProductType(type)}
                      size="sm"
                    >
                      {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Auction */}
            {auctionOffers.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-yellow-800">
                    <Trophy className="w-5 h-5 mr-2" />
                    🔥 Subasta Dinámica Activa
                  </CardTitle>
                  <CardDescription>
                    Las entidades financieras están compitiendo por tu solicitud. Las tasas se actualizan cada 30 segundos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auctionOffers.slice(0, 3).map((offer, index) => (
                      <div key={offer.match.product.id} className={`
                        p-4 rounded-lg border-2 transition-all
                        ${index === 0 ? 'border-yellow-400 bg-yellow-100' : 'border-gray-200 bg-white'}
                      `}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {index === 0 && <Trophy className="w-5 h-5 text-yellow-600 mr-2" />}
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {offer.match.entity.name}
                              </h3>
                              <p className="text-sm text-gray-600">{offer.match.product.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-600">
                              {offer.dynamicRate}% TEA
                            </div>
                            <div className="text-sm text-gray-500">
                              Hasta S/. {offer.match.recommendedAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        {offer.specialConditions.length > 0 && (
                          <div className="mt-2">
                            {offer.specialConditions.map((condition, idx) => (
                              <Badge key={idx} variant="secondary" className="mr-1 text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            Expira: {offer.expiresAt.toLocaleTimeString()}
                          </div>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            Solicitar Ahora
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Products */}
            <Card>
              <CardHeader>
                <CardTitle>Todos los Productos Evaluados</CardTitle>
                <CardDescription>
                  Productos de entidades supervisadas por la SBS según tu perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matches.map((match) => (
                    <div key={match.product.id} className={`
                      p-4 rounded-lg border transition-all
                      ${match.meetsRequirements 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50 opacity-75'}
                    `}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="font-semibold text-gray-900 mr-2">
                              {match.entity.name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {match.entity.type.toUpperCase()}
                            </Badge>
                            {!match.meetsRequirements && (
                              <Badge variant="destructive" className="ml-2 text-xs">
                                No Califica
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{match.product.name}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Compatibilidad:</span>
                              <div className="font-medium">{match.compatibilityScore}%</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Tasa estimada:</span>
                              <div className="font-medium">{match.estimatedRate}% TEA</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Monto recomendado:</span>
                              <div className="font-medium">S/. {match.recommendedAmount.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Riesgo:</span>
                              <Badge className={
                                match.riskLevel === 'bajo' ? 'bg-green-100 text-green-800' :
                                match.riskLevel === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }>
                                {match.riskLevel}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          {match.meetsRequirements ? (
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                              Ver Detalles
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              No Disponible
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {match.missingRequirements.length > 0 && (
                        <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded">
                          <h4 className="text-sm font-medium text-red-800 mb-1">Requisitos faltantes:</h4>
                          <ul className="text-sm text-red-700 space-y-1">
                            {match.missingRequirements.map((req, idx) => (
                              <li key={idx}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsSection onDocumentUpload={handleDocumentUpload} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
