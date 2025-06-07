
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Award, Shield } from "lucide-react";

const banks = [
  { name: "Banco de Crédito BCP", logo: "🏦", type: "Banco Múltiple" },
  { name: "BBVA Continental", logo: "🏛️", type: "Banco Múltiple" },
  { name: "Scotiabank Perú", logo: "🏦", type: "Banco Múltiple" },
  { name: "Interbank", logo: "🏛️", type: "Banco Múltiple" },
  { name: "Banco Pichincha", logo: "🏦", type: "Banco Múltiple" },
  { name: "Mi Banco", logo: "🏛️", type: "Banco Múltiple" },
  { name: "Banco Falabella", logo: "🏪", type: "Banco Múltiple" },
  { name: "Banco Ripley", logo: "🏪", type: "Banco Múltiple" },
  { name: "Santander Perú", logo: "🏦", type: "Banco Múltiple" },
  { name: "Compartamos Banco", logo: "💳", type: "Banco Múltiple" },
  { name: "CMAC Cusco", logo: "🏪", type: "Caja Municipal" },
  { name: "CMAC Arequipa", logo: "🏪", type: "Caja Municipal" },
  { name: "Financiera Confianza", logo: "💳", type: "Financiera" }
];

export const BankCarousel = () => {
  return (
    <div className="w-full py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-slate-600 bg-clip-text text-transparent">
            Bancos Colaboradores
          </h2>
          <Award className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Trabajamos con las principales entidades financieras del Perú, supervisadas por la SBS
        </p>
      </motion.div>

      {/* Carrusel infinito */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-slate-50 py-6 rounded-xl">
        <motion.div
          animate={{ x: [-1920, 0] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          className="flex gap-6"
          style={{ width: "calc(300% + 2rem)" }}
        >
          {/* Tres vueltas del carrusel para efecto continuo */}
          {banks.concat(banks).concat(banks).map((bank, index) => (
            <motion.div
              key={`${bank.name}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (index % banks.length) * 0.05 }}
              className="flex-shrink-0"
            >
              <Card className="w-56 hover:shadow-xl transition-all duration-300 border-blue-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{bank.logo}</div>
                  <h3 className="font-bold text-sm text-blue-800 mb-2">
                    {bank.name}
                  </h3>
                  <span className="text-xs text-slate-600 bg-blue-100 px-3 py-1 rounded-full">
                    {bank.type}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Badge de verificación SBS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6"
      >
        <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-full px-6 py-3">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-blue-700 font-semibold">
            100% Supervisadas por la Superintendencia de Banca y Seguros (SBS)
          </span>
        </div>
      </motion.div>
    </div>
  );
};
