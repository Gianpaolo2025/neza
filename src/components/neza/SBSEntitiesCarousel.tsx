
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

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
  // Cajas Municipales (cambiado CMAC por Caja Municipal)
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

export const SBSEntitiesCarousel = () => {
  // Aleatorizar las entidades
  const shuffledEntities = shuffleArray(sbsEntitiesData);

  return (
    <div className="bg-white text-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-neza-blue-600" />
            <h3 className="text-2xl font-bold">Entidades Supervisadas por la SBS y SMV</h3>
          </div>
          <p className="text-neza-blue-700 max-w-2xl mx-auto mb-4">
            41 entidades supervisadas por la SBS compiten para ofrecerte las mejores condiciones
          </p>
          <div className="text-neza-blue-800 text-base font-medium">
            <p>Todos nuestros aliados están supervisados por:</p>
            <p className="font-semibold">Superintendencia de Banca, Seguros y AFP (SBS)</p>
            <p className="font-semibold">y por la Superintendencia del Mercado de Valores (SMV)</p>
          </div>
        </div>

        {/* Carrusel horizontal automático */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll gap-4" style={{ width: 'calc(300px * 82)' }}>
            {/* Duplicamos las entidades para hacer el scroll infinito */}
            {[...shuffledEntities, ...shuffledEntities].map((entity, index) => (
              <div key={index} className="flex-shrink-0 w-72">
                <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md h-full">
                  <CardContent className="p-6 text-center">
                    {/* Cuadro gris neutro en lugar de emoji */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded"></div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 text-base mb-3 leading-tight">
                      {entity.name}
                    </h4>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {entity.specialties.join(", ")}
                    </p>
                    
                    <div className="flex justify-center">
                      <span className={`
                        inline-block px-3 py-1 rounded-full text-sm font-medium
                        ${entity.type === 'Banco' 
                          ? 'bg-neza-blue-100 text-neza-blue-700' 
                          : entity.type === 'Caja Municipal'
                          ? 'bg-orange-100 text-orange-700'
                          : entity.type === 'Caja Rural'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-purple-100 text-purple-700'
                        }
                      `}>
                        {entity.type}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
