
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Car, CreditCard, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsCarouselProps {
  onViewCatalog: () => void;
}

export const ProductsCarousel = ({ onViewCatalog }: ProductsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredProducts = [
    {
      id: 'credito-hipotecario',
      name: 'Crédito Hipotecario',
      description: 'Compra tu casa propia con las mejores condiciones del mercado',
      icon: Home,
      estimatedRate: '6.5% - 12%',
      minAmount: 'S/. 50,000',
      maxAmount: 'S/. 500,000',
      term: '5-30 años',
      category: 'Más Popular'
    },
    {
      id: 'credito-vehicular',
      name: 'Crédito Vehicular',
      description: 'Financia tu vehículo nuevo o usado con tasas preferenciales',
      icon: Car,
      estimatedRate: '8% - 15%',
      minAmount: 'S/. 10,000',
      maxAmount: 'S/. 150,000',
      term: '2-7 años',
      category: 'Recomendado'
    },
    {
      id: 'credito-personal',
      name: 'Crédito Personal',
      description: 'Dinero rápido para tus proyectos personales sin garantías',
      icon: CreditCard,
      estimatedRate: '12% - 35%',
      minAmount: 'S/. 1,000',
      maxAmount: 'S/. 50,000',
      term: '6 meses - 5 años',
      category: 'Express'
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
  const IconComponent = currentProduct.icon;

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
      <div className="relative max-w-2xl mx-auto">
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

        {/* Product Card */}
        <Card className="hover:shadow-xl transition-all duration-300 border-neza-blue-200 bg-white/80 backdrop-blur-sm mx-8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-neza-blue-100 rounded-lg flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-neza-blue-600" />
              </div>
              <Badge className={getCategoryColor(currentProduct.category)}>
                {currentProduct.category}
              </Badge>
            </div>
            <CardTitle className="text-xl text-neza-blue-800">{currentProduct.name}</CardTitle>
            <CardDescription className="text-neza-silver-600">
              {currentProduct.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-neza-blue-700">Tasa estimada:</span>
                <div className="text-neza-silver-600">{currentProduct.estimatedRate}</div>
              </div>
              <div>
                <span className="font-medium text-neza-blue-700">Plazo:</span>
                <div className="text-neza-silver-600">{currentProduct.term}</div>
              </div>
            </div>
            
            <div>
              <span className="font-medium text-neza-blue-700 text-sm">Rango:</span>
              <div className="text-neza-silver-600">{currentProduct.minAmount} - {currentProduct.maxAmount}</div>
            </div>
          </CardContent>
        </Card>

        {/* Carousel Indicators */}
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

      {/* Centered Buttons in Aesthetic Box */}
      <div className="flex justify-center pt-6">
        <Card className="bg-gradient-to-r from-neza-blue-50 to-white border-neza-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button 
                size="lg"
                className="bg-neza-blue-600 hover:bg-neza-blue-700 text-white px-8 py-4 text-lg font-semibold w-full sm:w-auto"
                onClick={() => {
                  // Scroll to the interactive experience section
                  const interactiveSection = document.getElementById('interactive-experience');
                  if (interactiveSection) {
                    interactiveSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Home className="w-5 h-5 mr-2" />
                Solicitar Crédito Hipotecario
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={onViewCatalog}
                className="border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50 px-8 py-4 text-lg font-semibold w-full sm:w-auto"
              >
                Ver Catálogo Completo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
