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
    type: "Banco",
    code: "B-01056"
  },
  {
    name: "BBVA",
    specialties: ["Créditos Vehiculares", "Empresariales"],
    type: "Banco",
    code: "B-01011"
  },
  {
    name: "BANCO BCI",
    specialties: ["Banca Empresarial", "Corporativa"],
    type: "Banco",
    code: "B-01055"
  },
  {
    name: "BANCOM",
    specialties: ["Microfinanzas", "PYME"],
    type: "Banco",
    code: "B-01038"
  },
  {
    name: "BANCO DE CRÉDITO",
    specialties: ["Préstamos Personales", "Hipotecarios"],
    type: "Banco",
    code: "B-01002"
  },
  {
    name: "BANCO DE LA NACIÓN",
    specialties: ["Servicios Públicos", "Inclusión Financiera"],
    type: "Banco",
    code: "B-01018"
  },
  {
    name: "BANCO FALABELLA",
    specialties: ["Tarjetas", "Créditos de Consumo"],
    type: "Banco",
    code: "B-01041"
  },
  {
    name: "BANCO GNB",
    specialties: ["Banca Personal", "Empresarial"],
    type: "Banco",
    code: "B-01053"
  },
  {
    name: "BANBIF",
    specialties: ["Financiamiento", "Inversión"],
    type: "Banco",
    code: "B-01038"
  },
  {
    name: "INTERBANK",
    specialties: ["Tarjetas de Crédito", "Préstamos"],
    type: "Banco",
    code: "B-01003"
  },
  {
    name: "BANCO PICHINCHA",
    specialties: ["Banca Personal", "PYME"],
    type: "Banco",
    code: "B-01049"
  },
  {
    name: "BANCO RIPLEY",
    specialties: ["Tarjetas", "Préstamos Personales"],
    type: "Banco",
    code: "B-01043"
  },
  {
    name: "SANTANDER PERÚ",
    specialties: ["Créditos", "Inversiones"],
    type: "Banco",
    code: "B-01007"
  },
  {
    name: "BANK OF CHINA (PERÚ)",
    specialties: ["Comercio Internacional", "Corporativo"],
    type: "Banco",
    code: "B-01052"
  },
  {
    name: "CITIBANK DEL PERÚ",
    specialties: ["Banca Privada", "Corporativa"],
    type: "Banco",
    code: "B-01017"
  },
  {
    name: "COMPARTAMOS BANCO",
    specialties: ["Microfinanzas", "Inclusión"],
    type: "Banco",
    code: "B-01047"
  },
  {
    name: "ICBC PERU BANK S.A.",
    specialties: ["Comercio", "Inversión"],
    type: "Banco",
    code: "B-01051"
  },
  {
    name: "MIBANCO",
    specialties: ["Microcréditos", "PYME"],
    type: "Banco",
    code: "B-01049"
  },
  {
    name: "BANCO SANTANDER CONSUMO",
    specialties: ["Créditos Consumo", "Tarjetas"],
    type: "Banco",
    code: "B-01054"
  },
  {
    name: "SCOTIABANK PERÚ",
    specialties: ["Créditos Hipotecarios", "Empresariales"],
    type: "Banco",
    code: "B-01009"
  },
  // Financieras
  {
    name: "FINANCIERA CONFIANZA",
    specialties: ["Préstamos Personales", "Vehiculares"],
    type: "Financiera",
    code: "F-01128"
  },
  {
    name: "FINANCIERA EFECTIVA",
    specialties: ["Microcréditos", "PYME"],
    type: "Financiera",
    code: "F-01125"
  },
  {
    name: "FINANCIERA OH",
    specialties: ["Créditos Personales", "Consumo"],
    type: "Financiera",
    code: "F-01129"
  },
  {
    name: "FINANCIERA PROEMPRESA",
    specialties: ["PYME", "Empresariales"],
    type: "Financiera",
    code: "F-01127"
  },
  {
    name: "FINANCIERA QAPAQ",
    specialties: ["Microfinanzas", "Inclusión"],
    type: "Financiera",
    code: "F-01130"
  },
  {
    name: "FINANCIERA SURGIR",
    specialties: ["Microcréditos", "Rural"],
    type: "Financiera",
    code: "F-01131"
  },
  // Cajas Municipales (cambiado CMAC por Caja Municipal)
  {
    name: "Caja Municipal CUSCO",
    specialties: ["Créditos PYME", "Ahorro"],
    type: "Caja Municipal",
    code: "CM-0801"
  },
  {
    name: "Caja Municipal AREQUIPA",
    specialties: ["Microcréditos", "Ahorro"],
    type: "Caja Municipal",
    code: "CM-0802"
  },
  {
    name: "Caja Municipal DEL SANTA",
    specialties: ["PYME", "Microfinanzas"],
    type: "Caja Municipal",
    code: "CM-0803"
  },
  {
    name: "Caja Municipal HUANCAYO",
    specialties: ["Créditos", "Ahorro"],
    type: "Caja Municipal",
    code: "CM-0804"
  },
  {
    name: "Caja Municipal ICA",
    specialties: ["PYME", "Consumo"],
    type: "Caja Municipal",
    code: "CM-0805"
  },
  {
    name: "Caja Municipal MAYNAS",
    specialties: ["Microcréditos", "Rural"],
    type: "Caja Municipal",
    code: "CM-0806"
  },
  {
    name: "Caja Municipal PAITA",
    specialties: ["PYME", "Pesquero"],
    type: "Caja Municipal",
    code: "CM-0807"
  },
  {
    name: "Caja Municipal PIURA",
    specialties: ["Agropecuario", "PYME"],
    type: "Caja Municipal",
    code: "CM-0808"
  },
  {
    name: "Caja Municipal TACNA",
    specialties: ["Comercio", "Frontera"],
    type: "Caja Municipal",
    code: "CM-0809"
  },
  {
    name: "Caja Municipal TRUJILLO",
    specialties: ["PYME", "Agroindustria"],
    type: "Caja Municipal",
    code: "CM-0810"
  },
  {
    name: "Caja Municipal LIMA",
    specialties: ["Microfinanzas", "Urbano"],
    type: "Caja Municipal",
    code: "CM-0811"
  },
  // Cajas Rurales
  {
    name: "CRAC CENCOSUD SCOTIA",
    specialties: ["Retail", "Consumo"],
    type: "Caja Rural",
    code: "CR-0901"
  },
  {
    name: "CRAC LOS ANDES",
    specialties: ["Agropecuario", "Rural"],
    type: "Caja Rural",
    code: "CR-0902"
  },
  {
    name: "CRAC DEL CENTRO",
    specialties: ["Agrícola", "PYME Rural"],
    type: "Caja Rural",
    code: "CR-0903"
  },
  {
    name: "CRAC PRYMERA",
    specialties: ["Microfinanzas", "Rural"],
    type: "Caja Rural",
    code: "CR-0904"
  },
  {
    name: "CRAC INCASUR",
    specialties: ["Agropecuario", "Sur"],
    type: "Caja Rural",
    code: "CR-0905"
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
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
              slidesToScroll: 1,
            }}
            className="w-full max-w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {shuffledEntities.map((entity, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6">
                  <Card className="w-full bg-white border border-blue-200 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md">
                    <CardContent className="p-4 text-center">
                      {/* Ícono de edificio */}
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Building2 className="w-6 h-6 text-blue-900" />
                      </div>
                      
                      <h4 className="font-semibold text-blue-900 text-xs mb-2 leading-tight min-h-[2rem] flex items-center justify-center">
                        {entity.name}
                      </h4>
                      
                      <div className="flex justify-center mb-2">
                        <span className={`
                          inline-block px-2 py-1 rounded-full text-xs font-medium
                          ${entity.type === 'Banco' 
                            ? 'bg-blue-100 text-blue-800' 
                            : entity.type === 'Caja Municipal'
                            ? 'bg-blue-50 text-blue-700'
                            : entity.type === 'Caja Rural'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-blue-100 text-blue-800'
                          }
                        `}>
                          {entity.type}
                        </span>
                      </div>

                      <div className="text-xs text-blue-600 font-mono">
                        {entity.code}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
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
