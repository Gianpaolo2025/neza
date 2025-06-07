
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, Star, Eye, TrendingUp, DollarSign, Shield, ExternalLink, Gavel } from "lucide-react";
import { UserData } from "@/pages/Index";
import { generateBankOffers, BankOffer } from "@/utils/offerGenerator";
import { OfferDetail } from "@/components/OfferDetail";
import { motion, AnimatePresence } from "framer-motion";

interface OffersDashboardProps {
  user: UserData;
  onBack: () => void;
}

export const OffersDashboard = ({ user, onBack }: OffersDashboardProps) => {
  const [offers, setOffers] = useState<BankOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [viewingOffer, setViewingOffer] = useState<BankOffer | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const loadOffers = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const convertedUser = {
        ...user,
        productType: user.productType || "credito-personal",
        hasOtherDebts: user.hasOtherDebts || "no",
        bankingRelationship: user.bankingRelationship || "ninguna",
        urgencyLevel: user.urgencyLevel || "normal",
        preferredBank: user.preferredBank || "",
        preferredCurrency: user.preferredCurrency || "PEN"
      };
      
      const generatedOffers = generateBankOffers(convertedUser);
      setOffers(generatedOffers);
      setLoading(false);
    };

    loadOffers();

    const interval = setInterval(() => {
      const convertedUser = {
        ...user,
        productType: user.productType || "credito-personal",
        hasOtherDebts: user.hasOtherDebts || "no",
        bankingRelationship: user.bankingRelationship || "ninguna",
        urgencyLevel: user.urgencyLevel || "normal",
        preferredBank: user.preferredBank || "",
        preferredCurrency: user.preferredCurrency || "PEN"
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

  const handleApplyForCredit = (offer: BankOffer) => {
    // Abrir la página del banco en una nueva ventana
    window.open(offer.bankUrl, '_blank');
    alert("Te estamos redirigiendo al banco. Completa tu solicitud directamente con la entidad financiera.");
  };

  if (viewingOffer) {
    return (
      <OfferDetail 
        offer={viewingOffer} 
        onBack={handleBackToOffers}
        onApply={() => handleApplyForCredit(viewingOffer)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Gavel className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            </motion.div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              🏛️ Proceso de Subasta Activo
            </h2>
            <p className="text-gray-600 mb-4">
              Las entidades financieras están compitiendo por tu solicitud en tiempo real
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 max-w-md mx-auto">
              <strong>ℹ️ Este es un proceso de subasta:</strong> Los bancos ajustan sus ofertas automáticamente para darte las mejores condiciones.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = [...new Set(offers.map(offer => offer.category))];
  const filteredOffers = offers.filter(offer => {
    const categoryMatch = filterCategory === "all" || offer.category === filterCategory;
    const statusMatch = filterStatus === "all" || offer.auctionStatus === filterStatus;
    return categoryMatch && statusMatch;
  });

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

  const getStatusColor = (status: string) => {
    if (status === 'approved') return 'bg-green-100 text-green-800 border-green-300';
    if (status === 'preapproved') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusText = (status: string) => {
    if (status === 'approved') return '✅ APROBADO';
    if (status === 'preapproved') return '⏳ PRE-APROBADO';
    return '📋 PENDIENTE';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header mejorado para móvil */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex items-center space-x-2 border-blue-300 text-blue-600 hover:bg-blue-50 w-full md:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Nueva Búsqueda</span>
          </Button>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-slate-600">Solicitud para</p>
            <p className="font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
            <div className="flex flex-wrap justify-center md:justify-end gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                {getProductDisplayName(user.productType || "credito-personal")}
              </Badge>
              <Badge className="bg-cyan-100 text-cyan-800 border-cyan-300">
                {offers[0]?.currency} {user.requestedAmount.toLocaleString()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Información de subasta */}
        <Card className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Gavel className="h-5 w-5" />
              <span>🏛️ Sistema de Subasta Financiera</span>
            </CardTitle>
            <CardDescription className="text-orange-700">
              <strong>Este es un proceso de subasta:</strong> {filteredOffers.length} entidades financieras supervisadas por la SBS están compitiendo por tu solicitud. 
              Las tasas se actualizan automáticamente cada 15 segundos para ofrecerte las mejores condiciones.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Filtros por categoría y estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-white/80">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-slate-700">📂 Filtrar por Categoría</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterCategory("all")}
                  className="text-xs"
                >
                  Todos
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={filterCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory(category)}
                    className="text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-slate-700">🎯 Estado de Subasta</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                  className="text-xs"
                >
                  Todos
                </Button>
                <Button
                  variant={filterStatus === "approved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("approved")}
                  className="text-xs"
                >
                  ✅ Aprobados
                </Button>
                <Button
                  variant={filterStatus === "preapproved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("preapproved")}
                  className="text-xs"
                >
                  ⏳ Pre-aprobados
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de ofertas mejorada para móvil */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Información principal */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{offer.icon}</span>
                            <h4 className="text-lg md:text-xl font-bold text-slate-800">
                              {offer.bankName}
                            </h4>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {index === 0 && (
                              <Badge className="bg-green-100 text-green-800 border-green-300">
                                <Star className="w-3 h-3 mr-1" />
                                Mejor Opción
                              </Badge>
                            )}
                            
                            <Badge className={getStatusColor(offer.auctionStatus)}>
                              {getStatusText(offer.auctionStatus)}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-500 mb-3">{offer.category}</p>
                        
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

                        <p className="text-sm text-slate-600 mb-2">
                          {offer.description}
                        </p>
                      </div>

                      {/* Información financiera */}
                      <div className="text-center md:text-right md:ml-6">
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600 mx-auto md:mx-0" />
                            <span className="text-xl md:text-2xl font-bold text-green-600">
                              {offer.rate}% TEA
                            </span>
                          </div>
                          
                          <div className="text-sm text-slate-600">
                            <div className="font-semibold">Cuota mensual:</div>
                            <div className="text-lg font-bold text-slate-800">
                              {offer.currency} {offer.monthlyPayment.toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="text-sm text-slate-600 space-y-1">
                            <div>Monto: {offer.currency} {offer.maxAmount.toLocaleString()}</div>
                            <div>Plazo: hasta {offer.maxTerm} meses</div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row items-center gap-1 text-xs text-slate-500 justify-center md:justify-end">
                            <Shield className="w-3 h-3" />
                            <span>Supervisado SBS</span>
                          </div>

                          <div className="text-center md:text-right text-sm font-medium text-blue-600">
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

                    {/* Botones de acción */}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOffer(offer);
                            }}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 w-full md:w-auto"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver Requisitos
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyForCredit(offer);
                            }}
                            className="border-green-300 text-green-600 hover:bg-green-50 w-full md:w-auto"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Ir al Banco
                          </Button>
                        </div>
                        
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 w-full md:w-auto"
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
          </AnimatePresence>
        </div>

        {/* Acción final */}
        {selectedOffer && (
          <Card className="mt-6 border-green-200 bg-green-50/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <Star className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  ¡Oferta Seleccionada!
                </h3>
                <p className="text-green-700 mb-4">
                  Procede con la solicitud formal en la página oficial del banco
                </p>
                <div className="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 md:space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const offer = offers.find(o => o.id === selectedOffer);
                      if (offer) handleViewOffer(offer);
                    }}
                    className="border-green-300 text-green-700 hover:bg-green-100"
                  >
                    Ver Requisitos Completos
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      const offer = offers.find(o => o.id === selectedOffer);
                      if (offer) handleApplyForCredit(offer);
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ir al Banco Oficial
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
