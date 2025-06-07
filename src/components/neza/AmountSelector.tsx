
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AmountSelectorProps {
  amount: number;
  currency: string;
  onAmountChange: (amount: number) => void;
}

export const AmountSelector = ({ amount, currency, onAmountChange }: AmountSelectorProps) => {
  const currencySymbol = currency === "USD" ? "$" : "S/.";
  
  const suggestedAmounts = currency === "USD" 
    ? [1000, 3000, 5000, 10000, 15000, 20000]
    : [3000, 10000, 20000, 30000, 50000, 80000];

  return (
    <Card className="border-blue-200 bg-white/80 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">💰</span>
          <Label className="text-lg font-medium text-slate-700">
            ¿Cuánto dinero necesitas? *
          </Label>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-blue-600">
              {currencySymbol}
            </span>
            <Input
              type="number"
              value={amount || ""}
              onChange={(e) => onAmountChange(Number(e.target.value))}
              placeholder={`Ej: ${currency === "USD" ? "5,000" : "15,000"}`}
              className="text-lg py-6 pl-12 border-blue-300 focus:border-blue-500"
              min="0"
            />
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-600 mb-3">Montos sugeridos:</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {suggestedAmounts.map((suggestedAmount) => (
              <Button
                key={suggestedAmount}
                variant="outline"
                size="sm"
                onClick={() => onAmountChange(suggestedAmount)}
                className={`text-xs md:text-sm ${
                  amount === suggestedAmount 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "border-blue-300 hover:bg-blue-50"
                }`}
              >
                {currencySymbol} {suggestedAmount.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
