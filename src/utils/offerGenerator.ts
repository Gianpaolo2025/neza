
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
    minIncome: { dependiente: 1000, independiente: 1500, empresario: 2000, pensionista: 800 }
  },
  {
    name: "BBVA Continental", 
    baseRate: 19,
    riskAdjustment: { excelente: -3, bueno: -1, regular: 1, nuevo: 3 },
    maxAmount: { dependiente: 120000, independiente: 80000, empresario: 180000, pensionista: 60000 },
    minIncome: { dependiente: 1200, independiente: 1800, empresario: 2500, pensionista: 900 }
  },
  {
    name: "Scotiabank Perú",
    baseRate: 17,
    riskAdjustment: { excelente: -3, bueno: -2, regular: 0, nuevo: 2 },
    maxAmount: { dependiente: 140000, independiente: 90000, empresario: 190000, pensionista: 70000 },
    minIncome: { dependiente: 1100, independiente: 1600, empresario: 2200, pensionista: 850 }
  },
  {
    name: "Interbank",
    baseRate: 20,
    riskAdjustment: { excelente: -5, bueno: -3, regular: -1, nuevo: 1 },
    maxAmount: { dependiente: 100000, independiente: 70000, empresario: 150000, pensionista: 50000 },
    minIncome: { dependiente: 1400, independiente: 2000, empresario: 3000, pensionista: 1000 }
  },
  {
    name: "Banco Pichincha",
    baseRate: 22,
    riskAdjustment: { excelente: -4, bueno: -2, regular: 1, nuevo: 3 },
    maxAmount: { dependiente: 80000, independiente: 60000, empresario: 120000, pensionista: 40000 },
    minIncome: { dependiente: 900, independiente: 1300, empresario: 1800, pensionista: 700 }
  },
  {
    name: "Mi Banco",
    baseRate: 25,
    riskAdjustment: { excelente: -6, bueno: -4, regular: -2, nuevo: 0 },
    maxAmount: { dependiente: 50000, independiente: 40000, empresario: 80000, pensionista: 30000 },
    minIncome: { dependiente: 600, independiente: 900, empresario: 1200, pensionista: 500 }
  }
];

