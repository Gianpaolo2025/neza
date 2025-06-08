
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Car, CreditCard, PiggyBank, Shield, TrendingUp, ArrowRight } from "lucide-react";

interface ProductsCarouselProps {
  onViewCatalog: () => void;
}

export const ProductsCarousel = ({ onViewCatalog }: ProductsCarouselProps) => {
  const featuredProducts = [
    {
      id: 'credito-hipotecario',
      name: 'Crédito Hipotecario',
      description: 'Compra tu casa propia con las mejores condiciones del mercado',
      icon: <Home className="w-8 h-8 text-neza-blue-600" />,
      estimatedRate: '6.5% - 12%',
      minAmount: 'S/. 50,000',
      maxAmount: 'S/. 500,000',
      term: '5-30 años',
      highlights: ['Financia hasta 90%', 'Sin penalidad por prepago', 'Tasa fija o variable'],
      category: 'Más Popular'
    },
    {
      id: 'credito-vehicular',
      name: 'Crédito Vehicular',
      description: 'Financia tu vehículo nuevo o usado con tasas preferenciales',
      icon: <Car className="w-8 h-8 text-neza-blue-600" />,
      estimatedRate: '8% - 15%',
      minAmount: 'S/. 10,000',
      maxAmount: 'S/. 150,000',
      term: '2-7 años',
      highlights: ['Aprobación rápida', 'Cobertura integral', 'Vehículos 0km y usados'],
      category: 'Recomendado'
    },
    {
      id: 'credito-personal',
      name: 'Crédito Personal',
      description: 'Dinero rápido para tus proyectos personales sin garantías',
      icon: <CreditCard className="w-8 h-8 text-neza-blue-600" />,
      estimatedRate: '12% - 35%',
      minAmount: 'S/. 1,000',
      maxAmount: 'S/. 50,000',
      term: '6 meses - 5 años',
      highlights: ['Sin garantía', 'Aprobación en 24h', 'Uso libre'],
      category: 'Express'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Más Popular': return 'bg-green-100 text-green-800';
      case 'Recomendado': return 'bg-blue-100 text-blue-800';
      case 'Express': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

      <div className="grid gap-6 md:grid-cols-3">
        {featuredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-xl transition-all duration-300 border-neza-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-3">
                {product.icon}
                <Badge className={getCategoryColor(product.category)}>
                  {product.category}
                </Badge>
              </div>
              <CardTitle className="text-xl text-neza-blue-800">{product.name}</CardTitle>
              <CardDescription className="text-neza-silver-600">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-neza-blue-700">Tasa estimada:</span>
                  <div className="text-neza-silver-600">{product.estimatedRate}</div>
                </div>
                <div>
                  <span className="font-medium text-neza-blue-700">Plazo:</span>
                  <div className="text-neza-silver-600">{product.term}</div>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-neza-blue-700">Rango:</span>
                  <div className="text-neza-silver-600">{product.minAmount} - {product.maxAmount}</div>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-neza-blue-700 text-sm">Beneficios principales:</span>
                <ul className="mt-2 space-y-1">
                  {product.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center text-sm text-neza-silver-600">
                      <span className="w-1.5 h-1.5 bg-neza-blue-500 rounded-full mr-2"></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botones alineados a la izquierda como estaba originalmente */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
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
    </div>
  );
};
