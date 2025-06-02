
import { UserData } from "@/pages/Index";

export interface BankOffer {
  id: string;
  bankName: string;
  interestRate: number;
  monthlyPayment: number;
  term: number; // en meses
  totalCost: number;
  savings: number;
  status: "aprobado" | "pre-aprobado" | "pendiente";
  approvalTime: string;
  riskLevel: "Bajo" | "Medio" | "Alto";
  recommended: boolean;
  requirements: string[];
}

const banks = [
  {
    name: "Banco de Crédito BCP",
    baseRate: 18,
    riskAdjustment: { excelente: -4, bueno: -2, regular: 0, nuevo: 2 },
    maxAmount: { dependiente: 150000, independiente: 100000, empresario: 200000, pensionista: 80000 },
    minIncome: { dependiente: 1500, independiente: 2000, empresario: 3000, pensionista: 1000 }
  },
  {
    name: "BBVA Continental", 
    baseRate: 19,
    riskAdjustment: { excelente: -3, bueno: -1, regular: 1, nuevo: 3 },
    maxAmount: { dependiente: 120000, independiente: 80000, empresario: 180000, pensionista: 60000 },
    minIncome: { dependiente: 1800, independiente: 2500, empresario: 3500, pensionista: 1200 }
  },
  {
    name: "Scotiabank Perú",
    baseRate: 17,
    riskAdjustment: { excelente: -3, bueno: -2, regular: 0, nuevo: 2 },
    maxAmount: { dependiente: 140000, independiente: 90000, empresario: 190000, pensionista: 70000 },
    minIncome: { dependiente: 1600, independiente: 2200, empresario: 3200, pensionista: 1100 }
  },
  {
    name: "Interbank",
    baseRate: 20,
    riskAdjustment: { excelente: -5, bueno: -3, regular: -1, nuevo: 1 },
    maxAmount: { dependiente: 100000, independiente: 70000, empresario: 150000, pensionista: 50000 },
    minIncome: { dependiente: 2000, independiente: 2800, empresario: 4000, pensionista: 1500 }
  },
  {
    name: "Banco Pichincha",
    baseRate: 22,
    riskAdjustment: { excelente: -4, bueno: -2, regular: 1, nuevo: 3 },
    maxAmount: { dependiente: 80000, independiente: 60000, empresario: 120000, pensionista: 40000 },
    minIncome: { dependiente: 1200, independiente: 1800, empresario: 2500, pensionista: 800 }
  },
  {
    name: "Mi Banco",
    baseRate: 25,
    riskAdjustment: { excelente: -6, bueno: -4, regular: -2, nuevo: 0 },
    maxAmount: { dependiente: 50000, independiente: 40000, empresario: 80000, pensionista: 30000 },
    minIncome: { dependiente: 800, independiente: 1200, empresario: 1500, pensionista: 600 }
  }
];

