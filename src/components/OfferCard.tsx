
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Shield, TrendingDown, CheckCircle } from "lucide-react";
import { BankOffer } from "@/utils/offerGenerator";

interface OfferCardProps {
  offer: BankOffer;
  isSelected: boolean;
  onSelect: () => void;
}

export const OfferCard = ({ offer, isSelected, onSelect }: OfferCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprobado": return "bg-green-100 text-green-800";
      case "pre-aprobado": return "bg-yellow-100 text-yellow-800";
      case "pendiente": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "Bajo": return "bg-green-500";
      case "Medio": return "bg-yellow-500";
      case "Alto": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
      isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""
    } ${offer.recommended ? "border-yellow-300 bg-yellow-50" : ""}`}
    onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getRiskBadgeColor(offer.riskLevel)}`}></div>
            <CardTitle className="text-lg">{offer.bankName}</CardTitle>
          </div>
          {offer.recommended && (
            <Badge className="bg-yellow-500 text-yellow-900">Recomendado</Badge>
          )}
        </div>
        <CardDescription className="flex items-center space-x-2">
          <Badge className={getStatusColor(offer.status)}>
            {offer.status}
          </Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {offer.interestRate}%
          </div>
          <p className="text-sm text-gray-600">Tasa de interés anual</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Cuota Mensual</p>
            <p className="font-semibold">S/ {offer.monthlyPayment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Plazo</p>
            <p className="font-semibold">{offer.term} meses</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Costo Total:</span>
            <span className="font-semibold">S/ {offer.totalCost.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Ahorro vs promedio:</span>
            <span className="font-semibold text-green-600">S/ {offer.savings.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{offer.approvalTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>Riesgo {offer.riskLevel}</span>
          </div>
        </div>

        <div className="pt-2">
          <Button 
            className={`w-full ${isSelected ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? (
              <span className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Seleccionado</span>
              </span>
            ) : (
              "Seleccionar Oferta"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
