
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Clock, CreditCard, FileText, Phone, MapPin } from "lucide-react";
import { BankOffer } from "@/utils/offerGenerator";

interface OfferDetailProps {
  offer: BankOffer;
  onBack: () => void;
  onApply: () => void;
}

export const OfferDetail = ({ offer, onBack, onApply }: OfferDetailProps) => {
  const [showPaymentSimulator, setShowPaymentSimulator] = useState(false);

  const getBankDescription = (bankName: string) => {
    const descriptions = {
      "Banco de Crédito BCP": "El banco más grande del Perú, reconocido por su solidez financiera y amplia red de agencias. Especializado en créditos personales con tasas competitivas.",
      "BBVA Continental": "Banco internacional con fuerte presencia digital. Ofrece procesos rápidos y tecnología avanzada para gestión de créditos.",
      "Scotiabank Perú": "Banco canadiense con enfoque en clientes premium. Conocido por su excelente atención al cliente y productos personalizados.",
      "Interbank": "Banco peruano innovador con fuerte enfoque digital. Procesos 100% online y respuesta inmediata.",
      "Banco Pichincha": "Banco ecuatoriano con tarifas competitivas. Enfocado en pequeñas y medianas empresas y personas naturales.",
      "Mi Banco": "Banco especializado en microfinanzas. Ideal para personas con historial crediticio limitado."
    };
    return descriptions[bankName as keyof typeof descriptions] || "Entidad financiera regulada por la SBS.";
  };

  const getPaymentOptions = () => [
    "Débito automático desde cuenta corriente/ahorros",
    "Pago en ventanilla en cualquier agencia",
    "Transferencia bancaria",
    "Pago por banca por internet",
    "Aplicación móvil del banco",
    "Agentes bancarios autorizados"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a ofertas</span>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{offer.bankName}</CardTitle>
              <CardDescription className="text-base mt-2">
                {getBankDescription(offer.bankName)}
              </CardDescription>
            </div>
            {offer.recommended && (
              <Badge className="bg-yellow-500 text-yellow-900">Recomendado</Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Detalles del Crédito</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{offer.interestRate}%</div>
              <p className="text-sm text-gray-600">Tasa de interés anual</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Cuota Mensual</p>
                <p className="text-lg font-semibold">S/ {offer.monthlyPayment.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plazo</p>
                <p className="text-lg font-semibold">{offer.term} meses</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Costo Total</p>
                <p className="text-lg font-semibold">S/ {offer.totalCost.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ahorro</p>
                <p className="text-lg font-semibold text-green-600">S/ {offer.savings.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Aprobación: {offer.approvalTime}</span>
              </div>
              <Badge variant="secondary">Riesgo {offer.riskLevel}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Requisitos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {offer.requirements.map((req, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span className="text-sm">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Formas de Pago</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {getPaymentOptions().map((option, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">{option}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Contacto y Ubicación</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">Central telefónica: (01) 311-9000</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>• Más de 400 agencias a nivel nacional</p>
              <p>• Atención 24/7 por banca telefónica</p>
              <p>• Plataforma digital disponible</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={onApply} className="bg-green-600 hover:bg-green-700 px-8 py-3">
          Solicitar este Crédito
        </Button>
      </div>
    </div>
  );
};
