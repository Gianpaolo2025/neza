import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DocumentUpload } from "./DocumentUpload";
import { Progress } from "@/components/ui/progress";
import { CircleCheck, ShieldCheck, User2, Briefcase, PiggyBank, FileText } from "lucide-react";
import { CompletionAnimation } from "./CompletionAnimation";
import { UserData } from "@/types/user";

interface HumanAdvisoryExperienceProps {
  onBack: () => void;
  onComplete: (data: UserData) => void;
  forceFlow?: boolean;
}

export const HumanAdvisoryExperience = ({ onBack, onComplete, forceFlow = false }: HumanAdvisoryExperienceProps) => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'personal' | 'work' | 'goal' | 'documents' | 'summary'>('welcome');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
  });
  const [workDetails, setWorkDetails] = useState({
    workSituation: '',
    companyName: '',
    jobTitle: '',
    seniority: '',
  });
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [amount, setAmount] = useState(5000);
  const [goal, setGoal] = useState('');
  const [hasPayslips, setHasPayslips] = useState('si');
  const [preferredBank, setPreferredBank] = useState('');
  const [documents, setDocuments] = useState<{ [key: string]: any }>({});

  const documentTypes = [
    {
      type: 'dni',
      title: 'Documento de Identidad',
      description: 'DNI vigente (ambas caras)',
      required: true
    },
    {
      type: 'income-proof',
      title: 'Comprobante de Ingresos',
      description: 'Boletas de pago, recibos por honorarios o declaración jurada',
      required: true
    },
    {
      type: 'work-certificate',
      title: 'Certificado de Trabajo',
      description: 'Constancia laboral o carta de trabajo',
      required: false
    },
    {
      type: 'bank-statements',
      title: 'Estados de Cuenta',
      description: 'Últimos 3 meses de movimientos bancarios',
      required: false
    }
  ];

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleWorkDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setWorkDetails({ ...workDetails, [e.target.name]: e.target.value });
  };

  const canProceedFromPersonalStep = () => {
    // Allow proceeding even with incomplete data
    return true;
  };

  const canProceedFromWorkStep = () => {
    // Allow proceeding even with incomplete data
    return true;
  };

  const canProceedFromGoalStep = () => {
    // Allow proceeding even with incomplete data
    return true;
  };

  const canProceedFromDocuments = () => {
    // Always allow proceeding from documents step - no longer required
    return true;
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 'welcome':
        return true;
      case 'personal':
        return canProceedFromPersonalStep();
      case 'work':
        return canProceedFromWorkStep();
      case 'goal':
        return canProceedFromGoalStep();
      case 'documents':
        return canProceedFromDocuments();
      case 'summary':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNext()) {
      setCompletedSteps(prev => [...prev, currentStep]);
      switch (currentStep) {
        case 'welcome':
          setCurrentStep('personal');
          break;
        case 'personal':
          setCurrentStep('work');
          break;
        case 'work':
          setCurrentStep('goal');
          break;
        case 'goal':
          setCurrentStep('documents');
          break;
        case 'documents':
          setCurrentStep('summary');
          break;
        case 'summary':
          setShowCompletion(true);
          break;
      }
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  };

  const handleBack = () => {
    if (currentStep === 'welcome') {
      onBack();
    } else {
      const steps = ['welcome', 'personal', 'work', 'goal', 'documents', 'summary'];
      const currentIndex = steps.indexOf(currentStep);
      setCurrentStep(steps[currentIndex - 1] as typeof currentStep);
    }
  };

  const handleFinalSubmit = () => {
    onComplete({
      dni: personalInfo.dni,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      email: personalInfo.email,
      phone: personalInfo.phone,
      monthlyIncome,
      requestedAmount: amount,
      employmentType: workDetails.workSituation,
      creditHistory: '',
      productType: goal,
      hasOtherDebts: '',
      bankingRelationship: '',
      urgencyLevel: '',
      preferredBank,
      personalInfo,
      workDetails,
      amount,
      goal,
      hasPayslips,
      documents
    });
  };

  const handleDocumentUpload = (documentType: string, file: File, analysis: any, fileId: string) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: {
        file,
        analysis,
        fileId
      }
    }));
  };

  const getDocumentStatus = (documentType: string): 'pending' | 'uploaded' | 'verified' | 'rejected' => {
    const doc = documents[documentType];
    if (!doc) return 'pending';

    // Simulate verification process
    if (doc.analysis && doc.analysis.confidence > 0.8) {
      return 'verified';
    } else if (doc.analysis && doc.analysis.confidence > 0.5) {
      return 'uploaded';
    } else {
      return 'rejected';
    }
  };

  const ProgressIndicator = ({ currentStep, completedSteps }: { currentStep: string; completedSteps: string[] }) => {
    const steps = [
      { id: 'welcome', label: 'Bienvenida' },
      { id: 'personal', label: 'Datos Personales' },
      { id: 'work', label: 'Datos Laborales' },
      { id: 'goal', label: 'Objetivo' },
      { id: 'documents', label: 'Documentos' },
      { id: 'summary', label: 'Resumen' },
    ];

    return (
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="w-full flex items-center">
              {index > 0 && (
                <div className="flex-auto border-t-2 transition duration-500 ease-in-out"
                  style={{
                    borderColor: completedSteps.includes(steps[index - 1].id) ? '#34D399' : '#E5E7EB',
                  }}
                ></div>
              )}
              <div className="relative">
                <div className={`
                  rounded-full transition duration-500 ease-in-out border-2 h-7 w-7 flex items-center justify-center
                  ${completedSteps.includes(step.id) || currentStep === step.id
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white border-gray-300 text-gray-500'
                  }
                `}>
                  {completedSteps.includes(step.id) ? (
                    <CircleCheck className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex mb-2 items-center justify-between">
          {steps.map(step => (
            <div key={step.id} className="w-1/6 text-center">
              <span className="text-xs font-semibold uppercase">{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWelcomeStep = () => (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neza-blue-800 mb-4">¡Bienvenido a NEZA!</h2>
        <p className="text-neza-silver-600">
          Estamos aquí para ayudarte a encontrar el producto financiero perfecto para ti.
        </p>
      </div>
      <div className="flex justify-center">
        <User2 className="w-20 h-20 text-neza-blue-500" />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-neza-blue-700">¿Qué te ofrecemos?</p>
        <ul className="list-disc list-inside text-neza-silver-700">
          <li>Asesoramiento personalizado</li>
          <li>Comparación de productos de diferentes entidades</li>
          <li>Proceso 100% online y seguro</li>
        </ul>
      </div>
      <Button onClick={handleNext} className="w-full bg-neza-blue-600 hover:bg-neza-blue-700 text-white">
        Comenzar
      </Button>
    </motion.div>
  );

  const renderPersonalStep = () => (
    <motion.div
      key="personal"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neza-blue-800 mb-2">Datos Personales</h2>
        <p className="text-neza-silver-600">
          Necesitamos algunos datos para personalizar tu experiencia.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            value={personalInfo.firstName}
            onChange={handlePersonalInfoChange}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            value={personalInfo.lastName}
            onChange={handlePersonalInfoChange}
          />
        </div>
        <div>
          <Label htmlFor="dni">DNI</Label>
          <Input
            type="number"
            id="dni"
            name="dni"
            placeholder="Sin puntos ni guiones"
            value={personalInfo.dni}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setPersonalInfo({ ...personalInfo, dni: value });
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            placeholder="9 dígitos"
            value={personalInfo.phone}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setPersonalInfo({ ...personalInfo, phone: value });
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={personalInfo.email}
            onChange={handlePersonalInfoChange}
          />
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack} className="border-neza-silver-300 text-neza-silver-700">
          Anterior
        </Button>
        <Button onClick={handleNext} className="bg-neza-blue-600 hover:bg-neza-blue-700 text-white">
          Siguiente
        </Button>
      </div>
    </motion.div>
  );

  const renderWorkStep = () => (
    <motion.div
      key="work"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neza-blue-800 mb-2">Datos Laborales</h2>
        <p className="text-neza-silver-600">
          Cuéntanos sobre tu situación laboral actual.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="workSituation">Situación Laboral</Label>
          <Select onValueChange={(value) => setWorkDetails({ ...workDetails, workSituation: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="empleado">Empleado</SelectItem>
              <SelectItem value="independiente">Independiente</SelectItem>
              <SelectItem value="empresario">Empresario</SelectItem>
              <SelectItem value="estudiante">Estudiante</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {workDetails.workSituation === 'empleado' && (
          <>
            <div>
              <Label htmlFor="companyName">Nombre de la Empresa</Label>
              <Input
                type="text"
                id="companyName"
                name="companyName"
                value={workDetails.companyName}
                onChange={handleWorkDetailsChange}
              />
            </div>
            <div>
              <Label htmlFor="jobTitle">Cargo</Label>
              <Input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={workDetails.jobTitle}
                onChange={handleWorkDetailsChange}
              />
            </div>
            <div>
              <Label htmlFor="seniority">Antigüedad (años)</Label>
              <Input
                type="number"
                id="seniority"
                name="seniority"
                value={workDetails.seniority}
                onChange={handleWorkDetailsChange}
              />
            </div>
          </>
        )}
        <div>
          <Label htmlFor="monthlyIncome">Ingreso Mensual (S/)</Label>
          <Input
            type="number"
            id="monthlyIncome"
            name="monthlyIncome"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack} className="border-neza-silver-300 text-neza-silver-700">
          Anterior
        </Button>
        <Button onClick={handleNext} className="bg-neza-blue-600 hover:bg-neza-blue-700 text-white">
          Siguiente
        </Button>
      </div>
    </motion.div>
  );

  const renderGoalStep = () => (
    <motion.div
      key="goal"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neza-blue-800 mb-2">¿Cuál es tu Objetivo?</h2>
        <p className="text-neza-silver-600">
          Selecciona el producto financiero que estás buscando.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="goal">Producto Financiero</Label>
          <Select onValueChange={setGoal}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="credito-personal">Crédito Personal</SelectItem>
              <SelectItem value="credito-vehicular">Crédito Vehicular</SelectItem>
              <SelectItem value="credito-hipotecario">Crédito Hipotecario</SelectItem>
              <SelectItem value="credito-empresarial">Crédito Empresarial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="amount">Monto Deseado (S/)</Label>
          <Input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div>
          <Label>¿Cuentas con Boletas de Pago?</Label>
          <RadioGroup defaultValue={hasPayslips} className="flex flex-col space-y-1.5" onValueChange={setHasPayslips}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="si" id="payslips-si" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
              <Label htmlFor="payslips-si" className="cursor-pointer peer-data-[state=checked]:text-primary">Sí</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="payslips-no" className="peer h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
              <Label htmlFor="payslips-no" className="cursor-pointer peer-data-[state=checked]:text-primary">No</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="preferredBank">Banco de Preferencia (Opcional)</Label>
          <Select onValueChange={setPreferredBank}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bcp">BCP</SelectItem>
              <SelectItem value="interbank">Interbank</SelectItem>
              <SelectItem value="scotiabank">Scotiabank</SelectItem>
              <SelectItem value="bbva">BBVA</SelectItem>
              <SelectItem value="falabella">Banco Falabella</SelectItem>
              <SelectItem value="ripley">Banco Ripley</SelectItem>
              <SelectItem value="pichincha">Banco Pichincha</SelectItem>
              <SelectItem value="otros">Otros</SelectItem>
              <SelectItem value="ninguno">Ninguno</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack} className="border-neza-silver-300 text-neza-silver-700">
          Anterior
        </Button>
        <Button onClick={handleNext} className="bg-neza-blue-600 hover:bg-neza-blue-700 text-white">
          Siguiente
        </Button>
      </div>
    </motion.div>
  );

  const renderDocumentsStep = () => (
    <motion.div
      key="documents"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neza-blue-800 mb-2">Documentos (Opcional)</h2>
        <p className="text-neza-silver-600">
          Puedes subir tus documentos ahora o hacerlo más tarde en el sistema de subastas para obtener mejores ofertas.
        </p>
      </div>

      <div className="bg-neza-blue-50 border border-neza-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-neza-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-neza-blue-800">Subir documentos mejora tus ofertas</h3>
            <p className="mt-1 text-sm text-neza-blue-700">
              Los documentos verificados te permiten acceder a mejores tasas y condiciones. Puedes continuar sin subirlos y hacerlo después.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {documentTypes.map((docType) => (
          <DocumentUpload
            key={docType.type}
            title={docType.title}
            description={docType.description}
            required={false} // Changed to false
            documentType={docType.type}
            status={getDocumentStatus(docType.type)}
            onUpload={(file, analysis, fileId) => handleDocumentUpload(docType.type, file, analysis, fileId)}
          />
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep('goal')}
          className="border-neza-silver-300 text-neza-silver-700"
        >
          Anterior
        </Button>
        <Button
          onClick={() => setCurrentStep('summary')}
          className="bg-neza-blue-600 hover:bg-neza-blue-700 text-white"
        >
          Continuar al Sistema de Subastas
        </Button>
      </div>
    </motion.div>
  );

  const renderSummaryStep = () => (
    <motion.div
      key="summary"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neza-blue-800 mb-2">Resumen de tu Solicitud</h2>
        <p className="text-neza-silver-600">
          Revisa los datos ingresados antes de continuar.
        </p>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Nombre:</strong> {personalInfo.firstName} {personalInfo.lastName}</p>
              <p><strong>DNI:</strong> {personalInfo.dni}</p>
              <p><strong>Email:</strong> {personalInfo.email}</p>
              <p><strong>Teléfono:</strong> {personalInfo.phone}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Información Laboral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Situación Laboral:</strong> {workDetails.workSituation}</p>
              {workDetails.workSituation === 'empleado' && (
                <>
                  <p><strong>Empresa:</strong> {workDetails.companyName}</p>
                  <p><strong>Cargo:</strong> {workDetails.jobTitle}</p>
                  <p><strong>Antigüedad:</strong> {workDetails.seniority} años</p>
                </>
              )}
              <p><strong>Ingreso Mensual:</strong> S/ {monthlyIncome}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Objetivo Financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Producto:</strong> {goal}</p>
              <p><strong>Monto Deseado:</strong> S/ {amount}</p>
              <p><strong>Boletas de Pago:</strong> {hasPayslips === 'si' ? 'Sí' : 'No'}</p>
              <p><strong>Banco de Preferencia:</strong> {preferredBank || 'Ninguno'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack} className="border-neza-silver-300 text-neza-silver-700">
          Anterior
        </Button>
        <Button onClick={handleNext} className="bg-neza-blue-600 hover:bg-neza-blue-700 text-white">
          Confirmar y Continuar
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neza-blue-50 to-neza-cyan-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {!showCompletion ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <div className="mb-8">
                  <ProgressIndicator 
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {currentStep === 'welcome' && renderWelcomeStep()}
                  {currentStep === 'personal' && renderPersonalStep()}
                  {currentStep === 'work' && renderWorkStep()}
                  {currentStep === 'goal' && renderGoalStep()}
                  {currentStep === 'documents' && renderDocumentsStep()}
                  {currentStep === 'summary' && renderSummaryStep()}
                </AnimatePresence>
              </CardContent>
            </Card>
          ) : (
            <CompletionAnimation onComplete={handleFinalSubmit} />
          )}
        </div>
      </div>
    </div>
  );
};
