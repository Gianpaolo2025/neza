
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Home, Car, CreditCard, Heart, Target, Play, Building2, FileText, Users, Briefcase, AlertCircle, Upload, Eye, EyeOff, GraduationCap, Factory, Stethoscope, Calculator, Gavel } from "lucide-react";

interface UserData {
  goal: string;
  amount: number;
  workSituation: string;
  workDetails: string;
  hasPayslips: string;
  monthlyIncome: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    phone: string;
    birthDate: string;
  };
  preferredBank: string;
  documents: {
    dni: File | null;
    payslips: File | null;
    others: File | null;
  };
  // New fields for expanded work information
  carrera?: string;
  ciclo?: string;
  hacePracticas?: string;
  empresaPracticas?: string;
  empresaTrabajo?: string;
  nombreNegocio?: string;
  rubroNegocio?: string;
  actividadPrincipal?: string;
  trabajoEnPlanilla?: string;
  otroTrabajo?: string;
}

interface HumanAdvisoryExperienceProps {
  onBack: () => void;
  onComplete: (data: UserData) => void;
  forceFlow?: boolean;
}

export const HumanAdvisoryExperience = ({ onBack, onComplete, forceFlow = false }: HumanAdvisoryExperienceProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [uploadedPayslips, setUploadedPayslips] = useState<File[]>([]);
  
  const [data, setData] = useState<UserData>({
    goal: "",
    amount: 0,
    workSituation: "",
    workDetails: "",
    hasPayslips: "",
    monthlyIncome: 0,
    personalInfo: {
      firstName: "",
      lastName: "",
      dni: "",
      email: "",
      phone: "",
      birthDate: ""
    },
    preferredBank: "",
    documents: {
      dni: null,
      payslips: null,
      others: null
    }
  });

  // Load previous data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('nezaUserData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.personalInfo && 
            (parsedData.personalInfo.dni || parsedData.personalInfo.firstName || 
             parsedData.personalInfo.lastName || parsedData.personalInfo.email)) {
          setData(prev => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              ...parsedData.personalInfo
            },
            // Restore other saved data
            goal: parsedData.goal || prev.goal,
            amount: parsedData.amount || prev.amount,
            workSituation: parsedData.workSituation || prev.workSituation,
            monthlyIncome: parsedData.monthlyIncome || prev.monthlyIncome,
            hasPayslips: parsedData.hasPayslips || prev.hasPayslips,
            carrera: parsedData.carrera || prev.carrera,
            ciclo: parsedData.ciclo || prev.ciclo,
            hacePracticas: parsedData.hacePracticas || prev.hacePracticas,
            empresaPracticas: parsedData.empresaPracticas || prev.empresaPracticas,
            empresaTrabajo: parsedData.empresaTrabajo || prev.empresaTrabajo,
            nombreNegocio: parsedData.nombreNegocio || prev.nombreNegocio,
            rubroNegocio: parsedData.rubroNegocio || prev.rubroNegocio,
            actividadPrincipal: parsedData.actividadPrincipal || prev.actividadPrincipal,
            trabajoEnPlanilla: parsedData.trabajoEnPlanilla || prev.trabajoEnPlanilla,
            otroTrabajo: parsedData.otroTrabajo || prev.otroTrabajo
          }));
        }
      } catch (error) {
        console.log('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    if (data.personalInfo.dni || data.personalInfo.firstName || data.personalInfo.email) {
      localStorage.setItem('nezaUserData', JSON.stringify(data));
    }
  }, [data]);

  const steps = [
    {
      id: "intro",
      title: forceFlow ? "Completa tu solicitud" : "Hola, empecemos por conocerte",
      subtitle: forceFlow ? "Para solicitar este producto, necesitamos conocer tu perfil financiero" : "Te voy a hacer unas preguntas sencillas para entender qué necesitas"
    },
    {
      id: "personal",
      title: "Datos personales",
      subtitle: "Necesitamos verificar tu identidad"
    },
    {
      id: "goal",
      title: "¿Qué quieres lograr? ¿Cuál es tu meta?",
      subtitle: "Selecciona el producto que necesitas"
    },
    {
      id: "amount",
      title: "¿Cuánto necesitas?",
      subtitle: "Aproximadamente, no te preocupes si no estás seguro"
    },
    {
      id: "work",
      title: "Cuéntame sobre tu trabajo",
      subtitle: "Necesito entender tu situación laboral"
    },
    {
      id: "payslips",
      title: "¿Tienes boletas de pago?",
      subtitle: "Esto me ayuda a saber qué opciones mostrarte"
    },
    {
      id: "income",
      title: "¿Cuánto ganas al mes?",
      subtitle: "Solo necesito un estimado para calcular tus opciones"
    },
    {
      id: "documents",
      title: "Subida de archivos/documentos",
      subtitle: "Puedes subir tus documentos ahora o después"
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // Validation functions
  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{9}$/.test(phone);
  };

  const validateDNI = (dni: string) => {
    return /^\d{8}$/.test(dni);
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};
    
    // Removed all validation for personal step - users can proceed with any data
    
    if (currentStep === 4) { // Work step
      if (data.workSituation === "estudiante") {
        if (!data.carrera) errors.carrera = "Campo obligatorio";
        if (!data.ciclo) errors.ciclo = "Campo obligatorio";
        if (!data.hacePracticas) errors.hacePracticas = "Campo obligatorio";
        if (data.hacePracticas === "si" && !data.empresaPracticas) {
          errors.empresaPracticas = "Campo obligatorio";
        }
      } else if (data.workSituation === "independiente") {
        if (!data.workDetails) errors.workDetails = "Describe qué haces";
        if (!data.empresaTrabajo) errors.empresaTrabajo = "Campo obligatorio";
      } else if (data.workSituation === "empleado") {
        if (!data.workDetails) errors.workDetails = "Indica dónde trabajas";
        if (!data.empresaTrabajo) errors.empresaTrabajo = "Nombre de la empresa";
        if (!data.trabajoEnPlanilla) errors.trabajoEnPlanilla = "Selecciona tu ocupación";
        if (data.trabajoEnPlanilla === "Otros" && !data.otroTrabajo) {
          errors.otroTrabajo = "Especifica tu ocupación";
        }
      } else if (data.workSituation === "empresario") {
        if (!data.nombreNegocio) errors.nombreNegocio = "Nombre del negocio";
        if (!data.rubroNegocio) errors.rubroNegocio = "Rubro del negocio";
        if (!data.actividadPrincipal) errors.actividadPrincipal = "Actividad principal";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileUpload = (type: keyof typeof data.documents, file: File) => {
    if (type === 'payslips') {
      setUploadedPayslips(prev => [...prev, file]);
    }
    setData(prev => ({
      ...prev,
      documents: { ...prev.documents, [type]: file }
    }));
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (forceFlow) {
      if (confirm('¿Estás seguro de que quieres salir? Debes completar este formulario para solicitar el producto.')) {
        onBack();
      }
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case "intro": return true;
      case "personal": return true; // Always allow proceeding from personal step
      case "goal": return data.goal !== "";
      case "amount": return data.amount > 0;
      case "work": 
        if (data.workSituation === "estudiante") {
          return data.carrera && data.ciclo && data.hacePracticas && 
                 (data.hacePracticas === "no" || data.empresaPracticas);
        } else if (data.workSituation === "independiente") {
          return data.workDetails && data.empresaTrabajo;
        } else if (data.workSituation === "empleado") {
          return data.workDetails && data.empresaTrabajo && data.trabajoEnPlanilla &&
                 (data.trabajoEnPlanilla !== "Otros" || data.otroTrabajo);
        } else if (data.workSituation === "empresario") {
          return data.nombreNegocio && data.rubroNegocio && data.actividadPrincipal;
        }
        return data.workSituation !== "";
      case "payslips": return data.hasPayslips !== "";
      case "income": return data.monthlyIncome > 0;
      case "documents": return true; // No longer mandatory
      default: return false;
    }
  };

  const productOptions = [
    { id: "credito-personal", title: "Crédito Personal", icon: "💰", desc: "Para gastos personales" },
    { id: "credito-vehicular", title: "Crédito Vehicular", icon: "🚗", desc: "Para comprar auto" },
    { id: "credito-hipotecario", title: "Crédito Hipotecario", icon: "🏠", desc: "Para vivienda" },
    { id: "tarjeta-credito", title: "Tarjeta de Crédito", icon: "💳", desc: "Línea de crédito" },
    { id: "credito-empresarial", title: "Crédito Empresarial", icon: "🏢", desc: "Para negocios" },
    { id: "credito-educativo", title: "Crédito Educativo", icon: "🎓", desc: "Para estudios" },
    { id: "credito-medico", title: "Crédito Médico", icon: "🏥", desc: "Para gastos médicos" },
    { id: "credito-viaje", title: "Crédito de Viaje", icon: "✈️", desc: "Para viajes" },
    { id: "refinanciamiento", title: "Refinanciamiento", icon: "🔄", desc: "Consolidar deudas" },
    { id: "credito-construccion", title: "Crédito Construcción", icon: "🏗️", desc: "Para construcción" },
    { id: "credito-rural", title: "Crédito Rural", icon: "🌾", desc: "Para actividades rurales" }
  ];

  const jobPositions = [
    "Asistente",
    "Analista", 
    "Ejecutivo de ventas",
    "Practicante",
    "Contador",
    "Supervisor",
    "Coordinador",
    "Jefe",
    "Gerente",
    "Director",
    "Otros"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Mensaje de Transparencia Fijo - CAMBIADO A AZUL FUERTE */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 border-b-2 border-blue-700 py-2 px-4">
        <div className="container mx-auto max-w-4xl">
          <p className="text-sm text-white text-center font-medium">
            ⚠️ Este formulario no debe contener información falsa. La precisión de los datos es fundamental para ayudarte correctamente. Tardas menos de 2 minutos en completarlo. Sé honesto, es por tu beneficio.
          </p>
        </div>
      </div>

      {/* Header con padding-top para el mensaje fijo */}
      <div className="bg-white border-b border-blue-100 py-4 px-4 mt-12">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-800">NEZA</h1>
              <p className="text-sm text-blue-600">
                {forceFlow ? 'Formulario obligatorio para solicitud' : 'Tu aliado financiero de confianza'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {forceFlow && (
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-700 font-medium">Completar es obligatorio</span>
                </div>
              )}
              
              <Button
                onClick={() => setShowTutorial(!showTutorial)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs"
              >
                {showTutorial ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                Ver tutorial
              </Button>
              
              {!forceFlow && (
                <Button
                  onClick={() => setShowVideo(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  <Play className="w-3 h-3" />
                  Tutorial (1 min)
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Box */}
      {showTutorial && (
        <div className="bg-blue-50 border-b border-blue-200 py-3 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-sm text-blue-800">
              <strong>Paso {currentStep + 1} de {steps.length}:</strong> {currentStepData.subtitle}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600 font-medium">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm text-blue-600">{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl text-blue-800">
                  {currentStepData.title}
                </CardTitle>
                <p className="text-blue-600">{currentStepData.subtitle}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Paso 0: Introducción */}
                {currentStep === 0 && (
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">👋</div>
                    <p className="text-lg text-gray-700">
                      {forceFlow ? 
                        "Para procesar tu solicitud, necesitamos conocer tu perfil financiero. Este proceso es obligatorio y toma menos de 2 minutos." :
                        "Soy tu asesor financiero personal. Te voy a acompañar para encontrar la mejor opción para ti entre todos los bancos disponibles."
                      }
                    </p>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      {forceFlow ? 
                        "Al completar este formulario, las entidades financieras podrán hacer ofertas personalizadas para ti." :
                        "Todo el proceso toma menos de 2 minutos y es completamente gratuito."
                      }
                    </p>
                  </div>
                )}

                {/* Paso 1: Datos Personales - AGREGADO FECHA DE NACIMIENTO */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label>DNI</Label>
                      <Input
                        placeholder="12345678"
                        value={data.personalInfo.dni}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                          setData(prev => ({ 
                            ...prev, 
                            personalInfo: { ...prev.personalInfo, dni: value }
                          }));
                        }}
                        maxLength={8}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombres</Label>
                        <Input
                          placeholder="Tu nombre"
                          value={data.personalInfo.firstName}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                            setData(prev => ({ 
                              ...prev, 
                              personalInfo: { ...prev.personalInfo, firstName: value }
                            }));
                          }}
                        />
                      </div>
                      
                      <div>
                        <Label>Apellidos</Label>
                        <Input
                          placeholder="Tus apellidos"
                          value={data.personalInfo.lastName}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                            setData(prev => ({ 
                              ...prev, 
                              personalInfo: { ...prev.personalInfo, lastName: value }
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Fecha de nacimiento</Label>
                      <Input
                        type="date"
                        value={data.personalInfo.birthDate}
                        onChange={(e) => {
                          setData(prev => ({ 
                            ...prev, 
                            personalInfo: { ...prev.personalInfo, birthDate: e.target.value }
                          }));
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label>Correo Electrónico</Label>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        value={data.personalInfo.email}
                        onChange={(e) => {
                          setData(prev => ({ 
                            ...prev, 
                            personalInfo: { ...prev.personalInfo, email: e.target.value }
                          }));
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label>Teléfono</Label>
                      <Input
                        placeholder="987654321"
                        value={data.personalInfo.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                          setData(prev => ({ 
                            ...prev, 
                            personalInfo: { ...prev.personalInfo, phone: value }
                          }));
                        }}
                        maxLength={9}
                      />
                    </div>
                  </div>
                )}

                {/* Paso 2: Objetivo - Productos CON SCROLL */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {productOptions.map((product) => (
                          <Card 
                            key={product.id}
                            className={`cursor-pointer transition-all p-2 ${data.goal === product.id ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                            onClick={() => setData(prev => ({ ...prev, goal: product.id }))}
                          >
                            <CardContent className="p-2 text-center">
                              <div className="text-xl mb-1">{product.icon}</div>
                              <h4 className="font-medium text-xs">{product.title}</h4>
                              <p className="text-xs text-gray-600">{product.desc}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Desplaza hacia abajo para ver todos los productos disponibles</p>
                  </div>
                )}

                {/* Paso 3: Monto */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[5000, 10000, 25000, 50000, 100000, 200000].map((amount) => (
                        <Card 
                          key={amount}
                          className={`cursor-pointer transition-all ${data.amount === amount ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                          onClick={() => setData(prev => ({ ...prev, amount }))}
                        >
                          <CardContent className="p-3 text-center">
                            <p className="font-medium">S/ {amount.toLocaleString()}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <Label>O ingresa un monto específico:</Label>
                      <Input
                        type="number"
                        placeholder="Ejemplo: 15000"
                        value={data.amount || ""}
                        onChange={(e) => setData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {/* Paso 4: Trabajo EXPANDIDO CON CAMBIOS SOLICITADOS */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'empleado', title: 'Trabajo en planilla', icon: Building2 },
                        { id: 'independiente', title: 'Trabajo independiente', icon: Users },
                        { id: 'empresario', title: 'Tengo mi negocio', icon: Briefcase },
                        { id: 'estudiante', title: 'Soy estudiante', icon: GraduationCap }
                      ].map((work) => (
                        <Card 
                          key={work.id}
                          className={`cursor-pointer transition-all ${data.workSituation === work.id ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                          onClick={() => setData(prev => ({ ...prev, workSituation: work.id }))}
                        >
                          <CardContent className="p-4 text-center">
                            <work.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                            <h4 className="font-medium">{work.title}</h4>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Conditional fields based on work situation */}
                    {data.workSituation === 'estudiante' && (
                      <div className="space-y-4 border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Carrera *</Label>
                            <Input
                              placeholder="Ingeniería, Administración, etc."
                              value={data.carrera || ""}
                              onChange={(e) => setData(prev => ({ ...prev, carrera: e.target.value }))}
                              className={validationErrors.carrera ? "border-red-500" : ""}
                            />
                            {validationErrors.carrera && (
                              <p className="text-red-500 text-sm mt-1">{validationErrors.carrera}</p>
                            )}
                          </div>
                          <div>
                            <Label>¿En qué ciclo estudias? *</Label>
                            <Select onValueChange={(value) => setData(prev => ({ ...prev, ciclo: value }))}>
                              <SelectTrigger className={validationErrors.ciclo ? "border-red-500" : ""}>
                                <SelectValue placeholder="Selecciona el ciclo" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <SelectItem key={i + 1} value={`Ciclo ${i + 1}`}>
                                    Ciclo {i + 1}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {validationErrors.ciclo && (
                              <p className="text-red-500 text-sm mt-1">{validationErrors.ciclo}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label>¿Hace prácticas profesionales? *</Label>
                          <Select onValueChange={(value) => setData(prev => ({ ...prev, hacePracticas: value }))}>
                            <SelectTrigger className={validationErrors.hacePracticas ? "border-red-500" : ""}>
                              <SelectValue placeholder="Selecciona una opción" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="si">Sí</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                          {validationErrors.hacePracticas && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.hacePracticas}</p>
                          )}
                        </div>
                        {data.hacePracticas === 'si' && (
                          <div>
                            <Label>¿Dónde las realiza? *</Label>
                            <Input
                              placeholder="Nombre de la empresa"
                              value={data.empresaPracticas || ""}
                              onChange={(e) => setData(prev => ({ ...prev, empresaPracticas: e.target.value }))}
                              className={validationErrors.empresaPracticas ? "border-red-500" : ""}
                            />
                            {validationErrors.empresaPracticas && (
                              <p className="text-red-500 text-sm mt-1">{validationErrors.empresaPracticas}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {data.workSituation === 'independiente' && (
                      <div className="space-y-4 border-t pt-4">
                        <div>
                          <Label>¿Qué hace? *</Label>
                          <Input
                            placeholder="Describe tu actividad independiente"
                            value={data.workDetails}
                            onChange={(e) => setData(prev => ({ ...prev, workDetails: e.target.value }))}
                            className={validationErrors.workDetails ? "border-red-500" : ""}
                          />
                          {validationErrors.workDetails && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.workDetails}</p>
                          )}
                        </div>
                        <div>
                          <Label>¿En qué empresa? *</Label>
                          <Input
                            placeholder="Nombre de la empresa o N/A"
                            value={data.empresaTrabajo || ""}
                            onChange={(e) => setData(prev => ({ ...prev, empresaTrabajo: e.target.value }))}
                            className={validationErrors.empresaTrabajo ? "border-red-500" : ""}
                          />
                          {validationErrors.empresaTrabajo && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.empresaTrabajo}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {data.workSituation === 'empleado' && (
                      <div className="space-y-4 border-t pt-4">
                        <div>
                          <Label>¿Dónde trabaja? *</Label>
                          <Input
                            placeholder="Describe tu puesto de trabajo"
                            value={data.workDetails}
                            onChange={(e) => setData(prev => ({ ...prev, workDetails: e.target.value }))}
                            className={validationErrors.workDetails ? "border-red-500" : ""}
                          />
                          {validationErrors.workDetails && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.workDetails}</p>
                          )}
                        </div>
                        <div>
                          <Label>¿En qué empresa? *</Label>
                          <Input
                            placeholder="Empresa donde trabajas"
                            value={data.empresaTrabajo || ""}
                            onChange={(e) => setData(prev => ({ ...prev, empresaTrabajo: e.target.value }))}
                            className={validationErrors.empresaTrabajo ? "border-red-500" : ""}
                          />
                          {validationErrors.empresaTrabajo && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.empresaTrabajo}</p>
                          )}
                        </div>
                        <div>
                          <Label>¿Trabajas en planilla? *</Label>
                          <Select onValueChange={(value) => setData(prev => ({ ...prev, trabajoEnPlanilla: value }))}>
                            <SelectTrigger className={validationErrors.trabajoEnPlanilla ? "border-red-500" : ""}>
                              <SelectValue placeholder="Selecciona tu ocupación" />
                            </SelectTrigger>
                            <SelectContent>
                              {jobPositions.map((position) => (
                                <SelectItem key={position} value={position}>
                                  {position}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {validationErrors.trabajoEnPlanilla && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.trabajoEnPlanilla}</p>
                          )}
                        </div>
                        {data.trabajoEnPlanilla === "Otros" && (
                          <div>
                            <Label>Especifica tu ocupación *</Label>
                            <Input
                              placeholder="Describe tu ocupación"
                              value={data.otroTrabajo || ""}
                              onChange={(e) => setData(prev => ({ ...prev, otroTrabajo: e.target.value }))}
                              className={validationErrors.otroTrabajo ? "border-red-500" : ""}
                            />
                            {validationErrors.otroTrabajo && (
                              <p className="text-red-500 text-sm mt-1">{validationErrors.otroTrabajo}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {data.workSituation === 'empresario' && (
                      <div className="space-y-4 border-t pt-4">
                        <div>
                          <Label>Nombre del negocio *</Label>
                          <Input
                            placeholder="Nombre de tu negocio"
                            value={data.nombreNegocio || ""}
                            onChange={(e) => setData(prev => ({ ...prev, nombreNegocio: e.target.value }))}
                            className={validationErrors.nombreNegocio ? "border-red-500" : ""}
                          />
                          {validationErrors.nombreNegocio && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.nombreNegocio}</p>
                          )}
                        </div>
                        <div>
                          <Label>Rubro *</Label>
                          <Input
                            placeholder="Comercio, servicios, manufactura, etc."
                            value={data.rubroNegocio || ""}
                            onChange={(e) => setData(prev => ({ ...prev, rubroNegocio: e.target.value }))}
                            className={validationErrors.rubroNegocio ? "border-red-500" : ""}
                          />
                          {validationErrors.rubroNegocio && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.rubroNegocio}</p>
                          )}
                        </div>
                        <div>
                          <Label>Actividad *</Label>
                          <Input
                            placeholder="Describe la actividad principal"
                            value={data.actividadPrincipal || ""}
                            onChange={(e) => setData(prev => ({ ...prev, actividadPrincipal: e.target.value }))}
                            className={validationErrors.actividadPrincipal ? "border-red-500" : ""}
                          />
                          {validationErrors.actividadPrincipal && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.actividadPrincipal}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Paso 5: Boletas */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card 
                        className={`cursor-pointer transition-all ${data.hasPayslips === 'si' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                        onClick={() => setData(prev => ({ ...prev, hasPayslips: 'si' }))}
                      >
                        <CardContent className="p-4 text-center">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-medium">Sí, tengo boletas</h4>
                          <p className="text-xs text-gray-600">Puedo mostrar mis ingresos</p>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all ${data.hasPayslips === 'no' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                        onClick={() => setData(prev => ({ ...prev, hasPayslips: 'no' }))}
                      >
                        <CardContent className="p-4 text-center">
                          <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-medium">No tengo boletas</h4>
                          <p className="text-xs text-gray-600">Trabajo independiente</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Paso 6: Ingresos */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[1000, 1500, 2500, 4000, 6000, 10000].map((income) => (
                        <Card 
                          key={income}
                          className={`cursor-pointer transition-all ${data.monthlyIncome === income ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                          onClick={() => setData(prev => ({ ...prev, monthlyIncome: income }))}
                        >
                          <CardContent className="p-3 text-center">
                            <p className="font-medium">S/ {income.toLocaleString()}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <Label>O ingresa tu ingreso exacto:</Label>
                      <Input
                        type="number"
                        placeholder="Ejemplo: 3500"
                        value={data.monthlyIncome || ""}
                        onChange={(e) => setData(prev => ({ ...prev, monthlyIncome: Number(e.target.value) }))}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {/* Paso 7: Documentos OPCIONAL AHORA */}
                {currentStep === 7 && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 mb-4">
                      <p className="text-orange-800 text-sm">
                        <strong>Para acceder a un producto financiero, deberás completar esta información más adelante.</strong>
                      </p>
                    </div>

                    <div className="bg-blue-600 border border-blue-300 rounded-lg p-4 mb-4">
                      <p className="text-white text-sm">
                        <strong>Importante:</strong> Subir documentos no es obligatorio para ir a la subasta, pero sí para cerrar con un banco.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="flex items-center gap-2">
                          <span>DNI (ambas caras - obligatorio para validar)</span>
                        </Label>
                        <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('dni', file);
                            }}
                            className="hidden"
                            id="dni-upload"
                          />
                          <label htmlFor="dni-upload" className="cursor-pointer">
                            <Button variant="outline" size="sm" asChild>
                              <span>Subir DNI</span>
                            </Button>
                          </label>
                          {data.documents.dni && (
                            <p className="text-sm text-green-600 mt-2">✅ {data.documents.dni.name}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label>Adjunta tus boletas de pago</Label>
                        <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              files.forEach(file => {
                                setUploadedPayslips(prev => [...prev, file]);
                              });
                              if (files.length > 0) {
                                handleFileUpload('payslips', files[0]);
                              }
                            }}
                            className="hidden"
                            id="payslips-upload"
                          />
                          <label htmlFor="payslips-upload" className="cursor-pointer">
                            <Button variant="outline" size="sm" asChild>
                              <span>Subir Boletas</span>
                            </Button>
                          </label>
                          {uploadedPayslips.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-green-600">✅ {uploadedPayslips.length} archivo(s) subido(s)</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label>Otros documentos</Label>
                        <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            multiple
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('others', file);
                            }}
                            className="hidden"
                            id="others-upload"
                          />
                          <label htmlFor="others-upload" className="cursor-pointer">
                            <Button variant="outline" size="sm" asChild>
                              <span>Subir Documentos</span>
                            </Button>
                          </label>
                          {data.documents.others && (
                            <p className="text-sm text-green-600 mt-2">✅ {data.documents.others.name}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        <strong>Sistema de gestión:</strong> Cada usuario tiene una carpeta individual donde se almacenan datos y documentos. Si regresas por otro producto, tu información se mantiene actualizada.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? onBack : handlePrev}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 0 ? (forceFlow ? 'Cancelar' : 'Volver') : 'Anterior'}
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === steps.length - 1 ? 
              (forceFlow ? 'Proceder a la subasta' : 'Ver mis opciones') : 
              'Siguiente'
            }
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Tutorial NEZA</h3>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-600">Video tutorial aquí</p>
            </div>
            <Button onClick={() => setShowVideo(false)} className="w-full">
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
