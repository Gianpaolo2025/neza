
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Clock, User, FileText, Mail, Phone, DollarSign } from "lucide-react";

interface UserData {
  dni: string;
  email: string;
  phone: string;
  monthlyIncome: string;
}

interface DocumentStatus {
  payslips: 'pending' | 'uploaded' | 'verified' | 'rejected';
  workCertificate: 'pending' | 'uploaded' | 'verified' | 'rejected';
  creditReport: 'pending' | 'uploaded' | 'verified' | 'rejected';
  incomeProof: 'pending' | 'uploaded' | 'verified' | 'rejected';
}

interface VerificationStatusProps {
  userData: UserData;
  documentStatus: DocumentStatus;
  onBack: () => void;
}

export const VerificationStatus = ({ userData, documentStatus, onBack }: VerificationStatusProps) => {
  const getOverallStatus = () => {
    const requiredDocs = ['payslips', 'workCertificate', 'creditReport'] as const;
    const verifiedCount = requiredDocs.filter(doc => documentStatus[doc] === 'verified').length;
    const rejectedCount = requiredDocs.filter(doc => documentStatus[doc] === 'rejected').length;
    
    if (verifiedCount === requiredDocs.length) return 'completed';
    if (rejectedCount > 0) return 'issues';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verificado';
      case 'rejected':
        return 'Rechazado';
      case 'uploaded':
        return 'En revisión';
      default:
        return 'Pendiente';
    }
  };

  const overallStatus = getOverallStatus();

  const documents = [
    { key: 'payslips', name: 'Boletas de Pago', required: true },
    { key: 'workCertificate', name: 'Certificado de Trabajo', required: true },
    { key: 'creditReport', name: 'Reporte Crediticio', required: true },
    { key: 'incomeProof', name: 'Constancia de Ingresos', required: false }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className={`
        ${overallStatus === 'completed' ? 'border-green-200 bg-green-50' : ''}
        ${overallStatus === 'issues' ? 'border-red-200 bg-red-50' : ''}
        ${overallStatus === 'pending' ? 'border-yellow-200 bg-yellow-50' : ''}
      `}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {overallStatus === 'completed' && <CheckCircle className="w-16 h-16 text-green-500" />}
            {overallStatus === 'issues' && <AlertCircle className="w-16 h-16 text-red-500" />}
            {overallStatus === 'pending' && <Clock className="w-16 h-16 text-yellow-500" />}
          </div>
          <CardTitle className="text-2xl">
            {overallStatus === 'completed' && 'Verificación Completada'}
            {overallStatus === 'issues' && 'Verificación con Observaciones'}
            {overallStatus === 'pending' && 'Verificación en Proceso'}
          </CardTitle>
          <CardDescription>
            {overallStatus === 'completed' && 'Tu perfil ha sido verificado exitosamente. Ahora puedes acceder a todos nuestros productos financieros.'}
            {overallStatus === 'issues' && 'Algunos documentos necesitan ser revisados. Por favor, corrige las observaciones indicadas.'}
            {overallStatus === 'pending' && 'Estamos revisando tu información. El proceso puede tomar hasta 24 horas.'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">DNI:</span>
            <span className="font-medium">{userData.dni}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Email:</span>
            <span className="font-medium">{userData.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Teléfono:</span>
            <span className="font-medium">{userData.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Ingreso Mensual:</span>
            <span className="font-medium">S/. {userData.monthlyIncome}</span>
          </div>
        </CardContent>
      </Card>

      {/* Document Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Estado de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm font-medium">{doc.name}</span>
                {doc.required && <span className="text-red-500 ml-1">*</span>}
              </div>
              <div className="flex items-center">
                {getStatusIcon(documentStatus[doc.key as keyof DocumentStatus])}
                <span className="ml-2 text-sm font-medium">
                  {getStatusText(documentStatus[doc.key as keyof DocumentStatus])}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Credit Score Simulation */}
      {overallStatus === 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-800">Tu Perfil Crediticio</CardTitle>
            <CardDescription>
              Basado en la información proporcionada, este es tu perfil estimado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <h3 className="font-semibold text-emerald-800 mb-2">Score Crediticio Estimado</h3>
                <p className="text-2xl font-bold text-emerald-600">720/850</p>
                <p className="text-sm text-emerald-700">Calificación: Buena</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Capacidad de Endeudamiento</h3>
                <p className="text-2xl font-bold text-blue-600">S/. {(parseInt(userData.monthlyIncome) * 0.3).toLocaleString()}</p>
                <p className="text-sm text-blue-700">Cuota mensual máxima</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-emerald-800 mb-2">Productos Recomendados</h3>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="p-3 bg-white border border-emerald-200 rounded-lg text-center">
                  <span className="text-sm font-medium">Crédito Personal</span>
                  <p className="text-xs text-gray-600">Hasta S/. 30,000</p>
                </div>
                <div className="p-3 bg-white border border-emerald-200 rounded-lg text-center">
                  <span className="text-sm font-medium">Tarjeta de Crédito</span>
                  <p className="text-xs text-gray-600">Línea S/. 8,000</p>
                </div>
                <div className="p-3 bg-white border border-emerald-200 rounded-lg text-center">
                  <span className="text-sm font-medium">Depósito a Plazo</span>
                  <p className="text-xs text-gray-600">Tasa preferencial</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Volver a Documentos
        </Button>
        {overallStatus === 'completed' && (
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            Explorar Productos
          </Button>
        )}
      </div>
    </div>
  );
};
