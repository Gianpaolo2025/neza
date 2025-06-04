
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, CheckCircle, AlertCircle, FileText, User } from "lucide-react";
import { DocumentUpload } from "./DocumentUpload";
import { VerificationStatus } from "./VerificationStatus";

interface UserOnboardingProps {
  onBack: () => void;
}

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

export const UserOnboarding = ({ onBack }: UserOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    dni: '',
    email: '',
    phone: '',
    monthlyIncome: ''
  });
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
    payslips: 'pending',
    workCertificate: 'pending',
    creditReport: 'pending',
    incomeProof: 'pending'
  });

  const steps = [
    { id: 1, title: 'Información Personal', icon: User },
    { id: 2, title: 'Documentos', icon: FileText },
    { id: 3, title: 'Verificación', icon: CheckCircle }
  ];

  const documents = [
    {
      key: 'payslips' as keyof DocumentStatus,
      title: 'Últimas 2 Boletas de Pago',
      description: 'Sube tus 2 últimas boletas de pago en PDF o imagen',
      required: true
    },
    {
      key: 'workCertificate' as keyof DocumentStatus,
      title: 'Certificado de Trabajo',
      description: 'Certificado vigente de tu empleador actual',
      required: true
    },
    {
      key: 'creditReport' as keyof DocumentStatus,
      title: 'Reporte Crediticio',
      description: 'Reporte actualizado de Equifax, Sentinel u otra central',
      required: true
    },
    {
      key: 'incomeProof' as keyof DocumentStatus,
      title: 'Constancia de Ingresos',
      description: 'Para freelancers o trabajadores independientes',
      required: false
    }
  ];

  const handleUserDataChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentUpload = (documentKey: keyof DocumentStatus, file: File) => {
    // Simular procesamiento de documento
    setDocumentStatus(prev => ({ ...prev, [documentKey]: 'uploaded' }));
    
    // Simular verificación después de 2 segundos
    setTimeout(() => {
      const isValid = Math.random() > 0.3; // 70% probabilidad de éxito
      setDocumentStatus(prev => ({ 
        ...prev, 
        [documentKey]: isValid ? 'verified' : 'rejected' 
      }));
    }, 2000);
  };

  const canProceedToStep2 = userData.dni && userData.email && userData.phone && userData.monthlyIncome;
  const canProceedToStep3 = documents.filter(doc => doc.required).every(
    doc => documentStatus[doc.key] === 'verified'
  );

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

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
            <h1 className="text-2xl font-bold text-emerald-800">Onboarding Financiero</h1>
            <p className="text-emerald-600">Completa tu validación para acceder a todos los productos</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const status = getStepStatus(step.id);
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : ''}
                    ${status === 'current' ? 'border-emerald-500 text-emerald-500' : ''}
                    ${status === 'pending' ? 'border-gray-300 text-gray-400' : ''}
                  `}>
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    status === 'current' ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      status === 'completed' ? 'bg-emerald-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-emerald-800">Información Personal</CardTitle>
                <CardDescription>
                  Ingresa tus datos básicos para comenzar el proceso de validación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dni">DNI o Documento de Identidad</Label>
                  <Input
                    id="dni"
                    value={userData.dni}
                    onChange={(e) => handleUserDataChange('dni', e.target.value)}
                    placeholder="12345678"
                    maxLength={8}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleUserDataChange('email', e.target.value)}
                    placeholder="usuario@email.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Número de Celular</Label>
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => handleUserDataChange('phone', e.target.value)}
                    placeholder="987654321"
                    maxLength={9}
                  />
                </div>
                
                <div>
                  <Label htmlFor="income">Ingreso Mensual Estimado (S/.)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={userData.monthlyIncome}
                    onChange={(e) => handleUserDataChange('monthlyIncome', e.target.value)}
                    placeholder="3000"
                  />
                </div>

                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700" 
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToStep2}
                >
                  Continuar con Documentos
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-emerald-800">Carga de Documentos</CardTitle>
                  <CardDescription>
                    Sube los documentos requeridos para validar tu información
                  </CardDescription>
                </CardHeader>
              </Card>

              {documents.map((document) => (
                <DocumentUpload
                  key={document.key}
                  title={document.title}
                  description={document.description}
                  required={document.required}
                  status={documentStatus[document.key]}
                  onUpload={(file) => handleDocumentUpload(document.key, file)}
                />
              ))}

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700" 
                  onClick={() => setCurrentStep(3)}
                  disabled={!canProceedToStep3}
                >
                  Ver Estado de Verificación
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <VerificationStatus 
              userData={userData}
              documentStatus={documentStatus}
              onBack={() => setCurrentStep(2)}
            />
          )}
        </div>
      </div>
    </div>
  );
};
