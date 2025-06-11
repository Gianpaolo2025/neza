
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface AmountStepProps {
  amount: number;
  onAmountChange: (amount: number) => void;
  validationError?: string;
}

export const AmountStep = ({ amount, onAmountChange, validationError }: AmountStepProps) => {
  const predefinedAmounts = [5000, 10000, 20000, 50000, 100000, 200000];

  return (
    <div className="space-y-6">
      <Label className="text-lg font-medium text-slate-700">
        💰 ¿Cuánto dinero necesitas?
      </Label>
      {validationError && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {validationError}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {predefinedAmounts.map((predefinedAmount) => (
          <Button
            key={predefinedAmount}
            variant={amount === predefinedAmount ? "default" : "outline"}
            onClick={() => onAmountChange(predefinedAmount)}
            className={`h-16 ${
              amount === predefinedAmount 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "border-blue-300 hover:bg-blue-50"
            }`}
          >
            S/ {predefinedAmount.toLocaleString()}
          </Button>
        ))}
      </div>
      <div>
        <Label className="text-base font-medium text-slate-700 mb-3 block">
          Otro monto específico: *
        </Label>
        <Input
          type="number"
          value={amount || ""}
          onChange={(e) => onAmountChange(Number(e.target.value))}
          placeholder="Escribe el monto que necesitas"
          className={`border-blue-300 focus:border-blue-500 ${validationError ? 'border-red-500' : ''}`}
        />
      </div>
    </div>
  );
};
