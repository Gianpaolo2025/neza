
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export const CurrencySelector = ({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) => {
  return (
    <Card className="border-blue-200 bg-white/80 mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">
          ¿En qué moneda deseas tu crédito?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant={selectedCurrency === "PEN" ? "default" : "outline"}
            onClick={() => onCurrencyChange("PEN")}
            className={`h-16 text-left justify-start ${
              selectedCurrency === "PEN" 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "border-blue-300 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇵🇪</span>
              <div>
                <div className="font-semibold">S/. Soles Peruanos</div>
                <div className="text-sm opacity-70">Moneda nacional</div>
              </div>
            </div>
          </Button>
          
          <Button
            variant={selectedCurrency === "USD" ? "default" : "outline"}
            onClick={() => onCurrencyChange("USD")}
            className={`h-16 text-left justify-start ${
              selectedCurrency === "USD" 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "border-blue-300 hover:bg-blue-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇺🇸</span>
              <div>
                <div className="font-semibold">$ Dólares Americanos</div>
                <div className="text-sm opacity-70">Moneda extranjera</div>
              </div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
