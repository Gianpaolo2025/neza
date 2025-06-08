
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface SBSEntity {
  id: string;
  name: string;
  type: "banco" | "caja-municipal" | "financiera" | "microcrédito";
  logo: string;
  sbsCode: string;
}

const sbsEntities: SBSEntity[] = [
  // Bancos
  { id: "1", name: "Banco de Crédito del Perú", type: "banco", logo: "🏛️", sbsCode: "B-01001" },
  { id: "2", name: "BBVA Perú", type: "banco", logo: "🏦", sbsCode: "B-01002" },
  { id: "3", name: "Scotiabank Perú", type: "banco", logo: "🏪", sbsCode: "B-01003" },
  { id: "4", name: "Interbank", type: "banco", logo: "🏢", sbsCode: "B-01004" },
  { id: "5", name: "Banco Pichincha", type: "banco", logo: "🏛️", sbsCode: "B-01005" },
  { id: "6", name: "Banco Falabella", type: "banco", logo: "🏬", sbsCode: "B-01006" },
  { id: "7", name: "Banco Ripley", type: "banco", logo: "🏪", sbsCode: "B-01007" },
  
  // Cajas Municipales
  { id: "8", name: "Caja Municipal Arequipa", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02001" },
  { id: "9", name: "Caja Municipal Cusco", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02002" },
  { id: "10", name: "Caja Municipal Trujillo", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02003" },
  { id: "11", name: "Caja Municipal Huancayo", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02004" },
  { id: "12", name: "Caja Municipal Piura", type: "caja-municipal", logo: "🏛️", sbsCode: "C-02005" },
  
  // Financieras
  { id: "13", name: "CrediScotia Financiera", type: "financiera", logo: "💼", sbsCode: "F-03001" },
  { id: "14", name: "Compartamos Financiera", type: "financiera", logo: "💼", sbsCode: "F-03002" },
  { id: "15", name: "Financiera Oh!", type: "financiera", logo: "💼", sbsCode: "F-03003" },
  { id: "16", name: "Mitsui Auto Finance", type: "financiera", logo: "💼", sbsCode: "F-03004" },
  
  // Microcréditos
  { id: "17", name: "Mibanco", type: "microcrédito", logo: "🏪", sbsCode: "M-04001" },
  { id: "18", name: "Financiera Confianza", type: "microcrédito", logo: "🏪", sbsCode: "M-04002" },
  { id: "19", name: "Pro Finanzas", type: "microcrédito", logo: "🏪", sbsCode: "M-04003" },
  { id: "20", name: "Credinka", type: "microcrédito", logo: "🏪", sbsCode: "M-04004" }
];

const getTypeLabel = (type: string) => {
  const labels = {
    "banco": "Banco",
    "caja-municipal": "Caja Municipal", 
    "financiera": "Financiera",
    "microcrédito": "Microcrédito"
  };
  return labels[type as keyof typeof labels] || type;
};

export const SBSEntitiesCarousel = () => {
  // Duplicamos las entidades para crear efecto infinito
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
            animate={{ x: [0, -1920] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
            className="flex gap-4"
            style={{ width: "calc(300% + 2rem)" }}
          >
            {duplicatedEntities.map((entity, index) => (
              <motion.div
                key={`${entity.id}-${index}`}
                className="flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="w-48 bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{entity.logo}</div>
                    
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
