
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ArrowLeft, CheckCircle } from "lucide-react";
import { UserData } from "@/types/user";
import { userTrackingService } from "@/services/userTracking";

interface AuctionValidatorProps {
  userData: UserData;
  onRetry: () => void;
  onBack: () => void;
  onProceedToAuction: () => void;
}

export const AuctionValidator = ({ userData, onRetry, onBack, onProceedToAuction }: AuctionValidatorProps) => {
  const [validationStatus, setValidationStatus] = useState<'validating' | 'qualified' | 'not_qualified'>('validating');
  const [qualificationReasons, setQualificationReasons] = useState<string[]>([]);

  useEffect(() => {
    validateUserForAuction();
  }, [userData]);

  const validateUserForAuction = () => {
    setValidationStatus('validating');
    
    // Track validation start
    userTrackingService.trackActivity(
      'auction_validation_start',
      userData,
      'Iniciando validación para subasta'
    );

    // Simulate validation process
    setTimeout(() => {
      const reasons: string[] = [];
      let qualified = true;

      // Validation rules
      if (userData.monthlyIncome < 1000) {
        qualified = false;
        reasons.push('Ingreso mensual mínimo requerido: S/ 1,000');
      }

      if (userData.requestedAmount > userData.monthlyIncome * 10) {
        qualified = false;
        reasons.push('El monto solicitado excede 10 veces tu ingreso mensual');
      }

      if (userData.creditHistory === 'malo') {
        qualified = false;
        reasons.push('Historial crediticio requiere mejora');
      }

      if (userData.hasOtherDebts === 'altas') {
        qualified = false;
        reasons.push('Nivel de endeudamiento actual es muy alto');
      }

      // Age validation (if available in future)
      // Employment validation for certain products
      if (userData.productType === 'credito-hipotecario' && userData.employmentType === 'independiente' && userData.monthlyIncome < 3000) {
        qualified = false;
        reasons.push('Para crédito hipotecario como independiente se requiere ingreso mínimo de S/ 3,000');
      }

      setQualificationReasons(reasons);
      setValidationStatus(qualified ? 'qualified' : 'not_qualified');

      // Track validation result
      userTrackingService.trackActivity(
        'auction_validation_completed',
        { 
          qualified, 
          reasons: reasons.length,
          productType: userData.productType,
          requestedAmount: userData.requestedAmount 
        },
        qualified ? 'Usuario calificó para subasta' : 'Usuario no calificó para subasta'
      );

      if (qualified) {
        // Auto-proceed to auction after showing success
        setTimeout(() => {
          onProceedToAuction();
        }, 3000);
      }
    }, 2000);
  };

  if (validationStatus === 'validating') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-blue-800">
              Validando tu perfil para la subasta...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600">
              Estamos verificando que tu perfil cumpla con los requisitos de las entidades financieras.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                Este proceso toma unos segundos. Verificamos más de 20 criterios diferentes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (validationStatus === 'qualified') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl text-green-800">
              ¡Felicitaciones! Calificas para la subasta
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-green-700">
              Tu perfil cumple con los requisitos. Las entidades financieras podrán hacer ofertas para tu solicitud de{' '}
              <strong>{userData.productType}</strong> por <strong>S/ {userData.requestedAmount.toLocaleString()}</strong>.
            </p>
            
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Próximos pasos:</h4>
              <ul className="text-sm text-green-700 space-y-1 text-left">
                <li>• Las entidades comenzarán a evaluar tu solicitud</li>
                <li>• Recibirás ofertas en tiempo real</li>
                <li>• Podrás comparar y elegir la mejor opción</li>
              </ul>
            </div>

            <p className="text-sm text-green-600">
              Serás redirigido automáticamente a la subasta en unos segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // not_qualified
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl text-red-800">
            Lo sentimos, por el momento no calificas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-700 text-center">
            Según las condiciones ingresadas, actualmente no calificas para ninguna subasta. 
            Te invitamos a intentarlo nuevamente más adelante o modificar tus respuestas.
          </p>

          {qualificationReasons.length > 0 && (
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Motivos específicos:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {qualificationReasons.map((reason, index) => (
                  <li key={index}>• {reason}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Recomendaciones:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Revisa tus respuestas en el formulario</li>
              <li>• Considera solicitar un monto menor</li>
              <li>• Mejora tu historial crediticio</li>
              <li>• Reduce tus deudas actuales</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al formulario
            </Button>
            <Button
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Intentar nuevamente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
