
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, Star, Eye, TrendingUp, DollarSign, Shield } from "lucide-react";
import { UserData } from "@/pages/Index";
import { generateBankOffers, BankOffer } from "@/utils/offerGenerator";
import { OfferDetail } from "@/components/OfferDetail";
import { motion } from "framer-motion";

interface OffersDashboardProps {
  user: UserData;
  onBack: () => void;
}

export const OffersDashboard = ({ user, onBack }: OffersDashboardProps) => {
  const [offers, setOffers] = useState<BankOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [viewingOffer, setViewingOffer] = useState<BankOffer | null>(null);

  useEffect(() => {
    // Simular carga y generación de ofertas
    const loadOffers = async () => {
      setLoading(true);
      
      // Simular tiempo de carga
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Convert UserData to the format expected by generateBankOffers
      const convertedUser = {
        ...user,
        productType: user.productType || "credito-personal",
        hasOtherDebts: user.hasOtherDebts || "no",
        bankingRelationship: user.bankingRelationship || "ninguna",
        urgencyLevel: user.urgencyLevel || "normal",
        preferredBank: user.preferredBank || ""
      };
      
      const generatedOffers = generateBankOffers(convertedUser);
      setOffers(generatedOffers);
      setLoading(false);
    };

    loadOffers();

    // Simular actualizaciones en tiempo real cada 15 segundos
    const interval = setInterval(() => {
      const convertedUser = {
        ...user,
        productType: user.productType || "credito-personal",
        hasOtherDebts: user.hasOtherDebts || "no",
        bankingRelationship: user.bankingRelationship || "ninguna",
        urgencyLevel: user.urgencyLevel || "normal",
        preferredBank: user.preferredBank || ""
      };
      const updatedOffers = generateBankOffers(convertedUser);
      setOffers(updatedOffers);
    }, 15000);

    return () => clearInterval(interval);
  }, [user]);

  const handleViewOffer = (offer: BankOffer) => {
    setViewingOffer(offer);
  };

  const handleBackToOffers = () => {
    setViewingOffer(null);
  };

  const handleApplyForCredit = () => {
    alert("¡Solicitud enviada! Te contactaremos pronto para continuar con el proceso.");
  };

  if (viewingOffer) {
    return (
      <OfferDetail 
        offer={viewingOffer} 
        onBack={handleBackToOffers}
        onApply={handleApplyForCredit}
      />
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <Clock className="h-12 w-12 mx-auto text-blue-600 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Buscando las mejores ofertas para ti...
          </h2>
          <p className="text-gray-600">
            Estamos comparando opciones de múltiples entidades financieras
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Los bancos están compitiendo en tiempo real por tu solicitud
          </div>
        </div>
      </div>
    );
  }

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

  const getPopularityColor = (offer: BankOffer) => {
    if (offer.score >= 90) return 'text-green-600';
    if (offer.score >= 80) return 'text-blue-600';
    if (offer.score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getPopularityText = (offer: BankOffer) => {
    if (offer.score >= 90) return 'Altamente Recomendado';
    if (offer.score >= 80) return 'Muy Buena Opción';
    if (offer.score >= 70) return 'Buena Opción';
    return 'Opción Disponible';
  };

  // Ordenar ofertas por score (descendente) para mostrar las mejores primero
  const sortedOffers = [...offers].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="flex items-center space-x-2 border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Nueva Búsqueda</span>
        </Button>
        
        <div className="text-right">
          <p className="text-sm text-slate-600">Solicitud para</p>
          <p className="font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              {getProductDisplayName(user.productType || "credito-personal")}
            </Badge>
            <Badge className="bg-cyan-100 text-cyan-800 border-cyan-300">
              S/ {user.requestedAmount.toLocaleString()}
            </Badge>
          </div>
        </div>
      </div>

      <Card className="mb-6 bg-white/80 backdrop-blur-sm border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-slate-800">¡Ofertas Encontradas!</span>
          </CardTitle>
          <CardDescription className="text-slate-600">
            Hemos encontrado {offers.length} ofertas personalizadas para tu perfil crediticio.
            Ordenadas por conveniencia y popularidad en el mercado peruano.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Vista de lista estilo Trivago */}
      <div className="space-y-4">
        {sortedOffers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 ${
                index === 0 
                  ? 'border-l-green-500 bg-green-50/50' 
                  : 'border-l-blue-300'
              } ${
                selectedOffer === offer.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              } bg-white/80 backdrop-blur-sm`}
              onClick={() => setSelectedOffer(offer.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Información principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-slate-800">
                        {offer.bankName}
                      </h4>
                      
                      {index === 0 && (
                        <Badge className="bg-green-100 text-green-800 border-green-300">
                          <Star className="w-3 h-3 mr-1" />
                          Mejor Opción
                        </Badge>
                      )}
                      
                      <Badge variant="outline" className={getPopularityColor(offer)}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {getPopularityText(offer)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-500 mb-3">{offer.productType}</p>
                    
                    {/* Beneficios principales */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {offer.features.slice(0, 3).map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Descripción */}
                    <p className="text-sm text-slate-600 mb-2">
                      {offer.description}
                    </p>
                  </div>

                  {/* Información financiera */}
                  <div className="text-right ml-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {offer.rate}% TEA
                        </span>
                      </div>
                      
                      <div className="text-sm text-slate-600">
                        <div className="font-semibold">Cuota mensual aproximada:</div>
                        <div className="text-lg font-bold text-slate-800">
                          S/ {offer.monthlyPayment.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-600">
                        <div>Monto: S/ {offer.maxAmount.toLocaleString()}</div>
                        <div>Plazo: hasta {offer.maxTerm} meses</div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Shield className="w-3 h-3" />
                        <span>Supervisado SBS</span>
                      </div>

                      <div className="text-right text-sm font-medium text-blue-600">
                        Score: {offer.score}/100
                      </div>
                    </div>
                    
                    {selectedOffer === offer.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-3"
                      >
                        <CheckCircle className="w-6 h-6 text-blue-600 mx-auto" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Botón de acción */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOffer(offer);
                        }}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalles
                      </Button>
                    </div>
                    
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOffer(offer.id);
                      }}
                    >
                      Seleccionar Oferta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedOffer && (
        <Card className="mt-6 border-green-200 bg-green-50/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <Star className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                ¡Oferta Seleccionada!
              </h3>
              <p className="text-green-700 mb-4">
                Procede con la solicitud formal del banco seleccionado
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    const offer = offers.find(o => o.id === selectedOffer);
                    if (offer) handleViewOffer(offer);
                  }}
                  className="border-green-300 text-green-700 hover:bg-green-100"
                >
                  Ver Detalles Completos
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Continuar con la Solicitud
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
