
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

// Lista completa de más de 30 entidades financieras supervisadas por SBS y SMV
const sbsEntitiesData = [
  {
    name: "Banco de Crédito del Perú",
    logo: "/placeholder.svg",
    specialties: ["Préstamos Personales", "Hipotecarios"],
    type: "Banco"
  },
  {
    name: "BBVA",
    logo: "/placeholder.svg", 
    specialties: ["Créditos Vehiculares", "Empresariales"],
    type: "Banco"
  },
  {
    name: "Interbank",
    logo: "/placeholder.svg",
    specialties: ["Tarjetas de Crédito", "Préstamos"],
    type: "Banco"
  },
  {
    name: "Scotiabank",
    logo: "/placeholder.svg",
    specialties: ["Créditos Hipotecarios", "Empresariales"],
    type: "Banco"
  },
  {
    name: "Mibanco",
    logo: "/placeholder.svg",
    specialties: ["Microcréditos", "PYME"],
    type: "Banco"
  },
  {
    name: "Financiera Confianza",
    logo: "/placeholder.svg",
    specialties: ["Préstamos Personales", "Vehiculares"],
    type: "Financiera"
  },
  {
    name: "Caja Arequipa",
    logo: "/placeholder.svg",
    specialties: ["Microcréditos", "Ahorro"],
    type: "Cooperativa"
  },
  {
    name: "Caja Cusco",
    logo: "/placeholder.svg",
    specialties: ["Créditos PYME", "Ahorro"],
    type: "Cooperativa"
  },
  {
    name: "Banco Falabella",
    logo: "/placeholder.svg",
    specialties: ["Tarjetas", "Créditos de Consumo"],
    type: "Banco"
  },
  {
    name: "Banco Ripley",
    logo: "/placeholder.svg",
    specialties: ["Tarjetas", "Préstamos Personales"],
    type: "Banco"
  },
  {
    name: "Caja Municipal de Sullana",
    logo: "/placeholder.svg",
    specialties: ["Microcréditos", "PYME"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Municipal de Piura",
    logo: "/placeholder.svg",
    specialties: ["Microcréditos", "Ahorro"],
    type: "Caja Municipal"
  },
  {
    name: "Banco Santander",
    logo: "/placeholder.svg",
    specialties: ["Créditos Vehiculares", "Empresariales"],
    type: "Banco"
  },
  {
    name: "Banco GNB",
    logo: "/placeholder.svg",
    specialties: ["Banca Empresarial", "Comercio Exterior"],
    type: "Banco"
  },
  {
    name: "ICBC",
    logo: "/placeholder.svg",
    specialties: ["Banca Corporativa", "Comercio Internacional"],
    type: "Banco"
  },
  {
    name: "Banco Pichincha",
    logo: "/placeholder.svg",
    specialties: ["Préstamos Personales", "PYME"],
    type: "Banco"
  },
  {
    name: "Crediscotia Financiera",
    logo: "/placeholder.svg",
    specialties: ["Créditos de Consumo", "Tarjetas"],
    type: "Financiera"
  },
  {
    name: "Financiera CrediScotia",
    logo: "/placeholder.svg",
    specialties: ["Préstamos Personales", "Vehiculares"],
    type: "Financiera"
  },
  {
    name: "Compartamos Financiera",
    logo: "/placeholder.svg",
    specialties: ["Microfinanzas", "Inclusión Financiera"],
    type: "Financiera"
  },
  {
    name: "Financiera Qapaq",
    logo: "/placeholder.svg",
    specialties: ["Microcréditos", "PYME"],
    type: "Financiera"
  },
  {
    name: "Caja Rural de Ahorro y Crédito",
    logo: "/placeholder.svg",
    specialties: ["Sector Rural", "Agropecuario"],
    type: "Caja Rural"
  },
  {
    name: "COOPAC San José",
    logo: "/placeholder.svg",
    specialties: ["Ahorro", "Crédito Cooperativo"],
    type: "Cooperativa"
  },
  {
    name: "COOPAC Abaco",
    logo: "/placeholder.svg",
    specialties: ["Créditos Personales", "Ahorro"],
    type: "Cooperativa"
  },
  {
    name: "Banco Azteca",
    logo: "/placeholder.svg",
    specialties: ["Inclusión Financiera", "Microcréditos"],
    type: "Banco"
  },
  {
    name: "Caja Metropolitana",
    logo: "/placeholder.svg",
    specialties: ["PYME", "Microfinanzas"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Trujillo",
    logo: "/placeholder.svg",
    specialties: ["Microcréditos", "Ahorro"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Huancayo",
    logo: "/placeholder.svg",
    specialties: ["PYME", "Microfinanzas"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Tacna",
    logo: "/placeholder.svg",
    specialties: ["Microcréditos", "Desarrollo Local"],
    type: "Caja Municipal"
  },
  {
    name: "Caja Ica",
    logo: "/placeholder.svg",
    specialties: ["Agricultura", "PYME"],
    type: "Caja Municipal"
  },
  {
    name: "Financiera Proempresa",
    logo: "/placeholder.svg",
    specialties: ["PYME", "Microfinanzas"],
    type: "Financiera"
  },
  {
    name: "Financiera Efectiva",
    logo: "/placeholder.svg",
    specialties: ["Créditos de Consumo", "Préstamos"],
    type: "Financiera"
  },
  {
    name: "Banco de la Nación",
    logo: "/placeholder.svg",
    specialties: ["Servicios Públicos", "Inclusión"],
    type: "Banco"
  },
  {
    name: "Mi Banco",
    logo: "/placeholder.svg",
    specialties: ["Microfinanzas", "PYME"],
    type: "Banco"
  },
  {
    name: "Banco Continental",
    logo: "/placeholder.svg",
    specialties: ["Banca Corporativa", "Retail"],
    type: "Banco"
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
            Más de 30 entidades financieras autorizadas compiten para ofrecerte las mejores condiciones
          </p>
          <div className="text-neza-blue-800 text-base font-medium">
            <p>Todos nuestros aliados están supervisados por:</p>
            <p className="font-semibold">Superintendencia de Banca, Seguros y AFP (SBS)</p>
            <p className="font-semibold">y por la Superintendencia del Mercado de Valores (SMV)</p>
          </div>
        </div>

        {/* Carrusel horizontal automático */}
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll gap-4" style={{ width: 'calc(300px * 35)' }}>
            {/* Duplicamos las entidades para hacer el scroll infinito */}
            {[...sbsEntitiesData, ...sbsEntitiesData].map((entity, index) => (
              <div key={index} className="flex-shrink-0 w-72">
                <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md h-full">
                  <CardContent className="p-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
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
                    
                    <h4 className="font-semibold text-gray-800 text-sm mb-2 leading-tight">
                      {entity.name}
                    </h4>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      {entity.specialties.join(", ")}
                    </p>
                    
                    <div className="flex justify-center">
                      <span className={`
                        inline-block px-2 py-1 rounded-full text-xs font-medium
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
