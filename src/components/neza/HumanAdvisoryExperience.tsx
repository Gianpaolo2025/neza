
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { DocumentUpload } from "./DocumentUpload";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, User, CreditCard, FileText, Target, Briefcase, DollarSign, Calendar, Building } from "lucide-react";
import { userTrackingService } from "@/services/userTracking";

interface HumanAdvisoryExperienceProps {
  onBack: () => void;
  onComplete: (data: any) => void;
  forceFlow?: boolean;
}

export const HumanAdvisoryExperience = ({ onBack, onComplete, forceFlow = false }: HumanAdvisoryExperienceProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  const [formData, setFormData] = useState({
    goal: '',
    amount: 0,
    monthlyIncome: 0,
    workSituation: '',
    workDetails: '',
    hasPayslips: '',
    preferredBank: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      dni: '',
      email: '',
      phone: '',
      birthDate: ''
    },
    documents: {
      dni: null as File | null,
      payslips: null as File | null,
      others: null as File | null
    }
  });

  const formRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when step changes
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentStep]);

  const stepIcons = [
    Target, DollarSign, CreditCard, Briefcase, 
    User, Calendar, Building, FileText
  ];

  const progress = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      userTrackingService.trackActivity(
        'form_step_complete',
        { step: currentStep, formData: getCurrentStepData() },
        `Usuario completó paso ${currentStep} del onboarding`
      );
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      userTrackingService.trackActivity(
        'form_step_back',
        { step: currentStep },
        `Usuario regresó del paso ${currentStep} al paso ${currentStep - 1}`
      );
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrentStepData = () => {
    switch (currentStep) {
      case 1: return { goal: formData.goal };
      case 2: return { amount: formData.amount };
      case 3: return { monthlyIncome: formData.monthlyIncome };
      case 4: return { workSituation: formData.workSituation, workDetails: formData.workDetails };
      case 5: return { personalInfo: formData.personalInfo };
      case 6: return { hasPayslips: formData.hasPayslips };
      case 7: return { preferredBank: formData.preferredBank };
      case 8: return { documents: formData.documents };
      default: return {};
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.goal !== '';
      case 2: return formData.amount > 0;
      case 3: return formData.monthlyIncome > 0;
      case 4: return formData.workSituation !== '' && formData.workDetails.trim() !== '';
      case 5: return formData.personalInfo.firstName && formData.personalInfo.lastName && 
                     formData.personalInfo.dni && formData.personalInfo.email && formData.personalInfo.phone;
      case 6: return formData.hasPayslips !== '';
      case 7: return formData.preferredBank !== '';
      case 8: return true; // Documents are optional
      default: return false;
    }
  };

  const handleComplete = () => {
    userTrackingService.trackActivity(
      'form_complete',
      formData,
      'Usuario completó todo el formulario de onboarding'
    );
    onComplete(formData);
  };

  const handleDocumentUpload = (type: 'dni' | 'payslips' | 'others', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: file
      }
    }));
  };

  const renderStepContent = () => {
    const StepIcon = stepIcons[currentStep - 1];
    
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6" ref={formRef}>
            <div className="text-center">
              <div className="md:w-16 md:h-16 w-12 h-12 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StepIcon className="md:w-8 md:h-8 w-6 h-6 text-neza-blue-600" />
              </div>
              <h3 className="md:text-2xl text-xl font-bold text-neza-blue-800 mb-2">¿Qué producto financiero necesitas?</h3>
              <p className="text-neza-silver-600 md:text-base text-sm">Selecciona el producto que mejor se adapte a tus necesidades</p>
            </div>
            
            <RadioGroup 
              value={formData.goal} 
              onValueChange={(value) => setFormData({...formData, goal: value})}
              className="space-y-3"
            >
              {[
                { value: 'prestamo-personal', label: '💰 Préstamo Personal', desc: 'Para gastos personales, viajes, compras' },
                { value: 'tarjeta-credito', label: '💳 Tarjeta de Crédito', desc: 'Para compras y pagos flexibles' },
                { value: 'prestamo-vehicular', label: '🚗 Préstamo Vehicular', desc: 'Para comprar auto, moto o vehículo' },
                { value: 'prestamo-hipotecario', label: '🏠 Préstamo Hipotecario', desc: 'Para comprar casa o departamento' }
              ].map(option => (
                <div key={option.value} className="flex items-center space-x-3 p-4 border border-neza-blue-200 rounded-lg hover:bg-neza-blue-50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <Label htmlFor={option.value} className="font-medium md:text-base text-sm">{option.label}</Label>
                    <p className="md:text-sm text-xs text-neza-silver-600">{option.desc}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6" ref={formRef}>
            <div className="text-center">
              <div className="md:w-16 md:h-16 w-12 h-12 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StepIcon className="md:w-8 md:h-8 w-6 h-6 text-neza-blue-600" />
              </div>
              <h3 className="md:text-2xl text-xl font-bold text-neza-blue-800 mb-2">¿Cuánto dinero necesitas?</h3>
              <p className="text-neza-silver-600 md:text-base text-sm">Ingresa el monto que necesitas para tu {formData.goal}</p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="amount" className="md:text-base text-sm font-medium">Monto solicitado (S/)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Ejemplo: 10000"
                value={formData.amount || ''}
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                className="md:text-lg text-base md:h-12 h-10"
              />
              {formData.amount > 0 && (
                <p className="md:text-sm text-xs text-neza-blue-600">
                  Monto: S/ {formData.amount.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6" ref={formRef}>
            <div className="text-center">
              <div className="md:w-16 md:h-16 w-12 h-12 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StepIcon className="md:w-8 md:h-8 w-6 h-6 text-neza-blue-600" />
              </div>
              <h3 className="md:text-2xl text-xl font-bold text-neza-blue-800 mb-2">¿Cuáles son tus ingresos mensuales?</h3>
              <p className="text-neza-silver-600 md:text-base text-sm">Ingresa tus ingresos promedio mensuales netos</p>
            </div>
            
            <div className="space-y-4">
              <Label htmlFor="income" className="md:text-base text-sm font-medium">Ingresos mensuales netos (S/)</Label>
              <Input
                id="income"
                type="number"
                placeholder="Ejemplo: 3000"
                value={formData.monthlyIncome || ''}
                onChange={(e) => setFormData({...formData, monthlyIncome: Number(e.target.value)})}
                className="md:text-lg text-base md:h-12 h-10"
              />
              {formData.monthlyIncome > 0 && (
                <p className="md:text-sm text-xs text-neza-blue-600">
                  Ingresos: S/ {formData.monthlyIncome.toLocaleString()} mensuales
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6" ref={formRef}>
            <div className="text-center">
              <div className="md:w-16 md:h-16 w-12 h-12 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StepIcon className="md:w-8 md:h-8 w-6 h-6 text-neza-blue-600" />
              </div>
              <h3 className="md:text-2xl text-xl font-bold text-neza-blue-800 mb-2">¿Cuál es tu situación laboral?</h3>
              <p className="text-neza-silver-600 md:text-base text-sm">Cuéntanos sobre tu trabajo actual</p>
            </div>
            
            <div className="space-y-4">
              <RadioGroup 
                value={formData.workSituation} 
                onValueChange={(value) => setFormData({...formData, workSituation: value})}
                className="space-y-2"
              >
                {[
                  { value: 'empleado', label: '👔 Empleado (dependiente)' },
                  { value: 'independiente', label: '💼 Trabajador independiente' },
                  { value: 'empresario', label: '🏢 Empresario/Dueño de negocio' },
                  { value: 'estudiante', label: '🎓 Estudiante con ingresos' }
                ].map(option => (
                  <div key={option.value} className="flex items-center space-x-3 p-3 border border-neza-blue-200 rounded-lg hover:bg-neza-blue-50">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="md:text-base text-sm">{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="space-y-2">
                <Label htmlFor="workDetails" className="md:text-base text-sm font-medium">Detalles del trabajo</Label>
                <Input
                  id="workDetails"
                  placeholder="Ejemplo: Trabajo en empresa X como analista, 2 años de experiencia"
                  value={formData.workDetails}
                  onChange={(e) => setFormData({...formData, workDetails: e.target.value})}
                  className="md:text-base text-sm md:h-10 h-9"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6" ref={formRef}>
            <div className="text-center">
              <div className="md:w-16 md:h-16 w-12 h-12 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StepIcon className="md:w-8 md:h-8 w-6 h-6 text-neza-blue-600" />
              </div>
              <h3 className="md:text-2xl text-xl font-bold text-neza-blue-800 mb-2">Información Personal</h3>
              <p className="text-neza-silver-600 md:text-base text-sm">Completa tus datos personales</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="md:text-base text-sm">Nombres</Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: {...formData.personalInfo, firstName: e.target.value}
                  })}
                  className="md:text-base text-sm md:h-10 h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="md:text-base text-sm">Apellidos</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: {...formData.personalInfo, lastName: e.target.value}
                  })}
                  className="md:text-base text-sm md:h-10 h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dni" className="md:text-base text-sm">DNI</Label>
                <Input
                  id="dni"
                  value={formData.personalInfo.dni}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: {...formData.personalInfo, dni: e.target.value}
                  })}
                  className="md:text-base text-sm md:h-10 h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="md:text-base text-sm">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: {...formData.personalInfo, email: e.target.value}
                  })}
                  className="md:text-base text-sm md:h-10 h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="md:text-base text-sm">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.personalInfo.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: {...formData.personalInfo, phone: e.target.value}
                  })}
                  className="md:text-base text-sm md:h-10 h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate" className="md:text-base text-sm">Fecha de nacimiento (opcional)</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.personalInfo.birthDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    personalInfo: {...formData.personalInfo, birthDate: e.target.value}
                  })}
                  className="md:text-base text-sm md:h-10 h-9"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6" ref={formRef}>
            <div className="text-center">
              <div className="md:w-16 md:h-16 w-12 h-12 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StepIcon className="md:w-8 md:h-8 w-6 h-6 text-neza-blue-600" />
              </div>
              <h3 className="md:text-2xl text-xl font-bold text-neza-blue-800 mb-2">¿Tienes boletas de pago?</h3>
              <p className="text-neza-silver-600 md:text-base text-sm">Esto nos ayuda a evaluar mejor tu capacidad de pago</p>
            </div>
            
            <RadioGroup 
              value={formData.hasPayslips} 
              onValueChange={(value) => setFormData({...formData, hasPayslips: value})}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 border border-neza-blue-200 rounded-lg hover:bg-neza-blue-50">
                <RadioGroupItem value="si" id="payslips-yes" />
                <Label htmlFor="payslips-yes" className="md:text-base text-sm">✅ Sí, tengo boletas de pago recientes</Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border border-neza-blue-200 rounded-lg hover:bg-neza-blue-50">
                <RadioGroupItem value="no" id="payslips-no" />
                <Label htmlFor="payslips-no" className="md:text-base text-sm">❌ No tengo boletas de pago</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6" ref={formRef}>
            <div className="text-center">
              <div className="md:w-16 md:h-16 w-12 h-12 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StepIcon className="md:w-8 md:h-8 w-6 h-6 text-neza-blue-600" />
              </div>
              <h3 className="md:text-2xl text-xl font-bold text-neza-blue-800 mb-2">¿Tienes algún banco de preferencia?</h3>
              <p className="text-neza-silver-600 md:text-base text-sm">Si tienes preferencia, lo consideraremos en la subasta</p>
            </div>
            
            <RadioGroup 
              value={formData.preferredBank} 
              onValueChange={(value) => setFormData({...formData, preferredBank: value})}
              className="space-y-3"
            >
              {[
                { value: 'ninguno', label: '🎯 Sin preferencia (mejor oferta gana)' },
                { value: 'bcp', label: '🏦 Banco de Crédito del Perú (BCP)' },
                { value: 'bbva', label: '🏦 BBVA' },
                { value: 'interbank', label: '🏦 Interbank' },
                { value: 'scotiabank', label: '🏦 Scotiabank' },
                { value: 'otros', label: '🏦 Otro banco' }
              ].map(option => (
                <div key={option.value} className="flex items-center space-x-3 p-3 border border-neza-blue-200 rounded-lg hover:bg-neza-blue-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="md:text-base text-sm">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6" ref={formRef}>
            <div className="text-center">
              <div className="md:w-16 md:h-16 w-12 h-12 bg-neza-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StepIcon className="md:w-8 md:h-8 w-6 h-6 text-neza-blue-600" />
              </div>
              <h3 className="md:text-2xl text-xl font-bold text-neza-blue-800 mb-2">Documentos (Opcional)</h3>
              <p className="text-neza-silver-600 md:text-base text-sm">Sube tus documentos para mejorar tu evaluación</p>
            </div>
            
            <div className="space-y-6">
              <DocumentUpload
                label="📄 Copia de DNI"
                description="Foto clara de tu DNI por ambos lados"
                onFileUpload={(file) => handleDocumentUpload('dni', file)}
                acceptedTypes=".jpg,.jpeg,.png,.pdf"
              />
              
              {formData.hasPayslips === 'si' && (
                <DocumentUpload
                  label="💰 Boletas de pago"
                  description="Últimas 3 boletas de pago"
                  onFileUpload={(file) => handleDocumentUpload('payslips', file)}
                  acceptedTypes=".jpg,.jpeg,.png,.pdf"
                />
              )}
              
              <DocumentUpload
                label="📋 Otros documentos"
                description="Cualquier documento adicional que consideres relevante"
                onFileUpload={(file) => handleDocumentUpload('others', file)}
                acceptedTypes=".jpg,.jpeg,.png,.pdf"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 via-white to-neza-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with mobile optimization */}
        <div className="text-center mb-8">
          <h1 className="md:text-4xl text-2xl font-bold text-neza-blue-800 mb-2">
            Proceso de Solicitud
          </h1>
          <p className="text-neza-silver-600 md:text-lg text-base">
            Paso {currentStep} de {totalSteps}
          </p>
        </div>

        {/* Warning message - Mobile optimized */}
        {!forceFlow && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg md:p-4 p-3 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="md:w-5 md:h-5 w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 md:text-base text-sm">⚠️ Importante: Información veraz</h4>
                <p className="text-amber-700 md:text-sm text-xs mt-1 leading-relaxed">
                  Este formulario no debe contener información falsa. La veracidad de tus datos es fundamental 
                  para encontrar las mejores opciones financieras reales para tu perfil.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar - Mobile optimized */}
        <div className="mb-8">
          <div className="flex justify-between md:text-sm text-xs text-neza-blue-600 mb-2">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="md:h-3 h-2" />
        </div>

        {/* Main content card - Mobile optimized */}
        <Card className="border-neza-blue-200 mb-6">
          <CardContent className="md:p-8 p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation buttons - Mobile optimized */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onBack : prevStep}
            className="border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50 md:px-6 px-4 md:py-2 py-2 md:text-base text-sm"
          >
            <ArrowLeft className="md:w-4 md:h-4 w-3 h-3 mr-2" />
            {currentStep === 1 ? 'Volver' : 'Anterior'}
          </Button>

          {currentStep === totalSteps ? (
            <Button
              onClick={handleComplete}
              disabled={!isStepValid()}
              className="bg-neza-blue-600 hover:bg-neza-blue-700 md:px-8 px-6 md:py-2 py-2 md:text-base text-sm"
            >
              <CheckCircle className="md:w-4 md:h-4 w-3 h-3 mr-2" />
              Finalizar
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="bg-neza-blue-600 hover:bg-neza-blue-700 md:px-6 px-4 md:py-2 py-2 md:text-base text-sm"
            >
              Siguiente
              <ArrowRight className="md:w-4 md:h-4 w-3 h-3 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
