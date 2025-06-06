
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Shield, Clock, DollarSign, CheckCircle } from "lucide-react";

interface Product {
  id: string;
  title: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  rate?: number;
  term?: string;
  benefits: string[];
  recommended?: boolean;
  popularity: number;
}

interface ProductListViewProps {
  products: Product[];
  onSelect: (productId: string) => void;
  selectedProduct?: string;
}

const productData: Product[] = [
  // Productos de Depósito (ordenados por popularidad)
  {
    id: 'ahorro',
    title: 'Cuenta de Ahorros Digital',
    category: 'Depósitos',
    minAmount: 0,
    maxAmount: 0,
    rate: 1.5,
    benefits: ['Sin comisiones', 'Banca móvil', 'Transferencias gratuitas'],
    recommended: true,
    popularity: 95
  },
  {
    id: 'corriente',
    title: 'Cuenta Corriente Empresarial',
    category: 'Depósitos',
    minAmount: 500,
    maxAmount: 0,
    rate: 0.5,
    benefits: ['Chequera incluida', 'Línea de crédito', 'Banca corporativa'],
    popularity: 80
  },
  {
    id: 'plazo-fijo',
    title: 'Depósito a Plazo Fijo',
    category: 'Depósitos',
    minAmount: 1000,
    maxAmount: 1000000,
    rate: 8.5,
    term: '12 meses',
    benefits: ['Tasa garantizada', 'Renovación automática', 'Seguro FOGADE'],
    popularity: 85
  },
  {
    id: 'cts',
    title: 'Depósito CTS',
    category: 'Depósitos',
    minAmount: 0,
    maxAmount: 0,
    rate: 4.0,
    benefits: ['Beneficio laboral', 'Rentabilidad garantizada', 'Disponibilidad parcial'],
    popularity: 70
  },
  
  // Créditos (ordenados por demanda)
  {
    id: 'personal',
    title: 'Crédito Personal Digital',
    category: 'Créditos',
    minAmount: 1000,
    maxAmount: 50000,
    rate: 15.9,
    term: 'hasta 60 meses',
    benefits: ['Aprobación rápida', 'Sin garantías', 'Uso libre'],
    recommended: true,
    popularity: 92
  },
  {
    id: 'consumo',
    title: 'Crédito de Consumo',
    category: 'Créditos',
    minAmount: 500,
    maxAmount: 30000,
    rate: 18.5,
    term: 'hasta 36 meses',
    benefits: ['Para compras específicas', 'Tasa competitiva', 'Proceso simple'],
    popularity: 88
  },
  {
    id: 'tarjeta-credito',
    title: 'Tarjeta de Crédito Platinum',
    category: 'Créditos',
    minAmount: 500,
    maxAmount: 20000,
    rate: 22.0,
    benefits: ['Cashback 2%', 'Millas aéreas', 'Seguro de viaje'],
    popularity: 85
  },
  {
    id: 'hipotecario',
    title: 'Crédito Hipotecario MiVivienda',
    category: 'Créditos Especializados',
    minAmount: 50000,
    maxAmount: 800000,
    rate: 7.5,
    term: 'hasta 30 años',
    benefits: ['Tasa preferencial', 'Bono del Estado', 'Seguro desgravamen'],
    popularity: 75
  },
  {
    id: 'vehicular',
    title: 'Crédito Vehicular',
    category: 'Créditos Especializados',
    minAmount: 5000,
    maxAmount: 200000,
    rate: 12.5,
    term: 'hasta 8 años',
    benefits: ['Financiamiento hasta 90%', 'Seguro vehicular', 'GPS incluido'],
    popularity: 78
  },
  {
    id: 'empresarial',
    title: 'Crédito para Empresas',
    category: 'Créditos Especializados',
    minAmount: 10000,
    maxAmount: 500000,
    rate: 14.0,
    term: 'hasta 5 años',
    benefits: ['Capital de trabajo', 'Tasa empresarial', 'Asesoría financiera'],
    popularity: 60
  },
  {
    id: 'educativo',
    title: 'Crédito Educativo',
    category: 'Educación',
    minAmount: 2000,
    maxAmount: 100000,
    rate: 11.5,
    term: 'hasta 10 años',
    benefits: ['Período de gracia', 'Tasa estudiantil', 'Convenios educativos'],
    popularity: 65
  }
];

export const ProductListView = ({ products, onSelect, selectedProduct }: ProductListViewProps) => {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Ordenar productos por popularidad (descendente) y recomendados primero
  const sortedProducts = productData
    .sort((a, b) => {
      if (a.recommended && !b.recommended) return -1;
      if (!a.recommended && b.recommended) return 1;
      return b.popularity - a.popularity;
    });

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-600';
    if (popularity >= 80) return 'text-blue-600';
    if (popularity >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getPopularityText = (popularity: number) => {
    if (popularity >= 90) return 'Muy Popular';
    if (popularity >= 80) return 'Popular';
    if (popularity >= 70) return 'Demandado';
    return 'Disponible';
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Productos Financieros Disponibles
        </h3>
        <p className="text-gray-600">
          Ordenados por popularidad y conveniencia para tu perfil
        </p>
      </div>

      {sortedProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onHoverStart={() => setHoveredProduct(product.id)}
          onHoverEnd={() => setHoveredProduct(null)}
        >
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 ${
              product.recommended 
                ? 'border-l-green-500 bg-green-50/50' 
                : 'border-l-blue-300'
            } ${
              selectedProduct === product.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelect(product.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Información principal */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-gray-800">
                      {product.title}
                    </h4>
                    
                    {product.recommended && (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <Star className="w-3 h-3 mr-1" />
                        Recomendado
                      </Badge>
                    )}
                    
                    <Badge variant="outline" className={getPopularityColor(product.popularity)}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {getPopularityText(product.popularity)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                  
                  {/* Beneficios principales */}
                  <div className="flex flex-wrap gap-2">
                    {product.benefits.slice(0, 3).map((benefit, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Información financiera */}
                <div className="text-right ml-6">
                  <div className="space-y-2">
                    {product.rate && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-bold text-green-600">
                          {product.rate}% TEA
                        </span>
                      </div>
                    )}
                    
                    {product.maxAmount > 0 && (
                      <div className="text-sm text-gray-600">
                        <div>Desde S/ {product.minAmount.toLocaleString()}</div>
                        <div>Hasta S/ {product.maxAmount.toLocaleString()}</div>
                      </div>
                    )}
                    
                    {product.term && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{product.term}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Shield className="w-3 h-3" />
                      <span>Garantizado SBS</span>
                    </div>
                  </div>
                  
                  {selectedProduct === product.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <CheckCircle className="w-6 h-6 text-blue-600 mx-auto" />
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Información expandida en hover */}
              {hoveredProduct === product.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">Todos los beneficios:</h5>
                      <ul className="space-y-1">
                        {product.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-1 text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">Requisitos:</h5>
                      <ul className="space-y-1 text-gray-600">
                        <li>• DNI vigente</li>
                        <li>• Ingresos demostrables</li>
                        <li>• Evaluación crediticia</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">Tiempo de aprobación:</h5>
                      <p className="text-gray-600">24-48 horas hábiles</p>
                      
                      <Button 
                        size="sm" 
                        className="mt-2 w-full bg-blue-600 hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(product.id);
                        }}
                      >
                        Seleccionar este producto
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
