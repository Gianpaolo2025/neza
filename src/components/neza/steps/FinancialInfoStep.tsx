import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Home, Car, Briefcase, GraduationCap, CreditCard, TrendingUp, PiggyBank, Clock, Building } from "lucide-react";

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

const productCategories = [
  {
    id: 'deposits',
    title: 'Productos de Depósito',
    subtitle: 'Ahorra y haz crecer tu dinero',
    icon: PiggyBank,
    color: 'from-green-500 to-emerald-600',
    products: [
      { id: 'ahorro', title: 'Cuenta de Ahorros', minAmount: 0, maxAmount: 0 },
      { id: 'corriente', title: 'Cuenta Corriente', minAmount: 0, maxAmount: 0 },
      { id: 'plazo-fijo', title: 'Depósito a Plazo', minAmount: 1000, maxAmount: 1000000 },
      { id: 'cts', title: 'Depósito CTS', minAmount: 0, maxAmount: 0 }
    ]
  },
  {
    id: 'credits',
    title: 'Créditos y Préstamos',
    subtitle: 'Financia tus proyectos',
    icon: CreditCard,
    color: 'from-blue-500 to-blue-600',
    products: [
      { id: 'personal', title: 'Crédito Personal', minAmount: 1000, maxAmount: 50000 },
      { id: 'consumo', title: 'Crédito de Consumo', minAmount: 500, maxAmount: 30000 },
      { id: 'tarjeta-credito', title: 'Tarjeta de Crédito', minAmount: 500, maxAmount: 20000 }
    ]
  },
  {
    id: 'specialized',
    title: 'Créditos Especializados',
    subtitle: 'Para necesidades específicas',
    icon: Home,
    color: 'from-purple-500 to-purple-600',
    products: [
      { id: 'hipotecario', title: 'Crédito Hipotecario', minAmount: 50000, maxAmount: 800000 },
      { id: 'vehicular', title: 'Crédito Vehicular', minAmount: 5000, maxAmount: 200000 },
      { id: 'empresarial', title: 'Crédito Empresarial', minAmount: 10000, maxAmount: 500000 }
    ]
  },
  {
    id: 'education',
    title: 'Crédito Educativo',
    subtitle: 'Invierte en tu futuro',
    icon: GraduationCap,
    color: 'from-orange-500 to-orange-600',
    products: [
      { id: 'educativo', title: 'Crédito Educativo', minAmount: 2000, maxAmount: 100000 }
    ]
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [profileLevel, setProfileLevel] = useState(0);

  const selectedProduct = productCategories
    .flatMap(cat => cat.products)
    .find(product => product.id === data.creditType);

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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentSubStep(2);
  };

  const handleProductSelect = (productId: string) => {
    const product = productCategories
      .flatMap(cat => cat.products)
      .find(p => p.id === productId)!;
    
    onUpdate({ 
      ...data, 
      creditType: productId,
      requestedAmount: Math.max(data.requestedAmount, product.minAmount)
    });
    setCurrentSubStep(3);
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
      return `¡Perfecto, ${personalData.firstName}! ¿Qué tipo de producto financiero necesitas? 💰`;
    } else if (currentSubStep === 2) {
      return `¡Excelente elección! Ahora elige el producto específico 🎯`;
    } else if (currentSubStep === 3) {
      return `¡Perfecto! Ahora cuéntame sobre tu situación financiera 📊`;
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
        {/* Paso 1: Selección de categoría */}
        {currentSubStep === 1 && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {category.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {category.subtitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {category.products.length} productos disponibles
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Paso 2: Selección de producto específico */}
        {currentSubStep === 2 && selectedCategory && (
          <motion.div
            key="products"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentSubStep(1)}
                className="mb-4"
              >
                ← Volver a categorías
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productCategories
                .find(cat => cat.id === selectedCategory)
                ?.products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
                      onClick={() => handleProductSelect(product.id)}
                    >
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {product.title}
                        </h3>
                        {product.maxAmount > 0 && (
                          <p className="text-xs text-gray-500">
                            Desde S/ {product.minAmount.toLocaleString()} hasta S/ {product.maxAmount.toLocaleString()}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Paso 3: Información detallada */}
        {currentSubStep === 3 && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            {/* Monto solicitado - solo si aplica */}
            {selectedProduct && selectedProduct.maxAmount > 0 && (
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
                      placeholder={`Mínimo S/ ${selectedProduct.minAmount}`}
                      className="text-lg py-6"
                    />
                    <Slider
                      value={[data.requestedAmount]}
                      onValueChange={([value]) => handleAmountChange(value)}
                      min={selectedProduct.minAmount}
                      max={selectedProduct.maxAmount}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>S/ {selectedProduct.minAmount.toLocaleString()}</span>
                      <span>S/ {selectedProduct.maxAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resto de campos - keep existing code */}
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
        
        {currentSubStep === 3 ? (
          <Button 
            onClick={onNext} 
            disabled={!canProceed()}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {profileLevel >= 70 ? '¡Continuar! 🚀' : 'Continuar'}
          </Button>
        ) : (
          <Button 
            onClick={() => currentSubStep === 1 ? setCurrentSubStep(2) : setCurrentSubStep(3)} 
            disabled={currentSubStep === 1 ? !selectedCategory : !data.creditType}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
};
