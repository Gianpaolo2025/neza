
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface GoalSelectionStepProps {
  goal: string;
  onGoalChange: (goal: string) => void;
  validationError?: string;
}

export const GoalSelectionStep = ({ goal, onGoalChange, validationError }: GoalSelectionStepProps) => {
  const products = [
    { id: "prestamo-personal", label: "Préstamo Personal", icon: "💰", desc: "Para gastos personales" },
    { id: "prestamo-vehicular", label: "Préstamo Vehicular", icon: "🚗", desc: "Para comprar tu auto" },
    { id: "hipotecario", label: "Crédito Hipotecario", icon: "🏠", desc: "Para tu casa" },
    { id: "tarjeta-credito", label: "Tarjeta de Crédito", icon: "💳", desc: "Para compras y pagos" },
    { id: "tarjeta-debito", label: "Tarjeta de Débito", icon: "🏧", desc: "Para menores y mayores de edad" },
    { id: "prestamo-negocio", label: "Préstamo para Negocio", icon: "📊", desc: "Para tu empresa" },
    { id: "microfinanzas", label: "Microfinanzas", icon: "🏪", desc: "Para pequeños negocios" },
    { id: "cuenta-ahorros", label: "Cuenta de Ahorros", icon: "🏦", desc: "Para ahorrar dinero" },
    { id: "deposito-plazo", label: "Depósito a Plazo", icon: "📈", desc: "Inversión a plazo fijo" },
    { id: "credito-estudios", label: "Crédito Educativo", icon: "🎓", desc: "Para financiar estudios" },
    { id: "seguro-vida", label: "Seguro de Vida", icon: "🛡️", desc: "Protección familiar" },
    { id: "credito-consumo", label: "Crédito de Consumo", icon: "🛒", desc: "Para compras específicas" }
  ];

  return (
    <div className="space-y-6">
      <Label className="text-lg font-medium text-slate-700">
        ¿Qué tipo de producto financiero estás buscando?
      </Label>
      {validationError && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {validationError}
        </div>
      )}
      <div className="max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={goal === option.id ? "default" : "outline"}
                onClick={() => onGoalChange(option.id)}
                className={`h-24 w-full flex flex-col items-center justify-center space-y-2 ${
                  goal === option.id 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "border-blue-300 hover:bg-blue-50"
                } ${validationError ? 'border-red-500' : ''}`}
              >
                <span className="text-2xl">{option.icon}</span>
                <div className="text-center">
                  <div className="font-semibold text-sm">{option.label}</div>
                  <div className="text-xs opacity-70">{option.desc}</div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
