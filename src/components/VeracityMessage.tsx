
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const VeracityMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mb-8"
    >
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-slate-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-800 mb-2">
                La transparencia es clave para encontrar tu mejor opción
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                Sé completamente transparente con tu información. Esto nos permite encontrar las mejores opciones reales para tu perfil financiero y aumentar significativamente tus posibilidades de aprobación.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>
                  <strong>Importante:</strong> Información falsa o incompleta afecta tu evaluación y reduce tus oportunidades.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
