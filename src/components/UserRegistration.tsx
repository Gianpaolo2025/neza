
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserData } from "@/pages/Index";

interface UserRegistrationProps {
  onSubmit: (userData: UserData) => void;
}

export const UserRegistration = ({ onSubmit }: UserRegistrationProps) => {
  const [formData, setFormData] = useState({
    dni: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    monthlyIncome: "",
    requestedAmount: "",
    employmentType: "",
    creditHistory: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      monthlyIncome: Number(formData.monthlyIncome),
      requestedAmount: Number(formData.requestedAmount)
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Solicita tu Crédito Personal
          </CardTitle>
          <CardDescription>
            Completa tus datos y recibe ofertas personalizadas de múltiples bancos
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => handleChange("dni", e.target.value)}
                  placeholder="12345678"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="999 888 777"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombres</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="Juan Carlos"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="lastName">Apellidos</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="García López"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="juan@email.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyIncome">Ingreso Mensual (S/)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                  placeholder="3000"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="requestedAmount">Monto Solicitado (S/)</Label>
                <Input
                  id="requestedAmount"
                  type="number"
                  value={formData.requestedAmount}
                  onChange={(e) => handleChange("requestedAmount", e.target.value)}
                  placeholder="10000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employmentType">Tipo de Empleo</Label>
                <Select onValueChange={(value) => handleChange("employmentType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu empleo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dependiente">Empleado Dependiente</SelectItem>
                    <SelectItem value="independiente">Trabajador Independiente</SelectItem>
                    <SelectItem value="empresario">Empresario</SelectItem>
                    <SelectItem value="pensionista">Pensionista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="creditHistory">Historial Crediticio</Label>
                <Select onValueChange={(value) => handleChange("creditHistory", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tu historial crediticio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excelente">Excelente</SelectItem>
                    <SelectItem value="bueno">Bueno</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="nuevo">Nuevo en el sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Buscar Ofertas
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
