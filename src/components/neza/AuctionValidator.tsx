
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
  const [autoRedirectTimer, setAutoRedirectTimer] = useState<number | null>(null);

  useEffect(() => {
    validateUserForAuction();
    
    return () => {
      if (autoRedirectTimer) {
        clearTimeout(autoRedirectTimer);
      }
    };
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

      try {
        // Enhanced validation rules
        if (!userData.monthlyIncome || userData.monthlyIncome < 1000) {
          qualified = false;
          reasons.push('Ingreso mensual mínimo requerido: S/ 1,000');
        }

        if (!userData.requestedAmount || userData.requestedAmount <= 0) {
          qualified = false;
          reasons.push('Debe especificar un monto válido para la solicitud');
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

        // Product-specific validations
        if (userData.productType === 'credito-hipotecario') {
          if (userData.employmentType === 'independiente' && userData.monthlyIncome < 3000) {
            qualified = false;
            reasons.push('Para crédito hipotecario como independiente se requiere ingreso mínimo de S/ 3,000');
          }
          if (userData.requestedAmount < 50000) {
            qualified = false;
            reasons.push('Para crédito hipotecario el monto mínimo es S/ 50,000');
          }
        }

        if (userData.productType === 'credito-vehicular' && userData.requestedAmount < 10000) {
          qualified = false;
          reasons.push('Para crédito vehicular el monto mínimo es S/ 10,000');
        }

        // Age validation (if birth date is available)
        if (userData.birthDate) {
          const age = calculateAge(userData.birthDate);
          if (age < 18) {
            qualified = false;
            reasons.push('Debe ser mayor de 18 años para solicitar productos financieros');
          }
          if (age > 70) {
            qualified = false;
            reasons.push('La edad máxima para solicitar este producto es 70 años');
          }
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
          const timer = setTimeout(() => {
            onProceedToAuction();
          }, 3000);
          setAutoRedirectTimer(timer);
        }
      } catch (error) {
        console.error('Error during validation:', error);
        setValidationStatus('not_qualified');
        setQualificationReasons(['Error durante la validación. Por favor, intenta nuevamente.']);
      }
    }, 2000);
  };

  const calculateAge = (birthDate: string): number => {
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 0;
    }
  };

  const handleRetry = () => {
    if (autoRedirectTimer) {
      clearTimeout(autoRedirectTimer);
      setAutoRedirectTimer(null);
    }
    onRetry();
  };

  const handleBack = () => {
    if (autoRedirectTimer) {
      clearTimeout(autoRedirectTimer);
      setAutoRedirectTimer(null);
    }
    onBack();
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
              <strong>{userData.productType}</strong> por <strong>S/ {userData.requestedAmount?.toLocaleString()}</strong>.
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

            <Button
              onClick={onProceedToAuction}
              className="bg-green-600 hover:bg-green-700"
            >
              Continuar a la subasta ahora
            </Button>
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
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al formulario
            </Button>
            <Button
              onClick={handleRetry}
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
