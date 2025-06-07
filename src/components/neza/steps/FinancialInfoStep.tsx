
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, DollarSign, Briefcase, Clock } from "lucide-react";
import { ProductListView } from "./ProductListView";

interface FinancialInfo {
  creditType: string;
  requestedAmount: number;
  monthlyIncome: number;
  occupation: string;
  workTime: number;
  hasOtherDebts: string;
  bankingRelationship: string;
  urgencyLevel: string;
  productType: string;
  employmentType: string;
}

interface PersonalData {
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  email: string;
  phone: string;
  isValidated: boolean;
  otpVerified: boolean;
}

interface FinancialInfoStepProps {
  data: FinancialInfo;
  personalData: PersonalData;
  onUpdate: (data: FinancialInfo) => void;
  onNext: () => void;
  onPrev: () => void;
}

const occupations = [
  'Empleado dependiente',
  'Profesional independiente', 
  'Empresario',
  'Comerciante',
  'Funcionario público',
  'Docente',
  'Pensionista',
  'Otros'
];

const employmentTypes = [
  { id: 'dependiente', label: 'Dependiente', description: 'Trabajas para una empresa' },
  { id: 'independiente', label: 'Independiente', description: 'Trabajas por cuenta propia' },
  { id: 'empresario', label: 'Empresario', description: 'Tienes tu propia empresa' },
  { id: 'pensionista', label: 'Pensionista', description: 'Recibes pensión' }
];

const debtLevels = [
  { id: 'no', label: 'No tengo deudas', description: 'Sin deudas actuales' },
  { id: 'pocas', label: 'Pocas deudas', description: 'Algunas deudas menores' },
  { id: 'moderadas', label: 'Deudas moderadas', description: 'Nivel medio de deudas' },
  { id: 'altas', label: 'Deudas altas', description: 'Nivel alto de deudas' }
];

const urgencyLevels = [
  { id: 'flexible', label: 'Flexible', description: 'Puedo esperar' },
  { id: 'pronto', label: 'Pronto', description: 'En 1-2 semanas' },
  { id: 'inmediato', label: 'Inmediato', description: 'Lo necesito YA' }
];