export const generateOffers = (userData: UserData): BankOffer[] => {
  const offers: BankOffer[] = [];
  
  // Validaciones más estrictas basadas en parámetros reales
  const incomeRatio = userData.requestedAmount / userData.monthlyIncome;
  const employmentType = userData.employmentType as keyof typeof banks[0].maxAmount;
  
  // Factor de riesgo más preciso
  let riskMultiplier = 1;
  if (incomeRatio > 8) riskMultiplier = 1.4; // Muy alto riesgo
  else if (incomeRatio > 6) riskMultiplier = 1.3;
  else if (incomeRatio > 4) riskMultiplier = 1.15;
  else if (incomeRatio < 2) riskMultiplier = 0.85; // Bajo riesgo

  // Ajuste por deudas existentes
  const debtMultiplier = {
    "no": 0.95,
    "pocas": 1.0,
    "moderadas": 1.2,
    "altas": 1.4
  }[userData.hasOtherDebts || "pocas"];

  // Ajuste por relación bancaria
  const relationshipMultiplier = {
    "nuevo": 1.3,
    "un-banco": 1.1,
    "varios-bancos": 1.0,
    "preferencial": 0.9
  }[userData.bankingRelationship || "nuevo"];

  banks.forEach((bank, index) => {
    // Verificar si el banco puede atender la solicitud
    const maxAmount = bank.maxAmount[employmentType];
    const minIncome = bank.minIncome[employmentType];
    
    // Si no cumple requisitos mínimos, el banco no oferta
    if (userData.requestedAmount > maxAmount || userData.monthlyIncome < minIncome) {
      return; // Skip this bank
    }

    const creditHistory = userData.creditHistory as keyof typeof bank.riskAdjustment;
    let interestRate = bank.baseRate + bank.riskAdjustment[creditHistory];
    
    // Aplicar multiplicadores de riesgo
    interestRate *= riskMultiplier * debtMultiplier * relationshipMultiplier;
    
    // Bonificación por banco preferido
    if (userData.preferredBank && bank.name.toLowerCase().includes(userData.preferredBank)) {
      interestRate *= 0.95; // 5% descuento
    }
    
    // Variación competitiva (más realista)
    const competitiveVariation = (Math.random() - 0.5) * 1.5; // +/- 0.75%
    interestRate += competitiveVariation;
    
    // Límites realistas del mercado peruano
    interestRate = Math.max(14, Math.min(45, interestRate));
    
    // Calcular plazo basado en monto y tipo de producto
    let term = 24; // Default 2 años
    if (userData.productType === "credito-vehicular") term = 60; // 5 años
    else if (userData.productType === "credito-hipotecario") term = 240; // 20 años
    else if (userData.requestedAmount > 50000) term = 36; // 3 años para montos altos
    
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (userData.requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1);
    
    const totalCost = monthlyPayment * term;
    const averageCost = userData.requestedAmount * (1 + (interestRate * term / 12 / 100)); 
    const savings = Math.max(0, averageCost - totalCost);
    
    // Estado más realista basado en perfil
    let status: BankOffer["status"] = "pendiente";
    const approvalScore = (
      (userData.creditHistory === "excelente" ? 40 : 
       userData.creditHistory === "bueno" ? 30 : 
       userData.creditHistory === "regular" ? 15 : 5) +
      (incomeRatio < 3 ? 30 : incomeRatio < 5 ? 20 : 10) +
      (userData.monthlyIncome > minIncome * 2 ? 20 : 10) +
      (userData.hasOtherDebts === "no" ? 10 : 0)
    );
    
    if (approvalScore >= 70) status = "aprobado";
    else if (approvalScore >= 50) status = "pre-aprobado";
    
    // Nivel de riesgo más preciso
    let riskLevel: BankOffer["riskLevel"] = "Medio";
    if (interestRate < 20 && approvalScore >= 60) riskLevel = "Bajo";
    else if (interestRate > 30 || approvalScore < 40) riskLevel = "Alto";
    
    // Tiempo de aprobación realista
    const approvalTime = status === "aprobado" ? 
      (userData.urgencyLevel === "inmediato" ? "24 horas" : "48 horas") :
      status === "pre-aprobado" ? "3-5 días" : "5-10 días";

    // Requisitos específicos por banco y perfil
    const baseRequirements = [
      "DNI vigente",
      "Sustento de ingresos",
      "Reporte crediticio actualizado"
    ];

    if (userData.employmentType === "dependiente") {
      baseRequirements.push("Últimas 3 boletas de pago", "Certificado de trabajo");
    } else if (userData.employmentType === "independiente") {
      baseRequirements.push("Declaración jurada de ingresos", "Estados financieros");
    }

    if (userData.requestedAmount > 30000) {
      baseRequirements.push("Garantía adicional o aval");
    }

    offers.push({
      id: `${bank.name}-${Date.now()}-${index}`,
      bankName: bank.name,
      interestRate: Math.round(interestRate * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment),
      term,
      totalCost: Math.round(totalCost),
      savings: Math.round(savings),
      status,
      approvalTime,
      riskLevel,
      recommended: false,
      requirements: baseRequirements
    });
  });
  
  // Marcar la mejor oferta como recomendada
  if (offers.length > 0) {
    const bestOffer = offers.reduce((prev, current) => 
      (current.interestRate < prev.interestRate) ? current : prev
    );
    bestOffer.recommended = true;
  }
  
  // Ordenar por tasa de interés
  return offers.sort((a, b) => a.interestRate - b.interestRate);
};
