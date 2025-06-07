import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Sparkles, Zap, FileText, User, Brain, AlertTriangle } from "lucide-react";
import { DynamicOnboarding } from "./DynamicOnboarding";
import { VerificationStatus } from "./VerificationStatus";
import { IntelligentSystem } from "./IntelligentSystem";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentAnalyzer, DocumentAnalysis, UserProfile } from "@/services/documentAnalyzer";
import { userTrackingService } from "@/services/userTracking";

interface UserOnboardingProps {
  onBack: () => void;
}

interface UserData {
  dni: string;
  email: string;
  phone: string;
  monthlyIncome: string;
}

export const UserOnboarding = ({ onBack }: UserOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserData>({
    dni: '',
    email: '',
    phone: '',
    monthlyIncome: ''
  });
  const [documents, setDocuments] = useState<{ [key: string]: DocumentAnalysis }>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [onboardingType, setOnboardingType] = useState<'select' | 'dynamic' | 'traditional'>('select');
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    // Trackear visita a onboarding
    userTrackingService.trackActivity('page_visit', { page: 'onboarding' });
  }, []);

  const startSession = () => {
    if (userData.email && !sessionStarted) {
      userTrackingService.startSession(userData.email);
      setSessionStarted(true);
    }
  };

  const steps = [
    { id: 1, title: 'Información Personal', icon: User },
    { id: 2, title: 'Documentos', icon: FileText },
    { id: 3, title: 'Sistema Inteligente', icon: Brain }
  ];

  const documentTypes = [
    {
      key: 'dni',
      title: 'Documento Nacional de Identidad',
      description: 'Sube tu DNI vigente (ambas caras si es posible)',
      required: true
    },
    {
      key: 'boleta-pago',
      title: 'Últimas 2 Boletas de Pago',
      description: 'Sube tus 2 últimas boletas de pago en PDF o imagen',
      required: true
    },
    {
      key: 'certificado-trabajo',
      title: 'Certificado de Trabajo',
      description: 'Certificado vigente de tu empleador actual',
      required: true
    },
    {
      key: 'reporte-crediticio',
      title: 'Reporte Crediticio',
      description: 'Reporte actualizado de Equifax, Sentinel u otra central',
      required: true
    }
  ];

  const handleUserDataChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    
    // Iniciar sesión cuando se ingrese el email
    if (field === 'email' && value && !sessionStarted) {
      setTimeout(startSession, 500);
    }
  };

  const handleDocumentUpload = (documentKey: string, file: File, analysis: DocumentAnalysis, fileId: string) => {
    setDocuments(prev => ({ ...prev, [documentKey]: analysis }));
    
    // Trackear subida de documento
    userTrackingService.trackActivity('file_upload', { 
      documentType: documentKey, 
      fileName: file.name,
      fileId 
    });
  };

  const processToIntelligentSystem = () => {
    // Extraer perfil del usuario basado en documentos
    const extractedProfile = DocumentAnalyzer.extractUserProfile(documents);
    
    // Combinar con datos manuales
    const completeProfile: UserProfile = {
      personalInfo: {
        ...extractedProfile.personalInfo,
        email: userData.email,
        phone: userData.phone,
        dni: userData.dni || extractedProfile.personalInfo?.dni || '',
        name: extractedProfile.personalInfo?.name || '',
        age: extractedProfile.personalInfo?.age || 0
      },
      employment: extractedProfile.employment || {
        type: 'dependiente',
        monthlyIncome: Number(userData.monthlyIncome) || 0,
        workTime: 0
      },
      credit: extractedProfile.credit || {
        score: 300,
        debtToIncome: 0,
        hasNegativeHistory: false,
        infoCorpStatus: 'normal'
      },
      documents,
      qualityScore: extractedProfile.qualityScore || 0
    };

    // Actualizar perfil en tracking
    userTrackingService.updateUserProfile(userData.email, {
      firstName: extractedProfile.personalInfo?.name?.split(' ')[0],
      lastName: extractedProfile.personalInfo?.name?.split(' ').slice(1).join(' '),
      dni: userData.dni,
      phone: userData.phone,
      monthlyIncome: Number(userData.monthlyIncome)
    });

    setUserProfile(completeProfile);
    setCurrentStep(3);
    
    // Trackear progreso
    userTrackingService.trackActivity('form_submit', { step: 'documents_complete' });
  };

  const canProceedToStep2 = userData.dni && userData.email && userData.phone && userData.monthlyIncome;
  const canProceedToStep3 = documentTypes.filter(doc => doc.required).every(
    doc => documents[doc.key]?.isValid
  );

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  if (onboardingType === 'dynamic') {
    return <DynamicOnboarding onBack={() => setOnboardingType('select')} />;
  }

  if (onboardingType === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 to-neza-cyan-100">
        {/* Mensaje obligatorio */}
        <div className="bg-neza-blue-600 text-white py-3 px-4">
          <div className="container mx-auto flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-neza-cyan-200" />
            <p className="text-center font-medium">
              Por favor, no nos mientas. Esta información es clave para brindarte los mejores productos.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={onBack} className="mr-4 text-neza-blue-600 hover:bg-neza-blue-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-neza-blue-800">NEZA</h1>
              <p className="text-neza-blue-600">Tu neobanco inteligente</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-neza-blue-800 mb-4">
                ¿Cómo prefieres registrarte?
              </h2>
              <p className="text-xl text-neza-silver-600">
                Elige la experiencia que más te guste
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Opción Dinámica */}
              <Card 
                className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-neza-blue-200"
                onClick={() => {
                  userTrackingService.trackActivity('button_click', { button: 'dynamic_onboarding' });
                  setOnboardingType('dynamic');
                }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-neza-blue-500 to-neza-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-neza-blue-800 flex items-center justify-center gap-2">
                    Experiencia Interactiva
                    <span className="text-sm bg-neza-blue-100 text-neza-blue-600 px-2 py-1 rounded-full">NUEVO</span>
                  </CardTitle>
                  <CardDescription className="text-lg text-neza-silver-600">
                    Registro paso a paso, dinámico y conversacional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-neza-silver-600 mb-6">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-neza-blue-500" />
                      <span>Experiencia tipo Duolingo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-neza-blue-500" />
                      <span>Validación en tiempo real</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-neza-blue-500" />
                      <span>Guardado automático</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-neza-blue-500" />
                      <span>Animaciones y feedback</span>
                    </div>
                  </div>
                  <Button className="w-full bg-neza-blue-600 hover:bg-neza-blue-700 text-lg py-6">
                    ¡Comenzar experiencia! ✨
                  </Button>
                </CardContent>
              </Card>

              {/* Opción Tradicional */}
              <Card 
                className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-neza-silver-200"
                onClick={() => {
                  userTrackingService.trackActivity('button_click', { button: 'traditional_onboarding' });
                  setOnboardingType('traditional');
                }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-neza-silver-500 to-neza-silver-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-neza-blue-800">
                    Registro Completo
                  </CardTitle>
                  <CardDescription className="text-lg text-neza-silver-600">
                    Formulario tradicional con análisis de documentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-neza-silver-600 mb-6">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neza-silver-500" />
                      <span>Subida de documentos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neza-silver-500" />
                      <span>Análisis con OCR</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neza-silver-500" />
                      <span>Sistema inteligente SBS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neza-silver-500" />
                      <span>Validación completa</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full text-lg py-6 border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50">
                    Registro tradicional
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 3 && userProfile) {
    return <IntelligentSystem userProfile={userProfile} onBack={() => setCurrentStep(2)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 to-neza-cyan-100">
      {/* Mensaje obligatorio */}
      <div className="bg-neza-blue-600 text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-neza-cyan-200" />
          <p className="text-center font-medium">
            Por favor, no nos mientas. Esta información es clave para brindarte los mejores productos.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mr-4 text-neza-blue-600 hover:bg-neza-blue-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neza-blue-800">Onboarding Financiero Inteligente</h1>
            <p className="text-neza-blue-600">Sistema validado con entidades supervisadas por la SBS</p>
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
                    ${status === 'completed' ? 'bg-neza-blue-500 border-neza-blue-500 text-white' : ''}
                    ${status === 'current' ? 'border-neza-blue-500 text-neza-blue-500' : ''}
                    ${status === 'pending' ? 'border-neza-silver-300 text-neza-silver-400' : ''}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    status === 'current' ? 'text-neza-blue-600' : 'text-neza-silver-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      status === 'completed' ? 'bg-neza-blue-500' : 'bg-neza-silver-300'
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
            <Card className="border-neza-blue-200">
              <CardHeader>
                <CardTitle className="text-neza-blue-800">Información Personal</CardTitle>
                <CardDescription className="text-neza-silver-600">
                  Ingresa tus datos básicos para el análisis financiero
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
                  className="w-full bg-neza-blue-600 hover:bg-neza-blue-700" 
                  onClick={() => {
                    userTrackingService.trackActivity('form_submit', { step: 'personal_info' });
                    setCurrentStep(2);
                  }}
                  disabled={!canProceedToStep2}
                >
                  Continuar con Documentos
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Card className="border-neza-blue-200">
                <CardHeader>
                  <CardTitle className="text-neza-blue-800">Análisis Inteligente de Documentos</CardTitle>
                  <CardDescription className="text-neza-silver-600">
                    Sube tus documentos para análisis automático con OCR y validación SBS
                  </CardDescription>
                </CardHeader>
              </Card>

              {documentTypes.map((document) => (
                <DocumentUpload
                  key={document.key}
                  title={document.title}
                  description={document.description}
                  required={document.required}
                  documentType={document.key}
                  status={
                    documents[document.key]?.isValid ? 'verified' :
                    documents[document.key] ? 'rejected' : 'pending'
                  }
                  onUpload={(file, analysis, fileId) => handleDocumentUpload(document.key, file, analysis, fileId)}
                />
              ))}

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50"
                >
                  Volver
                </Button>
                <Button 
                  className="flex-1 bg-neza-blue-600 hover:bg-neza-blue-700" 
                  onClick={processToIntelligentSystem}
                  disabled={!canProceedToStep3}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Activar Sistema Inteligente
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
