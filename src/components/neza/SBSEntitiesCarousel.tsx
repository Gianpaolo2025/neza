
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Shield, Star } from "lucide-react";

// Mock data for display since sbsEntities only has entities without the display properties
const sbsEntitiesData = [
  {
    name: "Banco de Crédito del Perú",
    logo: "/placeholder.svg",
    rating: 4.5,
    specialties: ["Préstamos Personales", "Hipotecarios"],
    type: "Banco"
  },
  {
    name: "BBVA",
    logo: "/placeholder.svg", 
    rating: 4.3,
    specialties: ["Créditos Vehiculares", "Empresariales"],
    type: "Banco"
  },
  {
    name: "Interbank",
    logo: "/placeholder.svg",
    rating: 4.4,
    specialties: ["Tarjetas de Crédito", "Préstamos"],
    type: "Banco"
  },
  {
    name: "Scotiabank",
    logo: "/placeholder.svg",
    rating: 4.2,
    specialties: ["Créditos Hipotecarios", "Empresariales"],
    type: "Banco"
  },
  {
    name: "Mibanco",
    logo: "/placeholder.svg",
    rating: 4.1,
    specialties: ["Microcréditos", "PYME"],
    type: "Banco"
  },
  {
    name: "Financiera Confianza",
    logo: "/placeholder.svg",
    rating: 4.0,
    specialties: ["Préstamos Personales", "Vehiculares"],
    type: "Financiera"
  },
  {
    name: "Caja Arequipa",
    logo: "/placeholder.svg",
    rating: 3.9,
    specialties: ["Microcréditos", "Ahorro"],
    type: "Cooperativa"
  },
  {
    name: "Caja Cusco",
    logo: "/placeholder.svg",
    rating: 3.8,
    specialties: ["Créditos PYME", "Ahorro"],
    type: "Cooperativa"
  }
];

export const SBSEntitiesCarousel = () => {
  return (
    <div className="bg-neza-blue-800 text-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-neza-blue-400" />
            <h3 className="text-2xl font-bold">Entidades Supervisadas por la SBS y SMV</h3>
          </div>
          <p className="text-neza-blue-200 max-w-2xl mx-auto">
            Más de 30 entidades financieras autorizadas compiten para ofrecerte las mejores condiciones
          </p>
          <p className="text-neza-blue-300 text-sm mt-2">
            No todas las entidades están supervisadas por la Superintendencia de Banca, Seguros y AFP (SBS) ni por la Superintendencia del Mercado de Valores (SMV).
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {sbsEntitiesData.map((entity, index) => (
              <CarouselItem key={index} className="pl-1 md:basis-1/3 lg:basis-1/4">
                <Card className="bg-white/10 backdrop-blur-sm border-neza-blue-600 hover:bg-white/20 transition-all duration-200">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-3">
                      <img
                        src={entity.logo}
                        alt={entity.name}
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="w-12 h-12 bg-neza-blue-100 rounded flex items-center justify-center text-neza-blue-600 font-bold text-xl hidden">
                        {entity.name.charAt(0)}
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-white text-sm mb-2 leading-tight">
                      {entity.name}
                    </h4>
                    
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < entity.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-neza-blue-200 ml-1">
                        {entity.rating.toFixed(1)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-neza-blue-300 mb-2">
                      {entity.specialties.join(", ")}
                    </p>
                    
                    <div className="flex justify-center">
                      <span className={`
                        inline-block px-2 py-1 rounded-full text-xs font-medium
                        ${entity.type === 'Banco' 
                          ? 'bg-neza-blue-500 text-white' 
                          : entity.type === 'Cooperativa'
                          ? 'bg-green-500 text-white'
                          : 'bg-purple-500 text-white'
                        }
                      `}>
                        {entity.type}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white border-white hover:bg-white/20" />
          <CarouselNext className="text-white border-white hover:bg-white/20" />
        </Carousel>
      </div>
    </div>
  );
};