export const generateOffers = (userData: UserData): BankOffer[] => {
  const offers: BankOffer[] = [];
  
  console.log("Generando ofertas para usuario:", userData);
  
  // Validaciones más flexibles para generar más ofertas
  const incomeRatio = userData.requestedAmount / Math.max(userData.monthlyIncome, 1000);
  const employmentType = (userData.employmentType || "dependiente") as keyof typeof banks[0]['maxAmount'];
  
  // Factor de riesgo más flexible
  let riskMultiplier = 1;
  if (incomeRatio > 10) riskMultiplier = 1.5;
  else if (incomeRatio > 7) riskMultiplier = 1.3;
  else if (incomeRatio > 5) riskMultiplier = 1.2;
  else if (incomeRatio < 3) riskMultiplier = 0.9;

  // Ajuste por deudas existentes
  const debtMultiplier = {
    "no": 0.95,
    "pocas": 1.0,
    "moderadas": 1.15,
    "altas": 1.3
  }[userData.hasOtherDebts || "pocas"];

  // Ajuste por relación bancaria
  const relationshipMultiplier = {
    "nuevo": 1.2,
    "un-banco": 1.05,
    "varios-bancos": 1.0,
    "preferencial": 0.95
  }[userData.bankingRelationship || "nuevo"];

  banks.forEach((bank, index) => {
    // Criterios más flexibles para generar ofertas de todos los bancos
    const maxAmount = bank.maxAmount[employmentType];
    const minIncome = bank.minIncome[employmentType];
    
    // Permitir ofertas incluso si no cumple completamente los requisitos (con condiciones especiales)
    let canOffer = true;
    let status: BankOffer["status"] = "aprobado";
    let specialConditions = false;
    
    if (userData.requestedAmount > maxAmount) {
      // Ofrecer el monto máximo disponible en lugar de rechazar
      specialConditions = true;
      status = "pre-aprobado";
    }
    
    if (userData.monthlyIncome < minIncome) {
      status = "pendiente";
      specialConditions = true;
    }

    const creditHistory = (userData.creditHistory || "nuevo") as keyof typeof bank.riskAdjustment;
    let interestRate = bank.baseRate + bank.riskAdjustment[creditHistory];
    
    // Aplicar multiplicadores de riesgo
    interestRate *= riskMultiplier * debtMultiplier * relationshipMultiplier;
    
    // Bonificación por banco preferido
    if (userData.preferredBank && bank.name.toLowerCase().includes(userData.preferredBank.toLowerCase())) {
      interestRate *= 0.95;
    }
    
    // Variación competitiva
    const competitiveVariation = (Math.random() - 0.5) * 2;
    interestRate += competitiveVariation;
    
    // Límites del mercado peruano
    interestRate = Math.max(15, Math.min(40, interestRate));
    
    // Calcular plazo basado en monto y tipo de producto
    let term = 24;
    if (userData.productType === "credito-vehicular") term = 60;
    else if (userData.productType === "credito-hipotecario") term = 240;
    else if (userData.requestedAmount > 50000) term = 36;
    else if (userData.requestedAmount > 20000) term = 30;
    
    // Ajustar monto si excede límites del banco
    const offerAmount = Math.min(userData.requestedAmount, maxAmount);
    
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (offerAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1);
    
    const totalCost = monthlyPayment * term;
    const averageCost = offerAmount * (1 + (interestRate * term / 12 / 100)); 
    const savings = Math.max(0, averageCost - totalCost);
    
    // Determinar estado final
    const approvalScore = (
      (creditHistory === "excelente" ? 40 : 
       creditHistory === "bueno" ? 30 : 
       creditHistory === "regular" ? 15 : 10) +
      (incomeRatio < 4 ? 30 : incomeRatio < 7 ? 20 : 10) +
      (userData.monthlyIncome > minIncome ? 20 : 5) +
      (userData.hasOtherDebts === "no" ? 10 : 0)
    );
    
    if (specialConditions) {
      status = approvalScore >= 50 ? "pre-aprobado" : "pendiente";
    } else if (approvalScore >= 60) {
      status = "aprobado";
    } else if (approvalScore >= 40) {
      status = "pre-aprobado";
    } else {
      status = "pendiente";
    }
    
    // Nivel de riesgo
    let riskLevel: BankOffer["riskLevel"] = "Medio";
    if (interestRate < 22 && approvalScore >= 50) riskLevel = "Bajo";
    else if (interestRate > 30 || approvalScore < 35) riskLevel = "Alto";
    
    // Tiempo de aprobación
    const approvalTime = status === "aprobado" ? 
      (userData.urgencyLevel === "inmediato" ? "24 horas" : "48 horas") :
      status === "pre-aprobado" ? "3-5 días" : "5-10 días";

    // Requisitos específicos
    const baseRequirements = [
      "DNI vigente",
      "Sustento de ingresos últimos 3 meses"
    ];

    if (status === "pendiente") {
      baseRequirements.push("Evaluación crediticia adicional");
    }

    if (employmentType === "dependiente") {
      baseRequirements.push("Últimas 3 boletas de pago", "Certificado de trabajo");
    } else if (employmentType === "independiente") {
      baseRequirements.push("Declaración jurada de ingresos", "Comprobantes de ingresos");
    }

    if (specialConditions) {
      baseRequirements.push("Condiciones especiales aplicarán");
    }

    offers.push({
      id: `${bank.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}-${index}`,
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
  
  console.log("Ofertas generadas:", offers.length);
  
  // Marcar la mejor oferta como recomendada
  if (offers.length > 0) {
    const eligibleOffers = offers.filter(o => o.status === "aprobado");
    const offersToConsider = eligibleOffers.length > 0 ? eligibleOffers : offers;
    
    const bestOffer = offersToConsider.reduce((prev, current) => 
      (current.interestRate < prev.interestRate) ? current : prev
    );
    bestOffer.recommended = true;
  }
  
  // Ordenar por estado y luego por tasa de interés
  return offers.sort((a, b) => {
    const statusOrder = { "aprobado": 1, "pre-aprobado": 2, "pendiente": 3 };
    const statusA = statusOrder[a.status];
    const statusB = statusOrder[b.status];
    
    if (statusA !== statusB) return statusA - statusB;
    return a.interestRate - b.interestRate;
  });
};
