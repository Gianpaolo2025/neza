
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

interface AmountSelectorProps {
  selectedAmount: number;
  onAmountChange: (amount: number) => void;
  currency: string;
  productType: string;
}

export const AmountSelector = ({ selectedAmount, onAmountChange, currency, productType }: AmountSelectorProps) => {
  const [customAmount, setCustomAmount] = useState(selectedAmount.toString());

  useEffect(() => {
    setCustomAmount(selectedAmount.toString());
  }, [selectedAmount]);

  const getPresetAmounts = () => {
    const symbol = currency === "PEN" ? "S/." : "$";
    
    switch (productType) {
      case "credito-personal":
        return [
          { label: `${symbol} 5,000`, value: 5000 },
          { label: `${symbol} 10,000`, value: 10000 },
          { label: `${symbol} 20,000`, value: 20000 },
          { label: `${symbol} 50,000`, value: 50000 }
        ];
      case "credito-vehicular":
        return [
          { label: `${symbol} 20,000`, value: 20000 },
          { label: `${symbol} 50,000`, value: 50000 },
          { label: `${symbol} 80,000`, value: 80000 },
          { label: `${symbol} 120,000`, value: 120000 }
        ];
      case "credito-hipotecario":
        return [
          { label: `${symbol} 100,000`, value: 100000 },
          { label: `${symbol} 200,000`, value: 200000 },
          { label: `${symbol} 300,000`, value: 300000 },
          { label: `${symbol} 500,000`, value: 500000 }
        ];
      case "tarjeta-credito":
        return [
          { label: `${symbol} 2,000`, value: 2000 },
          { label: `${symbol} 5,000`, value: 5000 },
          { label: `${symbol} 10,000`, value: 10000 },
          { label: `${symbol} 15,000`, value: 15000 }
        ];
      default:
        return [
          { label: `${symbol} 5,000`, value: 5000 },
          { label: `${symbol} 10,000`, value: 10000 },
          { label: `${symbol} 20,000`, value: 20000 },
          { label: `${symbol} 50,000`, value: 50000 }
        ];
    }
  };

  const presetAmounts = getPresetAmounts();
  const currencySymbol = currency === "PEN" ? "S/." : "$";

  const handlePresetClick = (amount: number) => {
    onAmountChange(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (value: string) => {
    // Remove any non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    setCustomAmount(cleanValue);
    
    const numericValue = parseFloat(cleanValue);
    if (!isNaN(numericValue) && numericValue > 0) {
      onAmountChange(numericValue);
    } else if (cleanValue === '' || cleanValue === '0') {
      onAmountChange(0);
    }
  };

  const formatDisplayAmount = (amount: number) => {
    if (amount === 0) return '';
    return amount.toLocaleString('es-PE');
  };

  const getProductName = () => {
    const names = {
      "credito-personal": "crédito personal",
      "credito-vehicular": "crédito vehicular",
      "credito-hipotecario": "crédito hipotecario",
      "tarjeta-credito": "línea de crédito",
      "cuenta-ahorros": "depósito inicial"
    };
    return names[productType as keyof typeof names] || "financiamiento";
  };

  const getMinAmount = () => {
    switch (productType) {
      case "credito-personal": return 1000;
      case "credito-vehicular": return 10000;
      case "credito-hipotecario": return 50000;
      case "tarjeta-credito": return 500;
      default: return 500;
    }
  };

  const getMaxAmount = () => {
    switch (productType) {
      case "credito-personal": return 100000;
      case "credito-vehicular": return 500000;
      case "credito-hipotecario": return 2000000;
      case "tarjeta-credito": return 50000;
      default: return 100000;
    }
  };

  const isAmountValid = () => {
    const minAmount = getMinAmount();
    const maxAmount = getMaxAmount();
    return selectedAmount >= minAmount && selectedAmount <= maxAmount;
  };

  return (
    <Card className="border-blue-200 bg-white/80 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-700">
            ¿Cuánto necesitas para tu {getProductName()}?
          </h3>
        </div>
        
        <div className="space-y-4">
          {/* Montos sugeridos */}
          <div>
            <Label className="text-sm font-medium text-slate-600 mb-2 block">
              Montos sugeridos
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {presetAmounts.map((preset) => (
                <Button
                  key={preset.value}
                  variant={selectedAmount === preset.value ? "default" : "outline"}
                  onClick={() => handlePresetClick(preset.value)}
                  className={`h-12 text-sm ${
                    selectedAmount === preset.value 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Monto personalizado */}
          <div>
            <Label htmlFor="custom-amount" className="text-sm font-medium text-slate-600 mb-2 block">
              O ingresa un monto personalizado
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {currencySymbol}
              </span>
              <Input
                id="custom-amount"
                type="text"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="Ej: 25000"
                className={`pl-12 py-3 text-lg border-blue-300 focus:border-blue-500 ${
                  !isAmountValid() && selectedAmount > 0 ? 'border-red-500' : ''
                }`}
              />
            </div>
            <div className="text-xs text-slate-500 mt-1 space-y-1">
              <p>Ingresa el monto sin comas. Ej: 25000</p>
              <p>
                Monto mínimo: {currencySymbol} {getMinAmount().toLocaleString()} - 
                Monto máximo: {currencySymbol} {getMaxAmount().toLocaleString()}
              </p>
            </div>
          </div>

          {/* Información adicional */}
          {selectedAmount > 0 && (
            <div className={`border rounded-lg p-3 ${
              isAmountValid() 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm ${isAmountValid() ? 'text-blue-800' : 'text-red-800'}`}>
                <strong>Monto seleccionado:</strong> {currencySymbol} {formatDisplayAmount(selectedAmount)}
              </p>
              {isAmountValid() ? (
                <p className="text-xs text-blue-600 mt-1">
                  Las entidades financieras mostrarán ofertas basadas en este monto
                </p>
              ) : (
                <p className="text-xs text-red-600 mt-1">
                  El monto debe estar entre {currencySymbol} {getMinAmount().toLocaleString()} y {currencySymbol} {getMaxAmount().toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
