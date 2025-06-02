
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BankDashboard } from "@/components/BankDashboard";

const BankRoute = () => {
  const [selectedBank, setSelectedBank] = useState<string>("");

  const banks = [
    "Banco de Crédito BCP",
    "BBVA Continental",
    "Scotiabank Perú",
    "Interbank",
    "Banco Pichincha",
    "Mi Banco"
  ];

  if (selectedBank) {
    return <BankDashboard bankName={selectedBank} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Acceso Bancario</CardTitle>
          <CardDescription>
            Selecciona tu entidad bancaria para acceder al dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Select onValueChange={setSelectedBank}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu banco" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full" 
            disabled={!selectedBank}
            onClick={() => {}} // El estado ya se maneja con el Select
          >
            Acceder Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankRoute;
