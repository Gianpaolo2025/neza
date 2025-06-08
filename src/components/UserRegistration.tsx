import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserData } from "@/types/user";
import { SecurityUtils, SecurityLogger } from "@/services/securityUtils";
import { Shield } from "lucide-react";

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
    creditHistory: "",
    productType: "",
    hasOtherDebts: "",
    bankingRelationship: "",
    urgencyLevel: "",
    preferredBank: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // DNI validation
    if (!SecurityUtils.validateDNI(formData.dni)) {
      newErrors.dni = "DNI debe tener 8 dígitos";
    }

    // Email validation
    if (!SecurityUtils.validateEmail(formData.email)) {
      newErrors.email = "Formato de email inválido";
    }

    // Phone validation
    if (!SecurityUtils.validatePhone(formData.phone)) {
      newErrors.phone = "Teléfono debe tener formato válido (9 dígitos comenzando con 9)";
    }

    // Name validation
    if (formData.firstName.length < 2) {
      newErrors.firstName = "Nombres debe tener al menos 2 caracteres";
    }

    if (formData.lastName.length < 2) {
      newErrors.lastName = "Apellidos debe tener al menos 2 caracteres";
    }

    // Income validation
    const income = Number(formData.monthlyIncome);
    if (isNaN(income) || income < 500 || income > 1000000) {
      newErrors.monthlyIncome = "Ingreso debe estar entre S/ 500 y S/ 1,000,000";
    }

    // Requested amount validation
    const amount = Number(formData.requestedAmount);
    if (isNaN(amount) || amount < 1000 || amount > 5000000) {
      newErrors.requestedAmount = "Monto solicitado debe estar entre S/ 1,000 y S/ 5,000,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const identifier = formData.email || 'anonymous';
    if (!SecurityUtils.checkRateLimit(`registration_${identifier}`, 3, 300000)) {
      alert('Demasiados intentos de registro. Espera 5 minutos antes de intentar de nuevo.');
      SecurityLogger.logEvent('Registration rate limit exceeded', { identifier }, 'medium');
      return;
    }

    // Validate form
    if (!validateForm()) {
      SecurityLogger.logEvent('Form validation failed', { 
        errors: Object.keys(errors),
        email: SecurityUtils.sanitizeInput(formData.email)
      }, 'low');
      return;
    }

    // Sanitize all inputs
    const sanitizedData = {
      dni: SecurityUtils.sanitizeInput(formData.dni.replace(/\D/g, '')),
      firstName: SecurityUtils.sanitizeInput(formData.firstName),
      lastName: SecurityUtils.sanitizeInput(formData.lastName),
      email: SecurityUtils.sanitizeInput(formData.email.toLowerCase()),
      phone: SecurityUtils.sanitizeInput(formData.phone.replace(/\D/g, '')),
      monthlyIncome: Number(formData.monthlyIncome),
      requestedAmount: Number(formData.requestedAmount),
      employmentType: SecurityUtils.sanitizeInput(formData.employmentType),
      creditHistory: SecurityUtils.sanitizeInput(formData.creditHistory),
      productType: SecurityUtils.sanitizeInput(formData.productType),
      hasOtherDebts: SecurityUtils.sanitizeInput(formData.hasOtherDebts),
      bankingRelationship: SecurityUtils.sanitizeInput(formData.bankingRelationship),
      urgencyLevel: SecurityUtils.sanitizeInput(formData.urgencyLevel),
      preferredBank: SecurityUtils.sanitizeInput(formData.preferredBank)
    };

    SecurityLogger.logEvent('User registration submitted', { 
      email: sanitizedData.email,
      productType: sanitizedData.productType,
      requestedAmount: sanitizedData.requestedAmount
    }, 'low');

    onSubmit(sanitizedData);
  };

  const handleChange = (field: string, value: string) => {
    // Real-time input sanitization
    const sanitizedValue = SecurityUtils.sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear error when user starts fixing it
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Encuentra tu Mejor Oferta Financiera
          </CardTitle>
          <CardDescription>
            Completa tu perfil y recibe ofertas personalizadas de múltiples entidades financieras
          </CardDescription>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-green-600">
            <Shield className="w-4 h-4" />
            <span>Formulario protegido con validación de seguridad</span>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección: Tipo de Producto */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">¿Qué producto financiero necesitas?</h3>
              <Select onValueChange={(value) => handleChange("productType", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el producto que necesitas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credito-personal">Crédito Personal</SelectItem>
                  <SelectItem value="credito-vehicular">Crédito Vehicular</SelectItem>
                  <SelectItem value="credito-hipotecario">Crédito Hipotecario</SelectItem>
                  <SelectItem value="tarjeta-credito">Tarjeta de Crédito</SelectItem>
                  <SelectItem value="credito-empresarial">Crédito Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sección: Datos Personales with enhanced validation */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Datos Personales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dni">DNI</Label>
                  <Input
                    id="dni"
                    value={formData.dni}
                    onChange={(e) => handleChange("dni", e.target.value)}
                    placeholder="12345678"
                    maxLength={8}
                    className={errors.dni ? "border-red-500" : ""}
                    required
                  />
                  {errors.dni && <p className="text-sm text-red-500 mt-1">{errors.dni}</p>}
                </div>
                
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="999888777"
                    maxLength={9}
                    className={errors.phone ? "border-red-500" : ""}
                    required
                  />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="firstName">Nombres</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="Juan Carlos"
                    maxLength={50}
                    className={errors.firstName ? "border-red-500" : ""}
                    required
                  />
                  {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="García López"
                    maxLength={50}
                    className={errors.lastName ? "border-red-500" : ""}
                    required
                  />
                  {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="juan@email.com"
                  maxLength={254}
                  className={errors.email ? "border-red-500" : ""}
                  required
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Sección: Información Financiera */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Información Financiera</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyIncome">Ingreso Mensual (S/)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleChange("monthlyIncome", e.target.value)}
                    placeholder="3000"
                    min="500"
                    max="1000000"
                    className={errors.monthlyIncome ? "border-red-500" : ""}
                    required
                  />
                  {errors.monthlyIncome && <p className="text-sm text-red-500 mt-1">{errors.monthlyIncome}</p>}
                </div>
                
                <div>
                  <Label htmlFor="requestedAmount">Monto Solicitado (S/)</Label>
                  <Input
                    id="requestedAmount"
                    type="number"
                    value={formData.requestedAmount}
                    onChange={(e) => handleChange("requestedAmount", e.target.value)}
                    placeholder="10000"
                    min="1000"
                    max="5000000"
                    className={errors.requestedAmount ? "border-red-500" : ""}
                    required
                  />
                  {errors.requestedAmount && <p className="text-sm text-red-500 mt-1">{errors.requestedAmount}</p>}
                </div>

                <div>
                  <Label htmlFor="employmentType">Tipo de Empleo</Label>
                  <Select onValueChange={(value) => handleChange("employmentType", value)} required>
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
                  <Select onValueChange={(value) => handleChange("creditHistory", value)} required>
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
            </div>

            {/* Sección: Perfil de Cliente */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Perfil de Cliente</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hasOtherDebts">¿Tienes otras deudas?</Label>
                  <Select onValueChange={(value) => handleChange("hasOtherDebts", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No tengo deudas</SelectItem>
                      <SelectItem value="pocas">Pocas deudas (menos del 30% de mis ingresos)</SelectItem>
                      <SelectItem value="moderadas">Deudas moderadas (30-50% de mis ingresos)</SelectItem>
                      <SelectItem value="altas">Deudas altas (más del 50% de mis ingresos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bankingRelationship">Relación bancaria actual</Label>
                  <Select onValueChange={(value) => handleChange("bankingRelationship", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Tu relación con bancos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nuevo">Nuevo cliente bancario</SelectItem>
                      <SelectItem value="un-banco">Cliente de un solo banco</SelectItem>
                      <SelectItem value="varios-bancos">Cliente de varios bancos</SelectItem>
                      <SelectItem value="preferencial">Cliente preferencial/premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="urgencyLevel">¿Qué tan urgente necesitas el crédito?</Label>
                  <Select onValueChange={(value) => handleChange("urgencyLevel", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Nivel de urgencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inmediato">Inmediato (1-3 días)</SelectItem>
                      <SelectItem value="rapido">Rápido (1 semana)</SelectItem>
                      <SelectItem value="normal">Normal (2-3 semanas)</SelectItem>
                      <SelectItem value="flexible">Flexible (1-2 meses)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preferredBank">¿Tienes preferencia por algún banco?</Label>
                  <Select onValueChange={(value) => handleChange("preferredBank", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Banco de preferencia (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ninguno">Sin preferencia</SelectItem>
                      <SelectItem value="bcp">Banco de Crédito BCP</SelectItem>
                      <SelectItem value="bbva">BBVA Continental</SelectItem>
                      <SelectItem value="scotiabank">Scotiabank</SelectItem>
                      <SelectItem value="interbank">Interbank</SelectItem>
                      <SelectItem value="pichincha">Banco Pichincha</SelectItem>
                      <SelectItem value="mibanco">Mi Banco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg">
              Encontrar Mejores Ofertas
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
