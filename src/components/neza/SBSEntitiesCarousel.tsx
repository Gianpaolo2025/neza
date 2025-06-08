
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface SBSEntity {
  id: string;
  name: string;
  type: "banco" | "caja-municipal" | "caja-rural" | "financiera";
  logo: string;
  sbsCode: string;
}

const sbsEntities: SBSEntity[] = [
  // Bancos
  { id: "1", name: "ALFIN Banco", type: "banco", logo: "🏛️", sbsCode: "B-01001" },
  { id: "2", name: "BBVA", type: "banco", logo: "🏦", sbsCode: "B-01002" },
  { id: "3", name: "Banco BCI", type: "banco", logo: "🏪", sbsCode: "B-01003" },
  { id: "4", name: "BANCOM", type: "banco", logo: "🏢", sbsCode: "B-01004" },
  { id: "5", name: "Banco de Crédito", type: "banco", logo: "🏛️", sbsCode: "B-01005" },
  { id: "6", name: "Banco de la Nación", type: "banco", logo: "🏬", sbsCode: "B-01006" },
  { id: "7", name: "Banco Falabella", type: "banco", logo: "🏪", sbsCode: "B-01007" },
  { id: "8", name: "Banco GNB", type: "banco", logo: "🏛️", sbsCode: "B-01008" },
  { id: "9", name: "BanBif", type: "banco", logo: "🏦", sbsCode: "B-01009" },
  { id: "10", name: "Interbank", type: "banco", logo: "🏢", sbsCode: "B-01010" },
  { id: "11", name: "Banco Pichincha", type: "banco", logo: "🏛️", sbsCode: "B-01011" },
  { id: "12", name: "Banco Ripley", type: "banco", logo: "🏬", sbsCode: "B-01012" },
  { id: "13", name: "Santander Perú", type: "banco", logo: "🏪", sbsCode: "B-01013" },
  { id: "14", name: "Bank of China (Perú)", type: "banco", logo: "🏛️", sbsCode: "B-01014" },
  { id: "15", name: "Citibank del Perú", type: "banco", logo: "🏦", sbsCode: "B-01015" },
  { id: "16", name: "Compartamos Banco", type: "banco", logo: "🏢", sbsCode: "B-01016" },
  { id: "17", name: "ICBC Perú Bank S.A.", type: "banco", logo: "🏛️", sbsCode: "B-01017" },
  { id: "18", name: "Mibanco", type: "banco", logo: "🏬", sbsCode: "B-01018" },
  { id: "19", name: "Santander Consumer", type: "banco", logo: "🏪", sbsCode: "B-01019" },
  { id: "20", name: "Scotiabank Perú", type: "banco", logo: "🏛️", sbsCode: "B-01020" },
  
  // Financieras
  { id: "21", name: "Financiera Confianza", type: "financiera", logo: "💼", sbsCode: "F-03001" },
  { id: "22", name: "Financiera Efectiva", type: "financiera", logo: "💼", sbsCode: "F-03002" },
  { id: "23", name: "Financiera Oh!", type: "financiera", logo: "💼", sbsCode: "F-03003" },
  { id: "24", name: "Financiera Proempresa", type: "financiera", logo: "💼", sbsCode: "F-03004" },
  { id: "25", name: "Financiera Qapaq", type: "financiera", logo: "💼", sbsCode: "F-03005" },
  { id: "26", name: "Financiera Surgir", type: "financiera", logo: "💼", sbsCode: "F-03006" },
  
  // Cajas Municipales
  { id: "27", name: "Caja Municipal Cusco", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02001" },
  { id: "28", name: "Caja Municipal Arequipa", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02002" },
  { id: "29", name: "Caja Municipal Del Santa", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02003" },
  { id: "30", name: "Caja Municipal Huancayo", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02004" },
  { id: "31", name: "Caja Municipal Ica", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02005" },
  { id: "32", name: "Caja Municipal Maynas", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02006" },
  { id: "33", name: "Caja Municipal Paita", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02007" },
  { id: "34", name: "Caja Municipal Piura", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02008" },
  { id: "35", name: "Caja Municipal Tacna", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02009" },
  { id: "36", name: "Caja Municipal Trujillo", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02010" },
  { id: "37", name: "Caja Metropolitana Lima", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02011" },
  
  // Cajas Rurales
  { id: "38", name: "Caja Rural Cencosud Scotia", type: "caja-rural", logo: "🏪", sbsCode: "R-04001" },
  { id: "39", name: "Caja Rural Los Andes", type: "caja-rural", logo: "🏪", sbsCode: "R-04002" },
  { id: "40", name: "Caja Rural del Centro", type: "caja-rural", logo: "🏪", sbsCode: "R-04003" },
  { id: "41", name: "Caja Rural Prymera", type: "caja-rural", logo: "🏪", sbsCode: "R-04004" },
  { id: "42", name: "Caja Rural Incasur", type: "caja-rural", logo: "🏪", sbsCode: "R-04005" }
];

const getTypeLabel = (type: string) => {
  const labels = {
    "banco": "Banco",
    "caja-municipal": "Caja Municipal", 
    "caja-rural": "Caja Rural",
    "financiera": "Financiera"
  };
  return labels[type as keyof typeof labels] || type;
};

export const SBSEntitiesCarousel = () => {
  // Triplicamos las entidades para crear efecto infinito fluido
  const duplicatedEntities = [...sbsEntities, ...sbsEntities, ...sbsEntities];

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Entidades Financieras Reguladas SBS
            </h2>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Todas las entidades están supervisadas por la Superintendencia de Banca, Seguros y AFP del Perú
          </p>
        </div>

        {/* Carrusel Continuo */}
        <div className="relative overflow-hidden bg-white/50 backdrop-blur-sm rounded-xl py-6">
          <motion.div
            animate={{ x: [0, -2520] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
            }}
            className="flex gap-4"
            style={{ width: "calc(420% + 2rem)" }}
          >
            {duplicatedEntities.map((entity, index) => (
              <motion.div
                key={`${entity.id}-${index}`}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="w-44 bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-3 text-center">
                    <div className="text-xl mb-2">{entity.logo}</div>
                    
                    <h3 className="font-bold text-slate-800 mb-2 text-xs line-clamp-2 h-8">
                      {entity.name}
                    </h3>
                    
                    <div className="mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        {getTypeLabel(entity.type)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-slate-500">
                      <span className="font-mono">{entity.sbsCode}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer con información SBS */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              100% Supervisadas por la SBS - Gobierno del Perú
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
