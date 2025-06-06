
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { TrendingUp } from "lucide-react";
import { ProductListView } from "./ProductListView";

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

  const handleProductSelect = (productId: string) => {
    onUpdate({ ...data, creditType: productId });
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
           data.requestedAmount >= 0 && 
           data.monthlyIncome > 0 && 
           data.occupation && 
           data.workTime > 0;
  };

  const getMotivationalMessage = () => {
    if (currentSubStep === 1) {
      return `¡Perfecto, ${personalData.firstName}! Elige el producto financiero ideal para ti 💰`;
    } else if (currentSubStep === 2) {
      return `¡Excelente elección! Ahora cuéntame sobre tu situación financiera 📊`;
    }
    return `¡Buen trabajo! Ya tienes un perfil financiero sólido 🎯`;
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
        {/* Paso 1: Selección de producto con vista de lista */}
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
                    placeholder="Ingresa el monto"
                    className="text-lg py-6"
                  />
                  <Slider
                    value={[data.requestedAmount]}
                    onValueChange={([value]) => handleAmountChange(value)}
                    min={0}
                    max={100000}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>S/ 0</span>
                    <span>S/ 100,000</span>
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
