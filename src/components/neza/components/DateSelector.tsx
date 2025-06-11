
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, AlertCircle } from "lucide-react";

interface DateSelectorProps {
  birthDate: string;
  onBirthDateChange: (type: 'year' | 'month' | 'day', value: string) => void;
  validationError?: string;
  calculateAge: (birthDate: string) => number;
}

export const DateSelector = ({ birthDate, onBirthDateChange, validationError, calculateAge }: DateSelectorProps) => {
  // Generate optimized year options (from current year - 16 to 1950)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 16; // Usuarios no menores de 16 años
    const years = [];
    for (let year = minYear; year >= 1950; year--) {
      years.push(year);
    }
    return years;
  };

  // Generate month options
  const generateMonthOptions = () => {
    return [
      { value: '01', label: 'Enero' },
      { value: '02', label: 'Febrero' },
      { value: '03', label: 'Marzo' },
      { value: '04', label: 'Abril' },
      { value: '05', label: 'Mayo' },
      { value: '06', label: 'Junio' },
      { value: '07', label: 'Julio' },
      { value: '08', label: 'Agosto' },
      { value: '09', label: 'Septiembre' },
      { value: '10', label: 'Octubre' },
      { value: '11', label: 'Noviembre' },
      { value: '12', label: 'Diciembre' }
    ];
  };

  // Generate day options based on selected month and year
  const generateDayOptions = (year: string, month: string) => {
    if (!year || !month) return Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
  };

  const dateParts = birthDate ? birthDate.split('-') : ['', '', ''];
  const selectedYear = dateParts[0] || '';
  const selectedMonth = dateParts[1] || '';
  const selectedDay = dateParts[2] || '';

  return (
    <div>
      <Label className="flex items-center gap-2 text-slate-700 mb-2">
        <Calendar className="w-4 h-4" />
        Fecha de Nacimiento *
      </Label>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Select 
            value={selectedDay} 
            onValueChange={(value) => onBirthDateChange('day', value)}
          >
            <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationError ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Día" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-white z-50 border border-gray-200 shadow-lg">
              {generateDayOptions(selectedYear, selectedMonth).map((day) => (
                <SelectItem key={day} value={day} className="cursor-pointer hover:bg-blue-50">
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select 
            value={selectedMonth} 
            onValueChange={(value) => onBirthDateChange('month', value)}
          >
            <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationError ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-white z-50 border border-gray-200 shadow-lg">
              {generateMonthOptions().map((month) => (
                <SelectItem key={month.value} value={month.value} className="cursor-pointer hover:bg-blue-50">
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Select 
            value={selectedYear} 
            onValueChange={(value) => onBirthDateChange('year', value)}
          >
            <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationError ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-white z-50 border border-gray-200 shadow-lg">
              {generateYearOptions().map((year) => (
                <SelectItem key={year} value={year.toString()} className="cursor-pointer hover:bg-blue-50">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {validationError && (
        <div className="flex items-center gap-2 text-red-600 text-sm mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
      {birthDate && (
        <div className="text-sm text-slate-600 mt-2">
          Edad: {calculateAge(birthDate)} años
        </div>
      )}
    </div>
  );
};
