
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsCarouselProps {
  onViewCatalog: () => void;
}

export const ProductsCarousel = ({ onViewCatalog }: ProductsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredProducts = [
    {
      id: 'credito-vehicular',
      name: 'Crédito Vehicular',
      description: 'Financia tu vehículo nuevo o usado con tasas preferenciales',
      emoji: '🚗',
      estimatedRate: '8% - 15%',
      minAmount: 'S/. 10,000',
      maxAmount: 'S/. 150,000',
      term: '2-7 años',
      category: 'Recomendado'
    },
    {
      id: 'credito-hipotecario',
      name: 'Crédito Hipotecario',
      description: 'Compra tu casa propia con las mejores condiciones del mercado',
      emoji: '🏠',
      estimatedRate: '6.5% - 12%',
      minAmount: 'S/. 50,000',
      maxAmount: 'S/. 500,000',
      term: '5-30 años',
      category: 'Más Popular'
    },
    {
      id: 'credito-personal',
      name: 'Crédito Personal',
      description: 'Dinero rápido para tus proyectos personales sin garantías',
      emoji: '💰',
      estimatedRate: '12% - 35%',
      minAmount: 'S/. 1,000',
      maxAmount: 'S/. 50,000',
      term: '6 meses - 5 años',
      category: 'Express'
    },
    {
      id: 'tarjeta-credito',
      name: 'Tarjeta de Crédito',
      description: 'Flexibilidad de pago y beneficios exclusivos',
      emoji: '💳',
      estimatedRate: '35% - 90%',
      minAmount: 'S/. 500',
      maxAmount: 'S/. 20,000',
      term: 'Renovable',
      category: 'Flexible'
    },
    {
      id: 'tarjeta-debito',
      name: 'Tarjeta de Débito',
      description: 'Accede a tu dinero de forma segura y práctica',
      emoji: '💳',
      estimatedRate: 'Sin intereses',
      minAmount: 'S/. 0',
      maxAmount: 'Según saldo',
      term: 'Permanente',
      category: 'Básico'
    },
    {
      id: 'seguro-vida',
      name: 'Seguro de Vida',
      description: 'Protege a tu familia con la mejor cobertura',
      emoji: '🛡️',
      estimatedRate: '2% - 5% anual',
      minAmount: 'S/. 10,000',
      maxAmount: 'S/. 1,000,000',
      term: 'Renovable anual',
      category: 'Protección'
    },
    {
      id: 'seguro-vehicular',
      name: 'Seguro Vehicular',
      description: 'Asegura tu vehículo contra todo riesgo',
      emoji: '🚗',
      estimatedRate: '3% - 8% anual',
      minAmount: 'Según valor',
      maxAmount: 'Hasta valor comercial',
      term: 'Renovable anual',
      category: 'Protección'
    },
    {
      id: 'cuenta-ahorros',
      name: 'Cuenta de Ahorros',
      description: 'Ahorra y haz crecer tu dinero con seguridad',
      emoji: '💰',
      estimatedRate: '1% - 3% anual',
      minAmount: 'S/. 0',
      maxAmount: 'Sin límite',
      term: 'Sin plazo',
      category: 'Ahorro'
    },
    {
      id: 'deposito-plazo',
      name: 'Depósito a Plazo',
      description: 'Invierte tu dinero a plazo fijo con alta rentabilidad',
      emoji: '📈',
      estimatedRate: '3% - 8% anual',
      minAmount: 'S/. 1,000',
      maxAmount: 'Sin límite',
      term: '30 días - 5 años',
      category: 'Inversión'
    },
    {
      id: 'fondos-mutuos',
      name: 'Fondos Mutuos',
      description: 'Invierte en portafolios diversificados de forma profesional',
      emoji: '📊',
      estimatedRate: '5% - 15% anual',
      minAmount: 'S/. 100',
      maxAmount: 'Sin límite',
      term: 'Sin plazo fijo',
      category: 'Inversión'
    },
    {
      id: 'cuenta-sueldo',
      name: 'Cuenta Sueldo',
      description: 'Recibe tu sueldo y maneja tus finanzas sin comisiones',
      emoji: '💼',
      estimatedRate: 'Sin intereses',
      minAmount: 'S/. 0',
      maxAmount: 'Sin límite',
      term: 'Permanente',
      category: 'Básico'
    }
  ];

  // Auto-advance carousel every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Más Popular': return 'bg-green-100 text-green-800';
      case 'Recomendado': return 'bg-blue-100 text-blue-800';
      case 'Express': return 'bg-orange-100 text-orange-800';
      case 'Flexible': return 'bg-pink-100 text-pink-800';
      case 'Básico': return 'bg-gray-100 text-gray-800';
      case 'Protección': return 'bg-purple-100 text-purple-800';
      case 'Ahorro': return 'bg-cyan-100 text-cyan-800';
      case 'Inversión': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? featuredProducts.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === featuredProducts.length - 1 ? 0 : currentIndex + 1);
  };

  const currentProduct = featuredProducts[currentIndex];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-neza-blue-800 mb-3">
          Productos Financieros Destacados
        </h3>
        <p className="text-neza-blue-600 text-lg max-w-3xl mx-auto">
          Los bancos compiten para ofrecerte las mejores condiciones en estos productos populares
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-xl mx-auto">
        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6 text-neza-blue-600" />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6 text-neza-blue-600" />
        </button>

        {/* Product Card - Reduced size */}
        <Card className="hover:shadow-xl transition-all duration-300 border-neza-blue-200 bg-white/80 backdrop-blur-sm mx-8 border-2">
          <CardHeader className="pb-3">
            <div className="flex flex-col items-center mb-3">
              {/* Emoji centrado - Reduced size */}
              <div className="w-16 h-16 bg-neza-blue-50 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">{currentProduct.emoji}</span>
              </div>
              <Badge className={getCategoryColor(currentProduct.category)}>
                {currentProduct.category}
              </Badge>
            </div>
            <CardTitle className="text-lg text-neza-blue-800 text-center">{currentProduct.name}</CardTitle>
            <CardDescription className="text-neza-silver-600 text-center text-sm">
              {currentProduct.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-center">
                <span className="font-medium text-neza-blue-700">Tasa estimada:</span>
                <div className="text-neza-silver-600 text-xs">{currentProduct.estimatedRate}</div>
              </div>
              <div className="text-center">
                <span className="font-medium text-neza-blue-700">Plazo:</span>
                <div className="text-neza-silver-600 text-xs">{currentProduct.term}</div>
              </div>
            </div>
            
            <div className="text-center">
              <span className="font-medium text-neza-blue-700 text-sm">Rango:</span>
              <div className="text-neza-silver-600 text-xs">{currentProduct.minAmount} - {currentProduct.maxAmount}</div>
            </div>

            {/* Botones dentro del cuadro */}
            <div className="flex flex-col gap-2 pt-3">
              <Button 
                className="w-full bg-neza-blue-600 hover:bg-neza-blue-700 text-white text-sm py-2"
                onClick={() => {
                  const interactiveSection = document.getElementById('interactive-experience');
                  if (interactiveSection) {
                    interactiveSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Solicitar {currentProduct.name}
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50 text-sm py-2"
                onClick={onViewCatalog}
              >
                Ver Catálogo Completo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Carousel Indicators - All 11 dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-neza-blue-600 scale-110' 
                  : 'bg-neza-blue-300 hover:bg-neza-blue-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
