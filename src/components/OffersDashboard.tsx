
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, Star, Eye } from "lucide-react";
import { UserData } from "@/pages/Index";
import { generateOffers, BankOffer } from "@/utils/offerGenerator";
import { OfferCard } from "@/components/OfferCard";
import { OfferDetail } from "@/components/OfferDetail";

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
      
      const generatedOffers = generateOffers(user);
      setOffers(generatedOffers);
      setLoading(false);
    };

    loadOffers();

    // Simular actualizaciones en tiempo real cada 15 segundos
    const interval = setInterval(() => {
      const updatedOffers = generateOffers(user);
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
            Estamos comparando opciones de {offers.length || "múltiples"} entidades financieras
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Nueva Búsqueda</span>
        </Button>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Solicitud para</p>
          <p className="font-semibold">{user.firstName} {user.lastName}</p>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{getProductDisplayName(user.productType || "credito-personal")}</Badge>
            <Badge variant="secondary">S/ {user.requestedAmount.toLocaleString()}</Badge>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>¡Ofertas Encontradas!</span>
          </CardTitle>
          <CardDescription>
            Hemos encontrado {offers.length} ofertas personalizadas para tu perfil crediticio.
            Los bancos están actualizando sus ofertas cada 15 segundos para competir por tu solicitud.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div key={offer.id} className="relative">
            <OfferCard
              offer={offer}
              isSelected={selectedOffer === offer.id}
              onSelect={() => setSelectedOffer(offer.id)}
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-3 right-3 bg-white/90 hover:bg-white"
              onClick={() => handleViewOffer(offer)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {selectedOffer && (
        <Card className="mt-6 border-green-200 bg-green-50">
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
