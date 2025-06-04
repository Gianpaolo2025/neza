
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Home, Car, Shield, PiggyBank, TrendingUp, Users } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  estimatedTerm: string;
  risk: 'bajo' | 'medio' | 'alto';
  mainBenefit: string;
  requirements: string[];
  category: string;
  icon: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Crédito Vehicular',
    description: 'Financia la compra de tu vehículo nuevo o usado',
    minAmount: 10000,
    maxAmount: 150000,
    estimatedTerm: '2-7 años',
    risk: 'medio',
    mainBenefit: 'Tasas competitivas desde 12% anual',
    requirements: ['Ingresos demostrables', 'Cuota inicial 20%', 'Seguro vehicular'],
    category: 'creditos',
    icon: '🚗'
  },
  {
    id: '2',
    name: 'Crédito Hipotecario',
    description: 'Compra tu casa propia con las mejores condiciones',
    minAmount: 50000,
    maxAmount: 500000,
    estimatedTerm: '5-30 años',
    risk: 'bajo',
    mainBenefit: 'Financia hasta el 90% del valor',
    requirements: ['Ingresos estables', 'Cuota inicial 10%', 'Avalúo inmobiliario'],
    category: 'creditos',
    icon: '🏠'
  },
  {
    id: '3',
    name: 'Crédito Personal',
    description: 'Dinero rápido para tus proyectos personales',
    minAmount: 1000,
    maxAmount: 50000,
    estimatedTerm: '6 meses - 5 años',
    risk: 'medio',
    mainBenefit: 'Aprobación en 24 horas',
    requirements: ['DNI vigente', 'Ingresos S/. 1,500', 'Sin deudas morosas'],
    category: 'creditos',
    icon: '💰'
  },
  {
    id: '4',
    name: 'Tarjeta de Crédito',
    description: 'Compra ahora y paga después con beneficios',
    minAmount: 500,
    maxAmount: 20000,
    estimatedTerm: 'Renovable',
    risk: 'medio',
    mainBenefit: 'Cashback hasta 3% en compras',
    requirements: ['Ingresos S/. 1,200', 'Buen historial crediticio'],
    category: 'tarjetas',
    icon: '💳'
  },
  {
    id: '5',
    name: 'Tarjeta de Débito',
    description: 'Accede a tu dinero desde cualquier lugar',
    minAmount: 0,
    maxAmount: 0,
    estimatedTerm: 'Indefinido',
    risk: 'bajo',
    mainBenefit: 'Sin comisiones en cajeros propios',
    requirements: ['Cuenta de ahorros activa', 'DNI vigente'],
    category: 'tarjetas',
    icon: '💳'
  },
  {
    id: '6',
    name: 'Seguro de Vida',
    description: 'Protege a tu familia ante cualquier eventualidad',
    minAmount: 10000,
    maxAmount: 200000,
    estimatedTerm: '1-30 años',
    risk: 'bajo',
    mainBenefit: 'Cobertura inmediata desde el primer día',
    requirements: ['Examen médico', 'Declaración de salud'],
    category: 'seguros',
    icon: '🛡️'
  },
  {
    id: '7',
    name: 'Seguro Vehicular',
    description: 'Protección completa para tu vehículo',
    minAmount: 500,
    maxAmount: 5000,
    estimatedTerm: '1 año renovable',
    risk: 'bajo',
    mainBenefit: 'Asistencia 24/7 en carretera',
    requirements: ['Vehículo con tarjeta de propiedad', 'Revisión técnica'],
    category: 'seguros',
    icon: '🚗'
  },
  {
    id: '8',
    name: 'Cuenta de Ahorros',
    description: 'Guarda tu dinero y gana intereses',
    minAmount: 50,
    maxAmount: 0,
    estimatedTerm: 'Indefinido',
    risk: 'bajo',
    mainBenefit: 'Rendimiento anual hasta 4%',
    requirements: ['DNI vigente', 'Depósito mínimo S/. 50'],
    category: 'ahorros',
    icon: '🏦'
  },
  {
    id: '9',
    name: 'Depósitos a Plazo',
    description: 'Invierte tu dinero con rentabilidad garantizada',
    minAmount: 1000,
    maxAmount: 100000,
    estimatedTerm: '30 días - 2 años',
    risk: 'bajo',
    mainBenefit: 'Tasas fijas hasta 6% anual',
    requirements: ['Monto mínimo S/. 1,000', 'Plazo mínimo 30 días'],
    category: 'inversiones',
    icon: '📈'
  },
  {
    id: '10',
    name: 'Fondos Mutuos',
    description: 'Diversifica tus inversiones con profesionales',
    minAmount: 100,
    maxAmount: 50000,
    estimatedTerm: 'Variable',
    risk: 'alto',
    mainBenefit: 'Gestión profesional de cartera',
    requirements: ['Perfil de inversionista', 'Monto mínimo S/. 100'],
    category: 'inversiones',
    icon: '📊'
  }
];

