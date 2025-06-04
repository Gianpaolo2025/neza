
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Home, Car, Briefcase, GraduationCap, CreditCard, TrendingUp } from "lucide-react";

interface FinancialInfo {
  creditType: string;
  requestedAmount: number;
  monthlyIncome: number;
  occupation: string;
  workTime: number;
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

const creditTypes = [
  {
    id: 'personal',
    title: 'Préstamo Personal',
    subtitle: 'Para gastos personales',
    icon: CreditCard,
    color: 'from-blue-500 to-blue-600',
    minAmount: 1000,
    maxAmount: 50000
  },
  {
    id: 'vehicular',
    title: 'Crédito Vehicular',
    subtitle: 'Para tu auto o moto',
    icon: Car,
    color: 'from-purple-500 to-purple-600',
    minAmount: 5000,
    maxAmount: 200000
  },
  {
    id: 'hipotecario',
    title: 'Crédito Hipotecario',
    subtitle: 'Para tu casa soñada',
    icon: Home,
    color: 'from-green-500 to-green-600',
    minAmount: 50000,
    maxAmount: 800000
  },
  {
    id: 'educativo',
    title: 'Crédito Educativo',
    subtitle: 'Invierte en tu futuro',
    icon: GraduationCap,
    color: 'from-orange-500 to-orange-600',
    minAmount: 2000,
    maxAmount: 100000
  }
];

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

export const FinancialInfoStep = ({ 
  data, 
  personalData, 
  onUpdate, 
  onNext, 
  onPrev 
}: FinancialInfoStepProps) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [profileLevel, setProfileLevel] = useState(0);

  const selectedCreditType = creditTypes.find(type => type.id === data.creditType);

  const calculateProfileLevel = () => {
    let level = 0;
    if (data.monthlyIncome >= 3000) level += 25;
    else if (data.monthlyIncome >= 1500) level += 15;
    else if (data.monthlyIncome >= 800) level += 10;

    if (data.requestedAmount > 0 && data.monthlyIncome > 0) {
      const ratio = data.requestedAmount / data.monthlyIncome;
      if (ratio <= 5) level += 25;
      else if (ratio <= 10) level += 15;
      else level += 5;
    }

    if (data.workTime >= 24) level += 25;
    else if (data.workTime >= 12) level += 15;
    else if (data.workTime >= 6) level += 10;

    if (data.occupation && data.creditType) level += 25;

    setProfileLevel(Math.min(level, 100));
  };

  const handleCreditTypeSelect = (typeId: string) => {
    const type = creditTypes.find(t => t.id === typeId)!;
    onUpdate({ 
      ...data, 
      creditType: typeId,
      requestedAmount: Math.max(data.requestedAmount, type.minAmount)
    });
    setCurrentSubStep(2);
    calculateProfileLevel();
  };

  const handleAmountChange = (amount: number) => {
    onUpdate({ ...data, requestedAmount: amount });
    calculateProfileLevel();
  };

  const handleIncomeChange = (income: number) => {
    onUpdate({ ...data, monthlyIncome: income });
    calculateProfileLevel();
  };

  const canProceed = () => {
    return data.creditType && 
           data.requestedAmount > 0 && 
           data.monthlyIncome > 0 && 
           data.occupation && 
           data.workTime > 0;
  };

  const getMotivationalMessage = () => {
    if (currentSubStep === 1) {
      return `¡Perfecto, ${personalData.firstName}! ¿Qué tipo de crédito necesitas? 💰`;
    } else if (currentSubStep === 2) {
      return `¡Excelente elección! Ahora cuéntame sobre tu situación financiera 📊`;
    }
    return `¡Buen trabajo! Ya tienes un perfil financiero sólido 🎯`;
  };

  return (
    <div className="max-w-4xl mx-auto">
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
        <p className="text-lg text-gray-700 font-medium">
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Nivel de perfil financiero
                </span>
                <span className="text-lg font-bold text-emerald-600">
                  {profileLevel}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileLevel}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-end pr-2"
                >
                  {profileLevel >= 50 && <TrendingUp className="w-3 h-3 text-white" />}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* Paso 1: Selección de tipo de crédito */}
        {currentSubStep === 1 && (
          <motion.div
            key="creditTypes"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {creditTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        data.creditType === type.id ? 'ring-2 ring-emerald-500' : ''
                      }`}
                      onClick={() => handleCreditTypeSelect(type.id)}
                    >
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {type.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {type.subtitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          Desde S/ {type.minAmount.toLocaleString()} hasta S/ {type.maxAmount.toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Paso 2: Información detallada */}
        {currentSubStep === 2 && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Monto solicitado */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-medium text-gray-700 mb-4 block">
                  ¿Cuánto necesitas? 💵
                </Label>
                <div className="space-y-4">
                  <Input
                    type="number"
                    value={data.requestedAmount || ''}
                    onChange={(e) => handleAmountChange(Number(e.target.value))}
                    placeholder={`Mínimo S/ ${selectedCreditType?.minAmount || 1000}`}
                    className="text-lg py-6"
                  />
                  {selectedCreditType && (
                    <Slider
                      value={[data.requestedAmount]}
                      onValueChange={([value]) => handleAmountChange(value)}
                      min={selectedCreditType.minAmount}
                      max={selectedCreditType.maxAmount}
                      step={1000}
                      className="w-full"
                    />
                  )}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>S/ {selectedCreditType?.minAmount.toLocaleString()}</span>
                    <span>S/ {selectedCreditType?.maxAmount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingresos mensuales */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-medium text-gray-700 mb-4 block">
                  ¿Cuáles son tus ingresos mensuales? 📈
                </Label>
                <Input
                  type="number"
                  value={data.monthlyIncome || ''}
                  onChange={(e) => handleIncomeChange(Number(e.target.value))}
                  placeholder="Ej: 3000"
                  className="text-lg py-6"
                />
                {data.requestedAmount > 0 && data.monthlyIncome > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-sm text-gray-600"
                  >
                    Capacidad de pago: {Math.round(data.requestedAmount / data.monthlyIncome)} meses aprox.
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Ocupación */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-medium text-gray-700 mb-4 block">
                  ¿A qué te dedicas? 💼
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {occupations.map((occupation) => (
                    <Button
                      key={occupation}
                      variant={data.occupation === occupation ? "default" : "outline"}
                      onClick={() => onUpdate({ ...data, occupation })}
                      className="text-sm h-auto py-3 px-2"
                    >
                      {occupation}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tiempo de trabajo */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-medium text-gray-700 mb-4 block">
                  ¿Cuánto tiempo llevas trabajando? ⏰
                </Label>
                <div className="space-y-4">
                  <Input
                    type="number"
                    value={data.workTime || ''}
                    onChange={(e) => onUpdate({ ...data, workTime: Number(e.target.value) })}
                    placeholder="Meses de experiencia laboral"
                    className="text-lg py-6"
                  />
                  <Slider
                    value={[data.workTime]}
                    onValueChange={([value]) => onUpdate({ ...data, workTime: value })}
                    min={1}
                    max={120}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 mes</span>
                    <span>10 años</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botones de navegación */}
      <div className="flex gap-4 mt-8">
        <Button variant="outline" onClick={onPrev} className="flex-1">
          Anterior
        </Button>
        
        {currentSubStep === 2 ? (
          <Button 
            onClick={onNext} 
            disabled={!canProceed()}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {profileLevel >= 70 ? '¡Continuar! 🚀' : 'Continuar'}
          </Button>
        ) : (
          <Button 
            onClick={() => setCurrentSubStep(2)} 
            disabled={!data.creditType}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
};
