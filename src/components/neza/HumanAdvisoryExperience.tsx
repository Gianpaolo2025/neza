import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Home, Car, CreditCard, Heart, Target, Play, Building2, FileText, Users, Briefcase, AlertCircle } from "lucide-react";

interface UserData {
  goal: string;
  amount: number;
  workSituation: string;
  hasPayslips: string;
  monthlyIncome: number;
  personalInfo: {
    firstName: string;
    lastName: string;
    dni: string;
    email: string;
    phone: string;
  };
  preferredBank: string;
}

interface HumanAdvisoryExperienceProps {
  onBack: () => void;
  onComplete: (data: UserData) => void;
  forceFlow?: boolean;
}

export const HumanAdvisoryExperience = ({ onBack, onComplete, forceFlow = false }: HumanAdvisoryExperienceProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [data, setData] = useState<UserData>({
    goal: "",
    amount: 0,
    workSituation: "",
    hasPayslips: "",
    monthlyIncome: 0,
    personalInfo: {
      firstName: "",
      lastName: "",
      dni: "",
      email: "",
      phone: ""
    },
    preferredBank: ""
  });

  const steps = [
    {
      id: "intro",
      title: forceFlow ? "Completa tu solicitud" : "Hola, empecemos por conocerte",
      subtitle: forceFlow ? "Para solicitar este producto, necesitamos conocer tu perfil financiero" : "Te voy a hacer unas preguntas sencillas para entender qué necesitas"
    },
    {
      id: "goal",
      title: "¿Qué quieres lograr?",
      subtitle: "Cuéntame cuál es tu meta principal"
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
      id: "personal",
      title: "Algunos datos para contactarte",
      subtitle: "Los bancos necesitan esta información para hacer su propuesta"
    },
    {
      id: "bank",
      title: "¿Tienes algún banco favorito?",
      subtitle: "Si tienes historial con alguno, puede ser una ventaja"
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
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
      case "goal": return data.goal !== "";
      case "amount": return data.amount > 0;
      case "work": return data.workSituation !== "";
      case "payslips": return data.hasPayslips !== "";
      case "income": return data.monthlyIncome > 0;
      case "personal": 
        return data.personalInfo.firstName && data.personalInfo.lastName && 
               data.personalInfo.dni && data.personalInfo.email && data.personalInfo.phone;
      case "bank": return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header con Misión y Visión */}
      <div className="bg-white border-b border-blue-100 py-4 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-800">NEZA</h1>
              <p className="text-sm text-blue-600">
                {forceFlow ? 'Formulario obligatorio para solicitud' : 'Tu aliado financiero de confianza'}
              </p>
            </div>
            
            {forceFlow && (
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700 font-medium">Completar es obligatorio</span>
              </div>
            )}
            
            {!forceFlow && (
              <div className="flex gap-4 text-xs">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-blue-700 font-medium">
                    <Heart className="w-3 h-3" />
                    <span>Misión</span>
                  </div>
                  <p className="text-blue-600 max-w-[120px]">Ayudarte a cumplir tus metas sin estrés ni letras pequeñas</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center gap-1 text-blue-700 font-medium">
                    <Target className="w-3 h-3" />
                    <span>Visión</span>
                  </div>
                  <p className="text-blue-600 max-w-[120px]">Ser tu aliado con soluciones reales y cercanas</p>
                </div>
                
                <Button
                  onClick={() => setShowVideo(true)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  <Play className="w-3 h-3" />
                  Tutorial (1 min)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

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
                        "Para procesar tu solicitud, necesitamos conocer tu perfil financiero. Este proceso es obligatorio y toma menos de 3 minutos." :
                        "Soy tu asesor financiero personal. Te voy a acompañar para encontrar la mejor opción para ti entre todos los bancos disponibles."
                      }
                    </p>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      {forceFlow ? 
                        "Al completar este formulario, las entidades financieras podrán hacer ofertas personalizadas para ti." :
                        "Todo el proceso toma menos de 3 minutos y es completamente gratuito."
                      }
                    </p>
                  </div>
                )}

                {/* Paso 1: Objetivo */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card 
                        className={`cursor-pointer transition-all ${data.goal === 'casa' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                        onClick={() => setData(prev => ({ ...prev, goal: 'casa' }))}
                      >
                        <CardContent className="p-4 text-center">
                          <Home className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-medium">¿Quieres un depa o una casa?</h4>
                          <p className="text-xs text-gray-600">Vivienda propia</p>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all ${data.goal === 'auto' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                        onClick={() => setData(prev => ({ ...prev, goal: 'auto' }))}
                      >
                        <CardContent className="p-4 text-center">
                          <Car className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-medium">Un auto</h4>
                          <p className="text-xs text-gray-600">Vehículo propio</p>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all ${data.goal === 'personal' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                        onClick={() => setData(prev => ({ ...prev, goal: 'personal' }))}
                      >
                        <CardContent className="p-4 text-center">
                          <CreditCard className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-medium">Dinero para gastos</h4>
                          <p className="text-xs text-gray-600">Uso personal</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Paso 2: Monto */}
                {currentStep === 2 && (
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

                {/* Paso 3: Trabajo (fusionado) */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card 
                        className={`cursor-pointer transition-all ${data.workSituation === 'empleado' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                        onClick={() => setData(prev => ({ ...prev, workSituation: 'empleado' }))}
                      >
                        <CardContent className="p-4 text-center">
                          <Building2 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-medium">Trabajo en planilla</h4>
                          <p className="text-xs text-gray-600">Empleado dependiente</p>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all ${data.workSituation === 'independiente' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                        onClick={() => setData(prev => ({ ...prev, workSituation: 'independiente' }))}
                      >
                        <CardContent className="p-4 text-center">
                          <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-medium">Trabajo independiente</h4>
                          <p className="text-xs text-gray-600">Por mi cuenta</p>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all ${data.workSituation === 'empresario' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                        onClick={() => setData(prev => ({ ...prev, workSituation: 'empresario' }))}
                      >
                        <CardContent className="p-4 text-center">
                          <Briefcase className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-medium">Tengo mi negocio</h4>
                          <p className="text-xs text-gray-600">Empresario</p>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer transition-all ${data.workSituation === 'pensionista' ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300'}`}
                        onClick={() => setData(prev => ({ ...prev, workSituation: 'pensionista' }))}
                      >
                        <CardContent className="p-4 text-center">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                          <h4 className="font-medium">Soy pensionista</h4>
                          <p className="text-xs text-gray-600">Jubilado/a</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Paso 4: Boletas */}
                {currentStep === 4 && (
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

                    {data.hasPayslips === 'no' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                        <p className="text-green-800 text-sm">
                          <strong>Tranquilo</strong>, si no tienes boletas de pago, igual podemos ayudarte. 
                          Vemos tu caso de forma personalizada.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Paso 5: Ingresos */}
                {currentStep === 5 && (
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

                {/* Paso 6: Datos Personales */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombres</Label>
                        <Input
                          placeholder="Tu nombre"
                          value={data.personalInfo.firstName}
                          onChange={(e) => setData(prev => ({ 
                            ...prev, 
                            personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                          }))}
                        />
                      </div>
                      
                      <div>
                        <Label>Apellidos</Label>
                        <Input
                          placeholder="Tus apellidos"
                          value={data.personalInfo.lastName}
                          onChange={(e) => setData(prev => ({ 
                            ...prev, 
                            personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                          }))}
                        />
                      </div>
                      
                      <div>
                        <Label>DNI</Label>
                        <Input
                          placeholder="12345678"
                          value={data.personalInfo.dni}
                          onChange={(e) => setData(prev => ({ 
                            ...prev, 
                            personalInfo: { ...prev.personalInfo, dni: e.target.value }
                          }))}
                        />
                      </div>
                      
                      <div>
                        <Label>Teléfono</Label>
                        <Input
                          placeholder="987654321"
                          value={data.personalInfo.phone}
                          onChange={(e) => setData(prev => ({ 
                            ...prev, 
                            personalInfo: { ...prev.personalInfo, phone: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        value={data.personalInfo.email}
                        onChange={(e) => setData(prev => ({ 
                          ...prev, 
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                )}

                {/* Paso 7: Banco Preferido */}
                {currentStep === 7 && (
                  <div className="space-y-4">
                    <Select onValueChange={(value) => setData(prev => ({ ...prev, preferredBank: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu banco favorito (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ninguno">Sin preferencia</SelectItem>
                        <SelectItem value="bcp">Banco de Crédito BCP</SelectItem>
                        <SelectItem value="bbva">BBVA</SelectItem>
                        <SelectItem value="scotiabank">Scotiabank</SelectItem>
                        <SelectItem value="interbank">Interbank</SelectItem>
                        <SelectItem value="banco-nacion">Banco de la Nación</SelectItem>
                        <SelectItem value="pichincha">Banco Pichincha</SelectItem>
                        <SelectItem value="mibanco">Mi Banco</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        Si ya eres cliente de algún banco, puede darte ventajas en tu propuesta.
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
