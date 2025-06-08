
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  minAmount?: string;
  maxAmount?: string;
  term?: string;
  benefit: string;
  accessForm: string;
}

const products: Product[] = [
  {
    id: '1',
    name: 'Crédito Personal',
    description: 'Dinero rápido para tus proyectos personales y gastos imprevistos',
    icon: '💰',
    minAmount: 'S/. 1,000',
    maxAmount: 'S/. 50,000',
    term: '6 meses - 5 años',
    benefit: 'Aprobación en 24 horas',
    accessForm: 'Evaluación crediticia'
  },
  {
    id: '2',
    name: 'Crédito Vehicular',
    description: 'Financia la compra de tu vehículo nuevo o usado con las mejores tasas',
    icon: '🚗',
    minAmount: 'S/. 10,000',
    maxAmount: 'S/. 150,000',
    term: '2-7 años',
    benefit: 'Tasas desde 12% anual',
    accessForm: 'Evaluación de ingresos'
  },
  {
    id: '3',
    name: 'Crédito Hipotecario',
    description: 'Compra tu casa propia con financiamiento hasta el 90% del valor',
    icon: '🏠',
    minAmount: 'S/. 50,000',
    maxAmount: 'S/. 500,000',
    term: '5-30 años',
    benefit: 'Financia hasta el 90%',
    accessForm: 'Evaluación inmobiliaria'
  },
  {
    id: '4',
    name: 'Seguro de Vida',
    description: 'Protege a tu familia con cobertura completa ante cualquier eventualidad',
    icon: '🛡️',
    minAmount: 'S/. 50,000',
    maxAmount: 'S/. 1,000,000',
    term: 'Renovación anual',
    benefit: 'Cobertura desde S/. 50',
    accessForm: 'Evaluación médica'
  },
  {
    id: '5',
    name: 'Tarjeta de Crédito',
    description: 'Accede a crédito revolving con beneficios y promociones exclusivas',
    icon: '💳',
    minAmount: 'S/. 500',
    maxAmount: 'S/. 50,000',
    term: 'Línea permanente',
    benefit: 'Sin cuota de manejo el primer año',
    accessForm: 'Solicitud en línea'
  },
  {
    id: '6',
    name: 'Tarjeta de Débito',
    description: 'Maneja tu dinero de forma segura con acceso a cajeros y compras',
    icon: '💳',
    benefit: 'Sin costo de mantenimiento',
    accessForm: 'Apertura de cuenta',
    term: 'Sin vencimiento'
  },
  {
    id: '7',
    name: 'Seguro Vehicular',
    description: 'Protege tu vehículo contra robo, accidentes y daños a terceros',
    icon: '🚙',
    minAmount: 'S/. 2,000',
    maxAmount: 'S/. 100,000',
    term: 'Renovación anual',
    benefit: 'Cobertura todo riesgo',
    accessForm: 'Inspección vehicular'
  },
  {
    id: '8',
    name: 'Cuenta de Ahorros',
    description: 'Ahorra tu dinero con rendimientos atractivos y acceso inmediato',
    icon: '🏛️',
    minAmount: 'S/. 0',
    benefit: 'Rentabilidad hasta 4% anual',
    accessForm: 'Apertura inmediata',
    term: 'Sin plazo fijo'
  },
  {
    id: '9',
    name: 'Depósito a Plazo',
    description: 'Invierte tu dinero con tasas fijas garantizadas y mayor rentabilidad',
    icon: '📈',
    minAmount: 'S/. 1,000',
    maxAmount: 'S/. 500,000',
    term: '30 días - 5 años',
    benefit: 'Tasas hasta 6% anual',
    accessForm: 'Depósito inicial'
  },
  {
    id: '10',
    name: 'Fondos Mutuos',
    description: 'Invierte en portafolios diversificados manejados por expertos',
    icon: '📊',
    minAmount: 'S/. 100',
    maxAmount: 'Sin límite',
    term: 'Flexible',
    benefit: 'Diversificación profesional',
    accessForm: 'Perfil de inversionista'
  }
];

interface ProductsCarouselProps {
  onViewCatalog: () => void;
}

export const ProductsCarousel = ({ onViewCatalog }: ProductsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const currentProduct = products[currentIndex];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-neza-blue-800 mb-2">
          Catálogo de Productos
        </h3>
        <p className="text-neza-blue-600">
          Descubre las opciones financieras que tenemos para ti
        </p>
      </div>

      {/* Carrusel */}
      <div className="relative">
        {/* Botones de navegación */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all duration-200 border border-neza-blue-200"
          aria-label="Producto anterior"
        >
          <ChevronLeft className="w-5 h-5 text-neza-blue-600" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all duration-200 border border-neza-blue-200"
          aria-label="Siguiente producto"
        >
          <ChevronRight className="w-5 h-5 text-neza-blue-600" />
        </button>

        {/* Contenedor del carrusel */}
        <div className="mx-12 min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Card className="bg-white/90 backdrop-blur-sm border-neza-blue-200 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-6xl mb-4"
                  >
                    {currentProduct.icon}
                  </motion.div>
                  <CardTitle className="text-2xl text-neza-blue-800 mb-2">
                    {currentProduct.name}
                  </CardTitle>
                  <CardDescription className="text-base text-neza-silver-600 max-w-md mx-auto">
                    {currentProduct.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Información estructurada del producto */}
                  <div className="grid md:grid-cols-2 gap-4 text-center">
                    <div className="bg-neza-blue-50 rounded-lg p-3">
                      <div className="text-xs text-neza-blue-600 font-medium">Forma de Acceso</div>
                      <div className="text-sm text-neza-blue-800 font-semibold">
                        {currentProduct.accessForm}
                      </div>
                    </div>
                    {currentProduct.minAmount && (
                      <div className="bg-neza-blue-50 rounded-lg p-3">
                        <div className="text-xs text-neza-blue-600 font-medium">Monto Estimado</div>
                        <div className="text-sm text-neza-blue-800 font-semibold">
                          {currentProduct.minAmount} - {currentProduct.maxAmount}
                        </div>
                      </div>
                    )}
                    {currentProduct.term && (
                      <div className="bg-neza-blue-50 rounded-lg p-3">
                        <div className="text-xs text-neza-blue-600 font-medium">Plazo Estándar</div>
                        <div className="text-sm text-neza-blue-800 font-semibold">
                          {currentProduct.term}
                        </div>
                      </div>
                    )}
                    <div className="bg-neza-blue-50 rounded-lg p-3">
                      <div className="text-xs text-neza-blue-600 font-medium">Beneficio Principal</div>
                      <div className="text-sm text-neza-blue-800 font-semibold">
                        {currentProduct.benefit}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={onViewCatalog}
                      variant="outline"
                      className="flex-1 border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Catálogo Completo
                    </Button>
                    <Button className="flex-1 bg-neza-blue-600 hover:bg-neza-blue-700">
                      Solicitar Ahora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-6 space-x-2 flex-wrap">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-neza-blue-600 w-6' 
                  : 'bg-neza-blue-300 hover:bg-neza-blue-400'
              }`}
              aria-label={`Ir al producto ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
