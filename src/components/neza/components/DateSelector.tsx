import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, AlertCircle } from "lucide-react";

interface DateSelectorProps {
  birthDate: string;
  onBirthDateChange: (type: 'year' | 'month' | 'day', value: string) => void;
  validationError?: string;
  calculateAge: (birthDate: string) => number;
  isOptional?: boolean;
}

export const DateSelector = ({ birthDate, onBirthDateChange, validationError, calculateAge, isOptional = false }: DateSelectorProps) => {
  // Generate optimized year options (from current year - 18 to 1950 for financial products)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 18; // Usuarios no menores de 18 años para productos financieros
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
    if (!year || !month) {
      return Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    }
    
    try {
      const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
    } catch (error) {
      console.error('Error calculating days in month:', error);
      return Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    }
  };

  const dateParts = birthDate ? birthDate.split('-') : ['', '', ''];
  const selectedYear = dateParts[0] || '';
  const selectedMonth = dateParts[1] || '';
  const selectedDay = dateParts[2] || '';

  // Get month name for display
  const getMonthName = (monthValue: string) => {
    const monthOptions = generateMonthOptions();
    const month = monthOptions.find(m => m.value === monthValue);
    return month ? month.label : 'Mes';
  };

  // Validate selected date
  const isValidDate = (year: string, month: string, day: string) => {
    if (!year || !month || !day) return true; // Allow partial dates during selection
    
    try {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.getFullYear() === parseInt(year) && 
             date.getMonth() === parseInt(month) - 1 && 
             date.getDate() === parseInt(day);
    } catch {
      return false;
    }
  };

  const handleDateChange = (type: 'year' | 'month' | 'day', value: string) => {
    // Validate the date combination after the change
    let newYear = selectedYear;
    let newMonth = selectedMonth;
    let newDay = selectedDay;

    if (type === 'year') newYear = value;
    if (type === 'month') newMonth = value;
    if (type === 'day') newDay = value;

    // If day is invalid for the selected month/year, reset it
    if (newYear && newMonth && newDay) {
      const maxDays = new Date(parseInt(newYear), parseInt(newMonth), 0).getDate();
      if (parseInt(newDay) > maxDays) {
        newDay = maxDays.toString().padStart(2, '0');
        onBirthDateChange('day', newDay);
      }
    }

    onBirthDateChange(type, value);
  };

  return (
    <div>
      <Label className="flex items-center gap-2 text-slate-700 mb-2">
        <Calendar className="w-4 h-4" />
        Fecha de Nacimiento {!isOptional && '*'}
      </Label>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Select
            value={selectedDay}
            onValueChange={(value) => handleDateChange('day', value)}
          >
            <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationError ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Día">
                {selectedDay ? selectedDay : "Día"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-white z-[100] border border-gray-200 shadow-lg">
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
            onValueChange={(value) => handleDateChange('month', value)}
          >
            <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationError ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Mes">
                {selectedMonth ? getMonthName(selectedMonth) : "Mes"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-white z-[100] border border-gray-200 shadow-lg">
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
            onValueChange={(value) => handleDateChange('year', value)}
          >
            <SelectTrigger className={`border-blue-300 focus:border-blue-500 ${validationError ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Año">
                {selectedYear ? selectedYear : "Año"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-white z-[100] border border-gray-200 shadow-lg">
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
      {!isValidDate(selectedYear, selectedMonth, selectedDay) && selectedYear && selectedMonth && selectedDay && (
        <div className="flex items-center gap-2 text-red-600 text-sm mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Fecha inválida. Por favor verifica los valores seleccionados.</span>
        </div>
      )}
      {birthDate && isValidDate(selectedYear, selectedMonth, selectedDay) && (
        <div className="text-sm text-slate-600 mt-2">
          Edad: {calculateAge(birthDate)} años
        </div>
      )}
    </div>
  );
};