const categories = [
  { value: 'todos', label: 'Todos los productos' },
  { value: 'creditos', label: 'Créditos' },
  { value: 'tarjetas', label: 'Tarjetas' },
  { value: 'seguros', label: 'Seguros' },
  { value: 'ahorros', label: 'Ahorros' },
  { value: 'inversiones', label: 'Inversiones' }
];

const riskLevels = [
  { value: 'todos', label: 'Todos los riesgos' },
  { value: 'bajo', label: 'Riesgo Bajo' },
  { value: 'medio', label: 'Riesgo Medio' },
  { value: 'alto', label: 'Riesgo Alto' }
];

interface ProductCatalogProps {
  onBack: () => void;
}

export const ProductCatalog = ({ onBack }: ProductCatalogProps) => {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedRisk, setSelectedRisk] = useState('todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'todos' || product.category === selectedCategory;
    const riskMatch = selectedRisk === 'todos' || product.risk === selectedRisk;
    return categoryMatch && riskMatch;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'bajo': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'alto': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount: number) => {
    if (amount === 0) return 'N/A';
    return `S/. ${amount.toLocaleString()}`;
  };

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedProduct(null)}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-2xl font-bold text-emerald-800">Detalles del Producto</h1>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{selectedProduct.icon}</span>
                <div>
                  <CardTitle className="text-2xl text-emerald-800">{selectedProduct.name}</CardTitle>
                  <CardDescription className="text-lg">{selectedProduct.description}</CardDescription>
                </div>
              </div>
              <Badge className={getRiskColor(selectedProduct.risk)}>
                Riesgo {selectedProduct.risk}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-emerald-800 mb-2">Montos</h3>
                  <p className="text-sm text-gray-600">
                    Desde {formatAmount(selectedProduct.minAmount)} hasta {formatAmount(selectedProduct.maxAmount)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800 mb-2">Plazo</h3>
                  <p className="text-sm text-gray-600">{selectedProduct.estimatedTerm}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-emerald-800 mb-2">Beneficio Principal</h3>
                <p className="text-gray-700">{selectedProduct.mainBenefit}</p>
              </div>

              <div>
                <h3 className="font-semibold text-emerald-800 mb-2">Requisitos</h3>
                <ul className="space-y-1">
                  {selectedProduct.requirements.map((req, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                Solicitar Producto
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-emerald-800">Leyenda Financiera</h1>
            <p className="text-emerald-600">Descubre todos nuestros productos</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedRisk} onValueChange={setSelectedRisk}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por riesgo" />
            </SelectTrigger>
            <SelectContent>
              {riskLevels.map(risk => (
                <SelectItem key={risk.value} value={risk.value}>
                  {risk.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map(product => (
            <Card 
              key={product.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{product.icon}</span>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-emerald-800">{product.name}</CardTitle>
                    <Badge className={`${getRiskColor(product.risk)} mt-1`} variant="secondary">
                      {product.risk}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-sm">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-emerald-700">Monto: </span>
                    <span className="text-gray-600">
                      {formatAmount(product.minAmount)} - {formatAmount(product.maxAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-700">Plazo: </span>
                    <span className="text-gray-600">{product.estimatedTerm}</span>
                  </div>
                  <div className="pt-2">
                    <span className="font-medium text-emerald-700">Beneficio: </span>
                    <span className="text-gray-600 text-xs">{product.mainBenefit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos con los filtros seleccionados</p>
          </div>
        )}
      </div>
    </div>
  );
};
