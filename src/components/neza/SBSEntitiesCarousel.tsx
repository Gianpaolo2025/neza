
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

// Lista de 41 entidades financieras supervisadas por la SBS
const sbsEntitiesData = [
  // Bancos
  {
    name: "ALFIN BANCO",
    logo: "🏦",
    specialties: ["Créditos PYME", "Financiamiento"],
    type: "Banco"
  },
  {
    name: "BBVA",
    logo: "🏦", 
    specialties: ["Créditos Vehiculares", "Empresariales"],
    type: "Banco"
  },
  {
    name: "BANCO BCI",
    logo: "🏦",
    specialties: ["Banca Empresarial", "Corporativa"],
    type: "Banco"
  },
  {
    name: "BANCOM",
    logo: "🏦",
    specialties: ["Microfinanzas", "PYME"],
    type: "Banco"
  },
  {
    name: "BANCO DE CRÉDITO",
    logo: "🏦",
    specialties: ["Préstamos Personales", "Hipotecarios"],
    type: "Banco"
  },
  {
    name: "BANCO DE LA NACIÓN",
    logo: "🏦",
    specialties: ["Servicios Públicos", "Inclusión Financiera"],
    type: "Banco"
  },
  {
    name: "BANCO FALABELLA",
    logo: "🏦",
    specialties: ["Tarjetas", "Créditos de Consumo"],
    type: "Banco"
  },
  {
    name: "BANCO GNB",
    logo: "🏦",
    specialties: ["Banca Personal", "Empresarial"],
    type: "Banco"
  },
  {
    name: "BANBIF",
    logo: "🏦",
    specialties: ["Financiamiento", "Inversión"],
    type: "Banco"
  },
  {
    name: "INTERBANK",
    logo: "🏦",
    specialties: ["Tarjetas de Crédito", "Préstamos"],
    type: "Banco"
  },
  {
    name: "BANCO PICHINCHA",
    logo: "🏦",
    specialties: ["Banca Personal", "PYME"],
    type: "Banco"
  },
  {
    name: "BANCO RIPLEY",
    logo: "🏦",
    specialties: ["Tarjetas", "Préstamos Personales"],
    type: "Banco"
  },
  {
    name: "SANTANDER PERÚ",
    logo: "🏦",
    specialties: ["Créditos", "Inversiones"],
    type: "Banco"
  },
  {
    name: "BANK OF CHINA (PERÚ)",
    logo: "🏦",
    specialties: ["Comercio Internacional", "Corporativo"],
    type: "Banco"
  },
  {
    name: "CITIBANK DEL PERÚ",
    logo: "🏦",
    specialties: ["Banca Privada", "Corporativa"],
    type: "Banco"
  },
  {
    name: "COMPARTAMOS BANCO",
    logo: "🏦",
    specialties: ["Microfinanzas", "Inclusión"],
    type: "Banco"
  },
  {
    name: "ICBC PERU BANK S.A.",
    logo: "🏦",
    specialties: ["Comercio", "Inversión"],
    type: "Banco"
  },
  {
    name: "MIBANCO",
    logo: "🏦",
    specialties: ["Microcréditos", "PYME"],
    type: "Banco"
  },
  {
    name: "BANCO SANTANDER CONSUMO",
    logo: "🏦",
    specialties: ["Créditos Consumo", "Tarjetas"],
    type: "Banco"
  },
  {
    name: "SCOTIABANK PERÚ",
    logo: "🏦",
    specialties: ["Créditos Hipotecarios", "Empresariales"],
    type: "Banco"
  },
  // Financieras
  {
    name: "FINANCIERA CONFIANZA",
    logo: "💼",
    specialties: ["Préstamos Personales", "Vehiculares"],
    type: "Financiera"
  },
  {
    name: "FINANCIERA EFECTIVA",
    logo: "💼",
    specialties: ["Microcréditos", "PYME"],
    type: "Financiera"
  },
  {
    name: "FINANCIERA OH",
    logo: "💼",
    specialties: ["Créditos Personales", "Consumo"],
    type: "Financiera"
  },
  {
    name: "FINANCIERA PROEMPRESA",
    logo: "💼",
    specialties: ["PYME", "Empresariales"],
    type: "Financiera"
  },
  {
    name: "FINANCIERA QAPAQ",
    logo: "💼",
    specialties: ["Microfinanzas", "Inclusión"],
    type: "Financiera"
  },
  {
    name: "FINANCIERA SURGIR",
    logo: "💼",
    specialties: ["Microcréditos", "Rural"],
    type: "Financiera"
  },
  // Cajas Municipales
  {
    name: "CMAC CUSCO",
    logo: "🏛️",
    specialties: ["Créditos PYME", "Ahorro"],
    type: "Caja Municipal"
  },
  {
    name: "CMAC AREQUIPA",
    logo: "🏛️",
    specialties: ["Microcréditos", "Ahorro"],
    type: "Caja Municipal"
  },
  {
    name: "CMAC DEL SANTA",
    logo: "🏛️",
    specialties: ["PYME", "Microfinanzas"],
    type: "Caja Municipal"
  },
  {
    name: "CMAC HUANCAYO",
    logo: "🏛️",
    specialties: ["Créditos", "Ahorro"],
    type: "Caja Municipal"
  },
  {
    name: "CMAC ICA",
    logo: "🏛️",
    specialties: ["PYME", "Consumo"],
    type: "Caja Municipal"
  },
  {
    name: "CMAC MAYNAS",
    logo: "🏛️",
    specialties: ["Microcréditos", "Rural"],
    type: "Caja Municipal"
  },
  {
    name: "CMAC PAITA",
    logo: "🏛️",
    specialties: ["PYME", "Pesquero"],
    type: "Caja Municipal"
  },
  {
    name: "CMAC PIURA",
    logo: "🏛️",
    specialties: ["Agropecuario", "PYME"],
    type: "Caja Municipal"
  },
  {
    name: "CMAC TACNA",
    logo: "🏛️",
    specialties: ["Comercio", "Frontera"],
    type: "Caja Municipal"
  },
  {
    name: "CMAC TRUJILLO",
    logo: "🏛️",
    specialties: ["PYME", "Agroindustria"],
    type: "Caja Municipal"
  },
  {
    name: "CMCP LIMA",
    logo: "🏛️",
    specialties: ["Microfinanzas", "Urbano"],
    type: "Caja Municipal"
  },
  // Cajas Rurales
  {
    name: "CRAC CENCOSUD SCOTIA",
    logo: "🌾",
    specialties: ["Retail", "Consumo"],
    type: "Caja Rural"
  },
  {
    name: "CRAC LOS ANDES",
    logo: "🌾",
    specialties: ["Agropecuario", "Rural"],
    type: "Caja Rural"
  },
  {
    name: "CRAC DEL CENTRO",
    logo: "🌾",
    specialties: ["Agrícola", "PYME Rural"],
    type: "Caja Rural"
  },
  {
    name: "CRAC PRYMERA",
    logo: "🌾",
    specialties: ["Microfinanzas", "Rural"],
    type: "Caja Rural"
  },
  {
    name: "CRAC INCASUR",
    logo: "🌾",
    specialties: ["Agropecuario", "Sur"],
    type: "Caja Rural"
  }
];

export const SBSEntitiesCarousel = () => {
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
            {[...sbsEntitiesData, ...sbsEntitiesData].map((entity, index) => (
              <div key={index} className="flex-shrink-0 w-72">
                <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">{entity.logo}</span>
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
