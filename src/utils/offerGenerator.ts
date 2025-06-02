
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
    riskAdjustment: { excelente: -4, bueno: -2, regular: 0, nuevo: 2 }
  },
  {
    name: "BBVA Continental", 
    baseRate: 19,
    riskAdjustment: { excelente: -3, bueno: -1, regular: 1, nuevo: 3 }
  },
  {
    name: "Scotiabank Perú",
    baseRate: 17,
    riskAdjustment: { excelente: -3, bueno: -2, regular: 0, nuevo: 2 }
  },
  {
    name: "Interbank",
    baseRate: 20,
    riskAdjustment: { excelente: -5, bueno: -3, regular: -1, nuevo: 1 }
  },
  {
    name: "Banco Pichincha",
    baseRate: 22,
    riskAdjustment: { excelente: -4, bueno: -2, regular: 1, nuevo: 3 }
  },
  {
    name: "Mi Banco",
    baseRate: 25,
    riskAdjustment: { excelente: -6, bueno: -4, regular: -2, nuevo: 0 }
  }
];

export const generateOffers = (userData: UserData): BankOffer[] => {
  const offers: BankOffer[] = [];
  
  // Factor de riesgo basado en ingreso vs monto solicitado
  const incomeRatio = userData.requestedAmount / userData.monthlyIncome;
  let riskMultiplier = 1;
  
  if (incomeRatio > 10) riskMultiplier = 1.3;
  else if (incomeRatio > 5) riskMultiplier = 1.1;
  else if (incomeRatio < 2) riskMultiplier = 0.9;

  banks.forEach((bank, index) => {
    const creditHistory = userData.creditHistory as keyof typeof bank.riskAdjustment;
    let interestRate = bank.baseRate + bank.riskAdjustment[creditHistory];
    interestRate *= riskMultiplier;
    
    // Añadir variación aleatoria para simular "ofertas competitivas"
    interestRate += (Math.random() - 0.5) * 2;
    interestRate = Math.max(12, Math.min(35, interestRate)); // Límites realistas
    
    const term = 24; // 2 años estándar para créditos personales
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (userData.requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1);
    
    const totalCost = monthlyPayment * term;
    const averageCost = userData.requestedAmount * 1.4; // Asumiendo 40% de interés promedio
    const savings = Math.max(0, averageCost - totalCost);
    
    // Determinar estado de aprobación
    let status: BankOffer["status"] = "pendiente";
    if (incomeRatio < 3 && userData.creditHistory === "excelente") status = "aprobado";
    else if (incomeRatio < 5 && (userData.creditHistory === "excelente" || userData.creditHistory === "bueno")) status = "pre-aprobado";
    
    // Determinar nivel de riesgo
    let riskLevel: BankOffer["riskLevel"] = "Medio";
    if (interestRate < 18) riskLevel = "Bajo";
    else if (interestRate > 25) riskLevel = "Alto";
    
    offers.push({
      id: `${bank.name}-${Date.now()}-${index}`,
      bankName: bank.name,
      interestRate: Math.round(interestRate * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment),
      term,
      totalCost: Math.round(totalCost),
      savings: Math.round(savings),
      status,
      approvalTime: status === "aprobado" ? "24 horas" : status === "pre-aprobado" ? "48 horas" : "3-5 días",
      riskLevel,
      recommended: false,
      requirements: [
        "DNI vigente",
        "Constancia de ingresos",
        "Reporte crediticio",
        userData.employmentType === "dependiente" ? "Boletas de pago" : "Declaración de impuestos"
      ]
    });
  });
  
  // Marcar la mejor oferta como recomendada
  const bestOffer = offers.reduce((prev, current) => 
    (current.interestRate < prev.interestRate) ? current : prev
  );
  bestOffer.recommended = true;
  
  // Ordenar por tasa de interés
  return offers.sort((a, b) => a.interestRate - b.interestRate);
};
