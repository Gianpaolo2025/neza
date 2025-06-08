
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

// Lista de 11 entidades financieras principales con emojis
const sbsEntitiesData = [
  {
    name: "Banco de Crédito del Perú",
    emoji: "🏦",
    specialties: ["Préstamos Personales", "Hipotecarios"],
    type: "Banco"
  },
  {
    name: "BBVA",
    emoji: "💳", 
    specialties: ["Créditos Vehiculares", "Empresariales"],
    type: "Banco"
  },
  {
    name: "Interbank",
    emoji: "🌟",
    specialties: ["Tarjetas de Crédito", "Préstamos"],
    type: "Banco"
  },
  {
    name: "Scotiabank",
    emoji: "🔵",
    specialties: ["Créditos Hipotecarios", "Empresariales"],
    type: "Banco"
  },
  {
    name: "Mibanco",
    emoji: "🏪",
    specialties: ["Microcréditos", "PYME"],
    type: "Banco"
  },
  {
    name: "Financiera Confianza",
    emoji: "🤝",
    specialties: ["Préstamos Personales", "Vehiculares"],
    type: "Financiera"
  },
  {
    name: "Caja Arequipa",
    emoji: "🏔️",
    specialties: ["Microcréditos", "Ahorro"],
    type: "Cooperativa"
  },
  {
    name: "Caja Cusco",
    emoji: "🦙",
    specialties: ["Créditos PYME", "Ahorro"],
    type: "Cooperativa"
  },
  {
    name: "Banco Falabella",
    emoji: "🛍️",
    specialties: ["Tarjetas", "Créditos de Consumo"],
    type: "Banco"
  },
  {
    name: "Banco Ripley",
    emoji: "🎯",
    specialties: ["Tarjetas", "Préstamos Personales"],
    type: "Banco"
  },
  {
    name: "Caja Municipal de Sullana",
    emoji: "🌊",
    specialties: ["Microcréditos", "PYME"],
    type: "Caja Municipal"
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
            11 entidades financieras autorizadas compiten para ofrecerte las mejores condiciones
          </p>
          <div className="text-neza-blue-800 text-base font-medium">
            <p>Todos nuestros aliados están supervisados por:</p>
            <p className="font-semibold">Superintendencia de Banca, Seguros y AFP (SBS)</p>
            <p className="font-semibold">y por la Superintendencia del Mercado de Valores (SMV)</p>
          </div>
        </div>

        {/* Carrusel horizontal automático */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll gap-4" style={{ width: 'calc(300px * 22)' }}>
            {/* Duplicamos las entidades para hacer el scroll infinito */}
            {[...sbsEntitiesData, ...sbsEntitiesData].map((entity, index) => (
              <div key={index} className="flex-shrink-0 w-72">
                <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">{entity.emoji}</span>
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
                          : entity.type === 'Cooperativa'
                          ? 'bg-green-100 text-green-700'
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
