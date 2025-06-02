
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, Star } from "lucide-react";
import { UserData } from "@/pages/Index";
import { generateOffers, BankOffer } from "@/utils/offerGenerator";
import { OfferCard } from "@/components/OfferCard";

interface OffersDashboardProps {
  user: UserData;
  onBack: () => void;
}

export const OffersDashboard = ({ user, onBack }: OffersDashboardProps) => {
  const [offers, setOffers] = useState<BankOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

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

    // Simular actualizaciones en tiempo real cada 10 segundos
    const interval = setInterval(() => {
      const updatedOffers = generateOffers(user);
      setOffers(updatedOffers);
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

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
        </div>
      </div>
    );
  }

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
          <Badge variant="secondary">S/ {user.requestedAmount.toLocaleString()}</Badge>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>¡Ofertas Encontradas!</span>
          </CardTitle>
          <CardDescription>
            Hemos encontrado {offers.length} ofertas personalizadas para tu perfil crediticio
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            isSelected={selectedOffer === offer.id}
            onSelect={() => setSelectedOffer(offer.id)}
          />
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
              <Button className="bg-green-600 hover:bg-green-700">
                Continuar con la Solicitud
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