export const FinancialInfoStep = ({ 
  data, 
  personalData, 
  onUpdate, 
  onNext, 
  onPrev 
}: FinancialInfoStepProps) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [profileLevel, setProfileLevel] = useState(0);

  useEffect(() => {
    calculateProfileLevel();
  }, [data]);

  const calculateProfileLevel = () => {
    let level = 0;
    
    // Ingresos
    if (data.monthlyIncome >= 3000) level += 20;
    else if (data.monthlyIncome >= 1500) level += 15;
    else if (data.monthlyIncome >= 800) level += 10;

    // Relación monto/ingresos
    if (data.requestedAmount > 0 && data.monthlyIncome > 0) {
      const ratio = data.requestedAmount / data.monthlyIncome;
      if (ratio <= 5) level += 20;
      else if (ratio <= 10) level += 15;
      else level += 5;
    }

    // Experiencia laboral
    if (data.workTime >= 24) level += 15;
    else if (data.workTime >= 12) level += 10;
    else if (data.workTime >= 6) level += 5;

    // Completitud del perfil
    if (data.occupation && data.creditType) level += 10;
    if (data.employmentType) level += 10;
    if (data.hasOtherDebts) level += 5;
    if (data.urgencyLevel) level += 5;

    setProfileLevel(Math.min(level, 100));
  };

  const handleProductSelect = (productId: string) => {
    onUpdate({ ...data, creditType: productId, productType: productId });
    setCurrentSubStep(2);
  };

  const canProceed = () => {
    return data.creditType && 
           data.requestedAmount > 0 && 
           data.monthlyIncome > 0 && 
           data.occupation && 
           data.workTime > 0 &&
           data.employmentType &&
           data.hasOtherDebts &&
           data.urgencyLevel;
  };

  const getMotivationalMessage = () => {
    switch (currentSubStep) {
      case 1:
        return `¡Perfecto, ${personalData.firstName}! Elige el producto financiero ideal para ti 💰`;
      case 2:
        return `¡Excelente elección! Ahora cuéntame cuánto dinero necesitas 💰`;
      case 3:
        return `¡Casi terminamos! Cuéntame sobre tu situación laboral 💼`;
      case 4:
        return `¡Último paso! Información adicional para mejores ofertas 🎯`;
      default:
        return `¡Buen trabajo! Ya tienes un perfil financiero sólido 🎯`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Mensaje motivacional */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl mb-2"
        >
          💰
        </motion.div>
        <p className="text-lg text-slate-700 font-medium">
          {getMotivationalMessage()}
        </p>
      </motion.div>

      {/* Barra de progreso del perfil */}
      {profileLevel > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">
                  Nivel de perfil financiero
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {profileLevel}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileLevel}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-end pr-2"
                >
                  {profileLevel >= 50 && <TrendingUp className="w-3 h-3 text-white" />}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* Paso 1: Selección de producto */}
        {currentSubStep === 1 && (
          <motion.div
            key="product-selection"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <ProductListView
              products={[]}
              onSelect={handleProductSelect}
              selectedProduct={data.creditType}
            />
          </motion.div>
        )}

        {/* Paso 2: Monto solicitado */}
        {currentSubStep === 2 && (
          <motion.div
            key="amount"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <Card className="border-blue-200 bg-white/80">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <DollarSign className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                  <Label className="text-2xl font-bold text-slate-800 mb-4 block">
                    ¿Cuánto dinero necesitas?
                  </Label>
                  <p className="text-slate-600">
                    Especifica el monto exacto que necesitas para tu {data.creditType.replace('-', ' ')}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <Input
                      type="number"
                      value={data.requestedAmount || ''}
                      onChange={(e) => onUpdate({ ...data, requestedAmount: Number(e.target.value) })}
                      placeholder="Ej: 25000"
                      className="text-2xl py-6 text-center font-bold border-blue-300 focus:border-blue-500"
                    />
                    <p className="text-sm text-slate-500 mt-2">Soles peruanos (S/)</p>
                  </div>
                  
                  <div className="space-y-4">
                    <Slider
                      value={[data.requestedAmount]}
                      onValueChange={([value]) => onUpdate({ ...data, requestedAmount: value })}
                      min={1000}
                      max={200000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>S/ 1,000</span>
                      <span>S/ 200,000</span>
                    </div>
                  </div>

                  {data.requestedAmount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <p className="text-blue-800 font-medium">
                        Monto solicitado: <span className="text-xl font-bold">S/ {data.requestedAmount.toLocaleString()}</span>
                      </p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Paso 3: Información laboral e ingresos */}
        {currentSubStep === 3 && (
          <motion.div
            key="work-info"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Tipo de empleo */}
            <Card className="border-blue-200 bg-white/80">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <Label className="text-lg font-medium text-slate-700">
                    ¿Cuál es tu situación laboral? 💼
                  </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {employmentTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={data.employmentType === type.id ? "default" : "outline"}
                      onClick={() => onUpdate({ ...data, employmentType: type.id })}
                      className={`h-auto p-4 text-left ${
                        data.employmentType === type.id 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm opacity-75">{type.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ingresos mensuales */}
            <Card className="border-blue-200 bg-white/80">
              <CardContent className="p-6">
                <Label className="text-lg font-medium text-slate-700 mb-4 block">
                  ¿Cuáles son tus ingresos mensuales? 📈
                </Label>
                <Input
                  type="number"
                  value={data.monthlyIncome || ''}
                  onChange={(e) => onUpdate({ ...data, monthlyIncome: Number(e.target.value) })}
                  placeholder="Ej: 3000"
                  className="text-lg py-6 border-blue-300 focus:border-blue-500"
                />
                {data.requestedAmount > 0 && data.monthlyIncome > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-sm text-slate-600"
                  >
                    Capacidad de pago: {Math.round(data.requestedAmount / data.monthlyIncome)} meses aprox.
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Ocupación */}
            <Card className="border-blue-200 bg-white/80">
              <CardContent className="p-6">
                <Label className="text-lg font-medium text-slate-700 mb-4 block">
                  ¿A qué te dedicas? 💼
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {occupations.map((occupation) => (
                    <Button
                      key={occupation}
                      variant={data.occupation === occupation ? "default" : "outline"}
                      onClick={() => onUpdate({ ...data, occupation })}
                      className={`text-sm h-auto py-3 px-2 ${
                        data.occupation === occupation 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      {occupation}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tiempo de trabajo */}
            <Card className="border-blue-200 bg-white/80">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <Label className="text-lg font-medium text-slate-700">
                    ¿Cuánto tiempo llevas trabajando? ⏰
                  </Label>
                </div>
                <div className="space-y-4">
                  <Input
                    type="number"
                    value={data.workTime || ''}
                    onChange={(e) => onUpdate({ ...data, workTime: Number(e.target.value) })}
                    placeholder="Meses de experiencia laboral"
                    className="text-lg py-6 border-blue-300 focus:border-blue-500"
                  />
                  <Slider
                    value={[data.workTime]}
                    onValueChange={([value]) => onUpdate({ ...data, workTime: value })}
                    min={1}
                    max={120}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>1 mes</span>
                    <span>10 años</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Paso 4: Información adicional */}
        {currentSubStep === 4 && (
          <motion.div
            key="additional-info"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Deudas existentes */}
            <Card className="border-blue-200 bg-white/80">
              <CardContent className="p-6">
                <Label className="text-lg font-medium text-slate-700 mb-4 block">
                  ¿Tienes otras deudas actualmente? 💳
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {debtLevels.map((level) => (
                    <Button
                      key={level.id}
                      variant={data.hasOtherDebts === level.id ? "default" : "outline"}
                      onClick={() => onUpdate({ ...data, hasOtherDebts: level.id })}
                      className={`h-auto p-4 text-left ${
                        data.hasOtherDebts === level.id 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm opacity-75">{level.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Urgencia */}
            <Card className="border-blue-200 bg-white/80">
              <CardContent className="p-6">
                <Label className="text-lg font-medium text-slate-700 mb-4 block">
                  ¿Qué tan urgente necesitas el dinero? ⚡
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {urgencyLevels.map((level) => (
                    <Button
                      key={level.id}
                      variant={data.urgencyLevel === level.id ? "default" : "outline"}
                      onClick={() => onUpdate({ ...data, urgencyLevel: level.id })}
                      className={`h-auto p-4 text-center ${
                        data.urgencyLevel === level.id 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm opacity-75">{level.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botones de navegación */}
      <div className="flex gap-4 mt-8">
        <Button 
          variant="outline" 
          onClick={currentSubStep === 1 ? onPrev : () => setCurrentSubStep(currentSubStep - 1)} 
          className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          Anterior
        </Button>
        
        {currentSubStep < 4 ? (
          <Button 
            onClick={() => setCurrentSubStep(currentSubStep + 1)} 
            disabled={
              (currentSubStep === 1 && !data.creditType) ||
              (currentSubStep === 2 && (!data.requestedAmount || data.requestedAmount <= 0)) ||
              (currentSubStep === 3 && (!data.monthlyIncome || !data.occupation || !data.workTime || !data.employmentType))
            }
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Siguiente
          </Button>
        ) : (
          <Button 
            onClick={onNext} 
            disabled={!canProceed()}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {profileLevel >= 70 ? '¡Buscar Ofertas! 🚀' : 'Buscar Ofertas'}
          </Button>
        )}
      </div>
    </div>
  );
};
