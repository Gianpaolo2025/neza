
import { Card, CardContent } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Shield, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

// Lista de 41 entidades financieras supervisadas por la SBS
const sbsEntitiesData = [
  // Bancos
  {
    name: "ALFIN BANCO",
    specialties: ["Créditos PYME", "Financiamiento"],
    type: "Banco"
  },
  {
    name: "BBVA",
    specialties: ["Créditos Vehiculares", "Empresariales"],
    type: "Banco"
  },
  {
    name: "BANCO BCI",
    specialties: ["Banca Empresarial", "Corporativa"],
    type: "Banco"
  },
  {
    name: "BANCOM",
    specialties: ["Microfinanzas", "PYME"],
    type: "Banco"
  },
  {
    name: "BANCO DE CRÉDITO",
    specialties: ["Préstamos Personales", "Hipotecarios"],
    type: "Banco"
  },
  {
    name: "BANCO DE LA NACIÓN",
    specialties: ["Servicios Públicos", "Inclusión Financiera"],
    type: "Banco"
  },
  {
    name: "BANCO FALABELLA",
    specialties: ["Tarjetas", "Créditos de Consumo"],
    type: "Banco"
  },
  {
    name: "BANCO GNB",
    specialties: ["Banca Personal", "Empresarial"],
    type: "Banco"
  },
  {
    name: "BANBIF",
    specialties: ["Financiamiento", "Inversión"],
    type: "Banco"
  },
  {
    name: "INTERBANK",
    specialties: ["Tarjetas de Crédito", "Préstamos"],
    type: "Banco"
  },
  {
    name: "BANCO PICHINCHA",
    specialties: ["Banca Personal", "PYME"],
    type: "Banco"
  },
  {
    name: "BANCO RIPLEY",
    specialties: ["Tarjetas", "Préstamos Personales"],
    type: "Banco"
  },
  {
    name: "SANTANDER PERÚ",
    specialties: ["Créditos", "Inversiones"],
    type: "Banco"
  },
  {
    name: "BANK OF CHINA (PERÚ)",
    specialties: ["Comercio Internacional", "Corporativo"],
    type: "Banco"
  },
  {
    name: "CITIBANK DEL PERÚ",
    specialties: ["Banca Privada", "Corporativa"],
    type: "Banco"
  },
  {
    name: "COMPARTAMOS BANCO",
    specialties: ["Microfinanzas", "Inclusión"],
    type: "Banco"
  },
  {
    name: "ICBC PERU BANK S.A.",
    specialties: ["Comercio", "Inversión"],
    type: "Banco"
  },
  {
    name: "MIBANCO",
    specialties: ["Microcréditos", "PYME"],
    type: "Banco"
  },
  {
    name: "BANCO SANTANDER CONSUMO",
    specialties: ["Créditos Consumo", "Tarjetas"],
    type: "Banco"
  },
  {
    name: "SCOTIABANK PERÚ",
    specialties: ["Créditos Hipotecarios", "Empresariales"],
    type: "Banco"
  },
  // Financieras
  {
    name: "FINANCIERA CONFIANZA",
    specialties: ["Préstamos Personales", "Vehiculares"],
    type: "Financiera"
  },
  {
    name: "FINANCIERA EFECTIVA",
    specialties: ["Microcréditos", "PYME"],
    type: "Financiera"
  },
  {
    name: "FINANCIERA OH",
    specialties: ["Créditos Personales", "Consumo"],
    type: "Financiera"
  },
  {
    name: "FINANCIERA PROEMPRESA",
    specialties: ["PYME", "Empresariales"],
    type: "Financiera"
  },
  {
    name: "FINANCIERA QAPAQ",
    specialties: ["Microfinanzas", "Inclusión"],
    type: "Financiera"
  },
  {
    name: "FINANCIERA SURGIR",
    specialties: ["Microcréditos", "Rural"],
    type: "Financiera"
  },
  // Cajas Municipales
  {
    name: "Caja Municipal CUSCO",
    specialties: ["Créditos PYME", "Ahorro"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Municipal AREQUIPA",
    specialties: ["Microcréditos", "Ahorro"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Municipal DEL SANTA",
    specialties: ["PYME", "Microfinanzas"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Municipal HUANCAYO",
    specialties: ["Créditos", "Ahorro"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Municipal ICA",
    specialties: ["PYME", "Consumo"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Municipal MAYNAS",
    specialties: ["Microcréditos", "Rural"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Municipal PAITA",
    specialties: ["PYME", "Pesquero"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Municipal PIURA",
    specialties: ["Agropecuario", "PYME"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Municipal TACNA",
    specialties: ["Comercio", "Frontera"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Municipal TRUJILLO",
    specialties: ["PYME", "Agroindustria"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Municipal LIMA",
    specialties: ["Microfinanzas", "Urbano"],
    type: "Caja Municipal"
  },
  // Cajas Rurales
  {
    name: "CRAC CENCOSUD SCOTIA",
    specialties: ["Retail", "Consumo"],
    type: "Caja Rural"
  },
  {
    name: "CRAC LOS ANDES",
    specialties: ["Agropecuario", "Rural"],
    type: "Caja Rural"
  },
  {
    name: "CRAC DEL CENTRO",
    specialties: ["Agrícola", "PYME Rural"],
    type: "Caja Rural"
  },
  {
    name: "CRAC PRYMERA",
    specialties: ["Microfinanzas", "Rural"],
    type: "Caja Rural"
  },
  {
    name: "CRAC INCASUR",
    specialties: ["Agropecuario", "Sur"],
    type: "Caja Rural"
  }
];

// Función para aleatorizar el orden
const shuffleArray = (array: any[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Función para obtener colores por tipo de entidad
const getEntityTypeColor = (type: string) => {
  switch (type) {
    case 'Banco':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-300'
      };
    case 'Caja Municipal':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-300'
      };
    case 'Financiera':
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-300'
      };
    case 'Caja Rural':
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-300'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-300'
      };
  }
};

export const SBSEntitiesCarousel = () => {
  const [shuffledEntities, setShuffledEntities] = useState(sbsEntitiesData);

  useEffect(() => {
    // Aleatorizar las entidades al cargar el componente
    setShuffledEntities(shuffleArray(sbsEntitiesData));
  }, []);

  return (
    <div className="bg-white text-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-blue-900" />
            <h3 className="text-3xl font-bold text-blue-900">Entidades Financieras Reguladas</h3>
          </div>
          <p className="text-blue-800 max-w-3xl mx-auto text-lg mb-6 leading-relaxed">
            Más de 40 entidades están supervisadas por la Superintendencia de Banca, Seguros y AFP (SBS) 
            y la Superintendencia del Mercado de Valores (SMV) del Perú, garantizando tu seguridad financiera
          </p>
        </div>

        {/* Carrusel de entidades */}
        <div className="relative">
          <Carousel
            plugins={[
              Autoplay({
                delay: 0,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
                speed: 0.5,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
              slidesToScroll: "auto",
              duration: 50,
            }}
            className="w-full max-w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {shuffledEntities.map((entity, index) => {
                const colors = getEntityTypeColor(entity.type);
                return (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6">
                    <Card className={`w-full bg-white border ${colors.border} hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md`}>
                      <CardContent className="p-4 text-center">
                        {/* Ícono de edificio */}
                        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                          <Building2 className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        
                        <h4 className="font-semibold text-blue-900 text-xs mb-2 leading-tight min-h-[2rem] flex items-center justify-center">
                          {entity.name}
                        </h4>
                        
                        <div className="flex justify-center mb-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {entity.type}
                          </span>
                        </div>

                        {/* Especialidades */}
                        <div className="text-xs text-blue-600 mb-2 min-h-[2rem] flex items-center justify-center">
                          <span className="bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                            {entity.specialties[0]}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 border-blue-300 text-blue-800 hover:bg-blue-50" />
            <CarouselNext className="hidden md:flex -right-12 border-blue-300 text-blue-800 hover:bg-blue-50" />
          </Carousel>
        </div>

        {/* Mensaje de certificación */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-full border border-blue-200">
            <Shield className="w-5 h-5 text-blue-900" />
            <span className="text-blue-900 font-medium">100% Supervisadas por la SBS y SMV - Gobierno del Perú</span>
          </div>
        </div>
      </div>
    </div>
  );
};
