
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { BankDashboard } from "@/components/BankDashboard";
import { sbsEntities } from "@/data/sbsEntities";

const BankRoute = () => {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Obtener todas las entidades financieras y organizarlas por tipo
  const allEntities = sbsEntities.map(entity => ({
    value: entity.id,
    label: entity.name,
    type: entity.type,
    sbsCode: entity.sbsCode
  }));

  // Organizar por tipo para mejor visualización
  const entityGroups = {
    banco: allEntities.filter(e => e.type === 'banco'),
    financiera: allEntities.filter(e => e.type === 'financiera'),
    caja: allEntities.filter(e => e.type === 'caja'),
    cooperativa: allEntities.filter(e => e.type === 'cooperativa')
  };

  const getEntityTypeLabel = (type: string) => {
    switch(type) {
      case 'banco': return 'Bancos';
      case 'financiera': return 'Financieras';
      case 'caja': return 'Cajas Municipales y Rurales';
      case 'cooperativa': return 'Cooperativas';
      default: return 'Otras';
    }
  };

  const selectedEntity = allEntities.find(entity => entity.value === selectedBank);

  if (selectedBank) {
    return <BankDashboard bankName={selectedEntity?.label || selectedBank} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Acceso Bancario</CardTitle>
          <CardDescription>
            Selecciona tu entidad financiera supervisada por la SBS para acceder al dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank-select">Institución Financiera</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedEntity
                    ? selectedEntity.label
                    : "Buscar institución financiera..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Buscar institución..." 
                    className="h-9"
                  />
                  <CommandEmpty>No se encontró la institución.</CommandEmpty>
                  <CommandList className="max-h-64">
                    {Object.entries(entityGroups).map(([type, entities]) => 
                      entities.length > 0 && (
                        <CommandGroup key={type} heading={getEntityTypeLabel(type)}>
                          {entities.map((entity) => (
                            <CommandItem
                              key={entity.value}
                              value={entity.label}
                              onSelect={() => {
                                setSelectedBank(entity.value);
                                setOpen(false);
                              }}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{entity.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  Código SBS: {entity.sbsCode}
                                </span>
                              </div>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  selectedBank === entity.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium mb-1">Instituciones disponibles:</p>
            <ul className="text-xs space-y-1">
              <li>• {entityGroups.banco.length} Bancos</li>
              <li>• {entityGroups.financiera.length} Financieras</li>
              <li>• {entityGroups.caja.length} Cajas Municipales y Rurales</li>
              <li>• {entityGroups.cooperativa.length} Cooperativas</li>
              <li className="font-medium pt-1">Total: {allEntities.length} instituciones supervisadas por la SBS</li>
            </ul>
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
