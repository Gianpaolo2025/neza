
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { School, Building, Briefcase, Target, Calendar, AlertCircle } from "lucide-react";

interface WorkSituationStepProps {
  workSituation: string;
  monthlyIncome: number;
  hasPayslips: string;
  onWorkSituationChange: (value: string) => void;
  onMonthlyIncomeChange: (value: number) => void;
  onHasPayslipsChange: (value: string) => void;
  onFieldChange: (field: string, value: string) => void;
  formData: any;
  validationErrors: Record<string, string>;
}

export const WorkSituationStep = ({ 
  workSituation, 
  monthlyIncome, 
  hasPayslips,
  onWorkSituationChange,
  onMonthlyIncomeChange,
  onHasPayslipsChange,
  onFieldChange,
  formData,
  validationErrors 
}: WorkSituationStepProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-base font-medium text-slate-700 mb-3 block">
            💼 ¿Cuál es tu situación laboral actual? *
          </Label>
          <Select value={workSituation} onValueChange={onWorkSituationChange}>
            <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationErrors.workSituation ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Selecciona tu situación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="empleado">👔 Empleado (trabajo en planilla)</SelectItem>
              <SelectItem value="independiente">💼 Trabajador independiente</SelectItem>
              <SelectItem value="empresario">🏢 Empresario/Negocio propio</SelectItem>
              <SelectItem value="estudiante">🎓 Estudiante</SelectItem>
              <SelectItem value="jubilado">🏖️ Jubilado/Pensionista</SelectItem>
              <SelectItem value="ama-casa">🏠 Ama de casa</SelectItem>
              <SelectItem value="otro">❓ Otro</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.workSituation && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
              <AlertCircle className="w-4 h-4" />
              {validationErrors.workSituation}
            </div>
          )}
        </div>

        <div>
          <Label className="text-base font-medium text-slate-700 mb-3 block">
            💰 ¿Cuáles son tus ingresos mensuales aproximados? *
          </Label>
          <Select value={monthlyIncome.toString()} onValueChange={(value) => onMonthlyIncomeChange(Number(value))}>
            <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationErrors.monthlyIncome ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Selecciona tu rango de ingresos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="930">Menos de S/ 930 (sueldo mínimo)</SelectItem>
              <SelectItem value="1500">S/ 930 - S/ 1,500</SelectItem>
              <SelectItem value="2500">S/ 1,500 - S/ 2,500</SelectItem>
              <SelectItem value="4000">S/ 2,500 - S/ 4,000</SelectItem>
              <SelectItem value="6000">S/ 4,000 - S/ 6,000</SelectItem>
              <SelectItem value="10000">S/ 6,000 - S/ 10,000</SelectItem>
              <SelectItem value="15000">Más de S/ 10,000</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.monthlyIncome && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
              <AlertCircle className="w-4 h-4" />
              {validationErrors.monthlyIncome}
            </div>
          )}
        </div>
      </div>

      {/* Campos específicos según tipo de trabajo */}
      {workSituation === "estudiante" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-blue-50 rounded-lg">
          <div>
            <Label className="flex items-center gap-2 text-slate-700 mb-2">
              <School className="w-4 h-4" />
              ¿Qué estudias?
            </Label>
            <Input
              value={formData.carrera || ""}
              onChange={(e) => onFieldChange('carrera', e.target.value)}
              placeholder="Ej: Administración, Ingeniería, etc."
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label className="flex items-center gap-2 text-slate-700 mb-2">
              <Calendar className="w-4 h-4" />
              ¿En qué ciclo/año estás?
            </Label>
            <Input
              value={formData.ciclo || ""}
              onChange={(e) => onFieldChange('ciclo', e.target.value)}
              placeholder="Ej: 5to ciclo, 3er año"
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-slate-700 mb-3 block">¿Haces prácticas profesionales?</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.hacePracticas === "si" ? "default" : "outline"}
                onClick={() => onFieldChange('hacePracticas', "si")}
                className={formData.hacePracticas === "si" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300"}
              >
                Sí
              </Button>
              <Button
                type="button"
                variant={formData.hacePracticas === "no" ? "default" : "outline"}
                onClick={() => onFieldChange('hacePracticas', "no")}
                className={formData.hacePracticas === "no" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300"}
              >
                No
              </Button>
            </div>
          </div>
          {formData.hacePracticas === "si" && (
            <div className="md:col-span-2">
              <Label className="flex items-center gap-2 text-slate-700 mb-2">
                <Building className="w-4 h-4" />
                ¿En qué empresa haces prácticas?
              </Label>
              <Input
                value={formData.empresaPracticas || ""}
                onChange={(e) => onFieldChange('empresaPracticas', e.target.value)}
                placeholder="Nombre de la empresa"
                className="border-blue-300 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      )}

      {workSituation === "empleado" && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <Label className="flex items-center gap-2 text-slate-700 mb-2">
            <Building className="w-4 h-4" />
            ¿En qué empresa trabajas?
          </Label>
          <Input
            value={formData.empresaTrabajo || ""}
            onChange={(e) => onFieldChange('empresaTrabajo', e.target.value)}
            placeholder="Nombre de tu empresa"
            className="border-blue-300 focus:border-blue-500"
          />
        </div>
      )}

      {workSituation === "empresario" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-purple-50 rounded-lg">
          <div>
            <Label className="flex items-center gap-2 text-slate-700 mb-2">
              <Building className="w-4 h-4" />
              ¿Cómo se llama tu negocio?
            </Label>
            <Input
              value={formData.nombreNegocio || ""}
              onChange={(e) => onFieldChange('nombreNegocio', e.target.value)}
              placeholder="Nombre de tu negocio"
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label className="flex items-center gap-2 text-slate-700 mb-2">
              <Briefcase className="w-4 h-4" />
              ¿A qué rubro se dedica?
            </Label>
            <Input
              value={formData.rubroNegocio || ""}
              onChange={(e) => onFieldChange('rubroNegocio', e.target.value)}
              placeholder="Ej: Restaurante, Tienda, Servicios"
              className="border-blue-300 focus:border-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="flex items-center gap-2 text-slate-700 mb-2">
              <Target className="w-4 h-4" />
              Describe brevemente tu actividad principal
            </Label>
            <Textarea
              value={formData.actividadPrincipal || ""}
              onChange={(e) => onFieldChange('actividadPrincipal', e.target.value)}
              placeholder="Ej: Venta de comida, consultoría, etc."
              className="border-blue-300 focus:border-blue-500"
              rows={3}
            />
          </div>
        </div>
      )}

      {(workSituation === "independiente" || workSituation === "otro") && (
        <div className="mt-4 p-4 bg-orange-50 rounded-lg">
          <Label className="flex items-center gap-2 text-slate-700 mb-2">
            <Briefcase className="w-4 h-4" />
            Describe tu trabajo o actividad
          </Label>
          <Textarea
            value={formData.otroTrabajo || ""}
            onChange={(e) => onFieldChange('otroTrabajo', e.target.value)}
            placeholder="Describe a qué te dedicas..."
            className="border-blue-300 focus:border-blue-500"
            rows={3}
          />
        </div>
      )}

      <div>
        <Label className="text-base font-medium text-slate-700 mb-3 block">
          📄 ¿Tienes boletas de pago o comprobantes de ingresos?
        </Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={hasPayslips === "si" ? "default" : "outline"}
            onClick={() => onHasPayslipsChange("si")}
            className={hasPayslips === "si" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300"}
          >
            ✅ Sí tengo
          </Button>
          <Button
            type="button"
            variant={hasPayslips === "no" ? "default" : "outline"}
            onClick={() => onHasPayslipsChange("no")}
            className={hasPayslips === "no" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300"}
          >
            ❌ No tengo
          </Button>
        </div>
      </div>
    </div>
  );
};
