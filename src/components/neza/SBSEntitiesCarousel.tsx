
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Award } from "lucide-react";

const sbsEntities = [
  { name: "Banco de Crédito BCP", logo: "🏦", type: "Banco" },
  { name: "BBVA Continental", logo: "🏛️", type: "Banco" },
  { name: "Scotiabank Perú", logo: "🏦", type: "Banco" },
  { name: "Interbank", logo: "🏛️", type: "Banco" },
  { name: "Banco Pichincha", logo: "🏦", type: "Banco" },
  { name: "Mi Banco", logo: "🏛️", type: "Banco" },
  { name: "Caja Arequipa", logo: "🏪", type: "Caja Municipal" },
  { name: "Caja Trujillo", logo: "🏪", type: "Caja Municipal" },
  { name: "CrediScotia", logo: "💳", type: "Financiera" },
  { name: "Compartamos", logo: "💳", type: "Financiera" }
];

export const SBSEntitiesCarousel = () => {
  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xl font-bold text-gray-800">
            Entidades Supervisadas por la SBS
          </h3>
          <Award className="w-5 h-5 text-emerald-600" />
        </div>
        <p className="text-gray-600">
          Trabajamos con entidades reguladas y confiables para tu seguridad
        </p>
      </motion.div>

      {/* Carrusel infinito */}
      <div className="relative overflow-hidden">
        <motion.div
          animate={{ x: [-1920, 0] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
          className="flex gap-4"
          style={{ width: "calc(200% + 1rem)" }}
        >
          {/* Primera vuelta */}
          {sbsEntities.concat(sbsEntities).map((entity, index) => (
            <motion.div
              key={`${entity.name}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (index % sbsEntities.length) * 0.1 }}
              className="flex-shrink-0"
            >
              <Card className="w-48 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{entity.logo}</div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-1">
                    {entity.name}
                  </h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {entity.type}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Badge de verificación */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6"
      >
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="text-sm text-emerald-700 font-medium">
            100% Supervisadas por la SBS
          </span>
        </div>
      </motion.div>
    </div>
  );
};
