import { UserData } from "@/pages/Index";

export interface BankOffer {
  id: string;
  bankName: string;
  interestRate: number;
  rate: number;
  monthlyPayment: number;
  term: number;
  maxTerm: number;
  maxAmount: number;
  totalCost: number;
  savings: number;
  status: "aprobado" | "pre-aprobado" | "pendiente";
  approvalTime: string;
  riskLevel: "Bajo" | "Medio" | "Alto";
  recommended: boolean;
  requirements: string[];
  score: number;
  productType: string;
  features: string[];
  description: string;
}

const banks = [
  {
    name: "Banco de Crédito BCP",
    baseRate: 18,
    riskAdjustment: { excelente: -4, bueno: -2, regular: 0, nuevo: 2 },
    maxAmount: { dependiente: 150000, independiente: 100000, empresario: 200000, pensionista: 80000 },
    minIncome: { dependiente: 1000, independiente: 1500, empresario: 2000, pensionista: 800 },
    productTypes: ["credito-personal", "credito-vehicular", "credito-hipotecario", "tarjeta-credito"]
  },
  {
    name: "BBVA Continental", 
    baseRate: 19,
    riskAdjustment: { excelente: -3, bueno: -1, regular: 1, nuevo: 3 },
    maxAmount: { dependiente: 120000, independiente: 80000, empresario: 180000, pensionista: 60000 },
    minIncome: { dependiente: 1200, independiente: 1800, empresario: 2500, pensionista: 900 },
    productTypes: ["credito-personal", "credito-vehicular", "tarjeta-credito"]
  },
  {
    name: "Scotiabank Perú",
    baseRate: 17,
    riskAdjustment: { excelente: -3, bueno: -2, regular: 0, nuevo: 2 },
    maxAmount: { dependiente: 140000, independiente: 90000, empresario: 190000, pensionista: 70000 },
    minIncome: { dependiente: 1100, independiente: 1600, empresario: 2200, pensionista: 850 },
    productTypes: ["credito-personal", "credito-vehicular", "credito-hipotecario", "tarjeta-credito"]
  },
  {
    name: "Interbank",
    baseRate: 20,
    riskAdjustment: { excelente: -5, bueno: -3, regular: -1, nuevo: 1 },
    maxAmount: { dependiente: 100000, independiente: 70000, empresario: 150000, pensionista: 50000 },
    minIncome: { dependiente: 1400, independiente: 2000, empresario: 3000, pensionista: 1000 },
    productTypes: ["credito-personal", "tarjeta-credito"]
  },
  {
    name: "Banco Pichincha",
    baseRate: 22,
    riskAdjustment: { excelente: -4, bueno: -2, regular: 1, nuevo: 3 },
    maxAmount: { dependiente: 80000, independiente: 60000, empresario: 120000, pensionista: 40000 },
    minIncome: { dependiente: 900, independiente: 1300, empresario: 1800, pensionista: 700 },
    productTypes: ["credito-personal", "tarjeta-credito"]
  },
  {
    name: "Mi Banco",
    baseRate: 25,
    riskAdjustment: { excelente: -6, bueno: -4, regular: -2, nuevo: 0 },
    maxAmount: { dependiente: 50000, independiente: 40000, empresario: 80000, pensionista: 30000 },
    minIncome: { dependiente: 600, independiente: 900, empresario: 1200, pensionista: 500 },
    productTypes: ["credito-personal"]
  },
  {
    name: "Banco Falabella",
    baseRate: 21,
    riskAdjustment: { excelente: -3, bueno: -1, regular: 1, nuevo: 2 },
    maxAmount: { dependiente: 70000, independiente: 50000, empresario: 100000, pensionista: 35000 },
    minIncome: { dependiente: 1000, independiente: 1400, empresario: 2000, pensionista: 750 },
    productTypes: ["credito-personal", "tarjeta-credito"]
  },
  {
    name: "Banco Ripley",
    baseRate: 23,
    riskAdjustment: { excelente: -4, bueno: -2, regular: 0, nuevo: 2 },
    maxAmount: { dependiente: 60000, independiente: 45000, empresario: 90000, pensionista: 30000 },
    minIncome: { dependiente: 950, independiente: 1350, empresario: 1900, pensionista: 700 },
    productTypes: ["credito-personal", "tarjeta-credito"]
  },
  {
    name: "Santander Perú",
    baseRate: 19,
    riskAdjustment: { excelente: -3, bueno: -1, regular: 1, nuevo: 2 },
    maxAmount: { dependiente: 110000, independiente: 75000, empresario: 160000, pensionista: 55000 },
    minIncome: { dependiente: 1150, independiente: 1700, empresario: 2300, pensionista: 850 },
    productTypes: ["credito-personal", "credito-vehicular", "tarjeta-credito"]
  },
  {
    name: "Compartamos Banco",
    baseRate: 28,
    riskAdjustment: { excelente: -5, bueno: -3, regular: -1, nuevo: 1 },
    maxAmount: { dependiente: 35000, independiente: 25000, empresario: 50000, pensionista: 20000 },
    minIncome: { dependiente: 500, independiente: 700, empresario: 1000, pensionista: 400 },
    productTypes: ["credito-personal"]
  },
  {
    name: "CMAC Cusco",
    baseRate: 26,
    riskAdjustment: { excelente: -4, bueno: -2, regular: 0, nuevo: 2 },
    maxAmount: { dependiente: 45000, independiente: 35000, empresario: 70000, pensionista: 25000 },
    minIncome: { dependiente: 700, independiente: 1000, empresario: 1500, pensionista: 600 },
    productTypes: ["credito-personal", "credito-vehicular"]
  },
  {
    name: "CMAC Arequipa",
    baseRate: 24,
    riskAdjustment: { excelente: -3, bueno: -1, regular: 1, nuevo: 2 },
    maxAmount: { dependiente: 40000, independiente: 30000, empresario: 60000, pensionista: 20000 },
    minIncome: { dependiente: 650, independiente: 950, empresario: 1400, pensionista: 550 },
    productTypes: ["credito-personal"]
  },
  {
    name: "Financiera Confianza",
    baseRate: 27,
    riskAdjustment: { excelente: -4, bueno: -2, regular: 0, nuevo: 1 },
    maxAmount: { dependiente: 38000, independiente: 28000, empresario: 55000, pensionista: 18000 },
    minIncome: { dependiente: 600, independiente: 800, empresario: 1200, pensionista: 500 },
    productTypes: ["credito-personal"]
  }
];

export const generateOffers = (userData: UserData): BankOffer[] => {
  console.log("Generando ofertas para usuario:", userData);
  
  // Validación de datos mínimos
  if (!userData.requestedAmount || userData.requestedAmount <= 0 || 
      !userData.monthlyIncome || userData.monthlyIncome <= 0 ||
      !userData.productType) {
    console.log("Datos insuficientes, generando ofertas limitadas");
    return generateLimitedOffers(userData);
  }
  
  const offers: BankOffer[] = [];
  const employmentType = (userData.employmentType || "dependiente") as keyof typeof banks[0]['maxAmount'];
  
  // Filtrar bancos que ofrezcan el producto solicitado
  const eligibleBanks = banks.filter(bank => 
    bank.productTypes.includes(userData.productType || "credito-personal")
  );
  
  console.log(`Bancos elegibles para ${userData.productType}: ${eligibleBanks.length}`);
  
  eligibleBanks.forEach((bank, index) => {
    const maxAmount = bank.maxAmount[employmentType];
    const minIncome = bank.minIncome[employmentType];
    
    // Criterios estrictos para calificar
    const canOffer = evaluateUserEligibility(userData, bank, maxAmount, minIncome);
    
    if (!canOffer.eligible) {
      console.log(`${bank.name}: No elegible - ${canOffer.reason}`);
      return; // No generar oferta para este banco
    }

    const offer = generateBankOffer(userData, bank, index, maxAmount, minIncome);
    if (offer) {
      offers.push(offer);
    }
  });
  
  console.log(`Ofertas generadas: ${offers.length} de ${eligibleBanks.length} bancos elegibles`);
  
  // Si no hay ofertas suficientes, generar algunas alternativas
  if (offers.length === 0) {
    return generateAlternativeOffers(userData);
  }
  
  // Marcar la mejor oferta como recomendada
  if (offers.length > 0) {
    const bestOffer = offers.reduce((prev, current) => 
      (current.score > prev.score) ? current : prev
    );
    bestOffer.recommended = true;
  }
  
  // Ordenar por score (de mayor a menor)
  return offers.sort((a, b) => b.score - a.score);
};

const evaluateUserEligibility = (userData: UserData, bank: any, maxAmount: number, minIncome: number) => {
  // Verificar monto máximo
  if (userData.requestedAmount > maxAmount) {
    return { eligible: false, reason: `Monto excede límite (${maxAmount})` };
  }
  
  // Verificar ingresos mínimos
  if (userData.monthlyIncome < minIncome * 0.7) { // 30% de flexibilidad
    return { eligible: false, reason: `Ingresos insuficientes (min: ${minIncome})` };
  }
  
  // Verificar relación deuda-ingreso
  const debtToIncomeRatio = userData.requestedAmount / userData.monthlyIncome;
  if (debtToIncomeRatio > 15) { // Máximo 15 veces el ingreso mensual
    return { eligible: false, reason: "Relación deuda-ingreso muy alta" };
  }
  
  return { eligible: true, reason: "Cumple criterios" };
};

const generateBankOffer = (userData: UserData, bank: any, index: number, maxAmount: number, minIncome: number): BankOffer | null => {
  const creditHistory = (userData.creditHistory || "nuevo") as keyof typeof bank.riskAdjustment;
  let interestRate = bank.baseRate + bank.riskAdjustment[creditHistory];
  
  // Ajustes por perfil
  const incomeRatio = userData.requestedAmount / userData.monthlyIncome;
  if (incomeRatio > 10) interestRate += 3;
  else if (incomeRatio > 7) interestRate += 2;
  else if (incomeRatio > 5) interestRate += 1;
  else if (incomeRatio < 3) interestRate -= 1;

  // Ajuste por deudas existentes
  const debtMultiplier = {
    "no": 0.95,
    "pocas": 1.0,
    "moderadas": 1.15,
    "altas": 1.3
  }[userData.hasOtherDebts || "pocas"];
  
  interestRate *= debtMultiplier;
  interestRate = Math.max(15, Math.min(40, interestRate));
  
  // Calcular términos
  let term = calculateTerm(userData.requestedAmount, userData.productType || "credito-personal");
  let maxTerm = term + 24;
  
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = (userData.requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                        (Math.pow(1 + monthlyRate, term) - 1);
  
  const totalCost = monthlyPayment * term;
  
  // Evaluar estado de aprobación
  const approvalScore = calculateApprovalScore(userData, creditHistory, incomeRatio, minIncome);
  const status = getApprovalStatus(approvalScore);
  const riskLevel = getRiskLevel(interestRate, approvalScore);
  
  return {
    id: `${bank.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}-${index}`,
    bankName: bank.name,
    interestRate: Math.round(interestRate * 100) / 100,
    rate: Math.round(interestRate * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment),
    term,
    maxTerm,
    maxAmount,
    totalCost: Math.round(totalCost),
    savings: Math.round(Math.random() * 5000), // Simplificado
    status,
    approvalTime: getApprovalTime(status, userData.urgencyLevel),
    riskLevel,
    recommended: false,
    requirements: generateRequirements(userData.employmentType || "dependiente", status),
    score: approvalScore,
    productType: userData.productType || "credito-personal",
    features: generateFeatures(bank.name, userData.productType || "credito-personal"),
    description: generateDescription(bank.name, userData.productType || "credito-personal")
  };
};

const calculateTerm = (amount: number, productType: string): number => {
  if (productType === "credito-vehicular") return 60;
  if (productType === "credito-hipotecario") return 240;
  if (amount > 50000) return 36;
  if (amount > 20000) return 30;
  return 24;
};

const calculateApprovalScore = (userData: UserData, creditHistory: string, incomeRatio: number, minIncome: number): number => {
  let score = 0;
  
  // Historial crediticio
  score += creditHistory === "excelente" ? 40 : 
           creditHistory === "bueno" ? 30 : 
           creditHistory === "regular" ? 15 : 10;
  
  // Relación ingreso-deuda
  score += incomeRatio < 4 ? 30 : incomeRatio < 7 ? 20 : 10;
  
  // Ingresos vs mínimo requerido
  score += userData.monthlyIncome > minIncome ? 20 : 5;
  
  // Deudas existentes
  score += userData.hasOtherDebts === "no" ? 10 : 0;
  
  return Math.min(score, 100);
};

const getApprovalStatus = (score: number): BankOffer["status"] => {
  if (score >= 60) return "aprobado";
  if (score >= 40) return "pre-aprobado";
  return "pendiente";
};

const getRiskLevel = (interestRate: number, score: number): BankOffer["riskLevel"] => {
  if (interestRate < 22 && score >= 50) return "Bajo";
  if (interestRate > 30 || score < 35) return "Alto";
  return "Medio";
};

const getApprovalTime = (status: BankOffer["status"], urgency?: string): string => {
  if (status === "aprobado") {
    return urgency === "inmediato" ? "24 horas" : "48 horas";
  }
  return status === "pre-aprobado" ? "3-5 días" : "5-10 días";
};

const generateRequirements = (employmentType: string, status: BankOffer["status"]): string[] => {
  const baseRequirements = ["DNI vigente", "Sustento de ingresos últimos 3 meses"];
  
  if (status === "pendiente") {
    baseRequirements.push("Evaluación crediticia adicional");
  }
  
  if (employmentType === "dependiente") {
    baseRequirements.push("Últimas 3 boletas de pago", "Certificado de trabajo");
  } else if (employmentType === "independiente") {
    baseRequirements.push("Declaración jurada de ingresos", "Comprobantes de ingresos");
  }
  
  return baseRequirements;
};

const generateLimitedOffers = (userData: UserData): BankOffer[] => {
  // Generar solo 2-3 ofertas básicas si faltan datos
  return banks.slice(0, 3).map((bank, index) => ({
    id: `limited-${index}`,
    bankName: bank.name,
    interestRate: bank.baseRate + 5,
    rate: bank.baseRate + 5,
    monthlyPayment: Math.round((userData.requestedAmount || 10000) * 0.05),
    term: 24,
    maxTerm: 60,
    maxAmount: 50000,
    totalCost: Math.round((userData.requestedAmount || 10000) * 1.3),
    savings: 0,
    status: "pendiente" as const,
    approvalTime: "5-10 días",
    riskLevel: "Medio" as const,
    recommended: index === 0,
    requirements: ["Completar información personal", "Verificación de ingresos"],
    score: 30 + index * 10,
    productType: userData.productType || "credito-personal",
    features: ["Evaluación personalizada", "Asesoría especializada"],
    description: `Oferta preliminar de ${bank.name}. Completa tu información para mejores condiciones.`
  }));
};

const generateAlternativeOffers = (userData: UserData): BankOffer[] => {
  // Generar ofertas alternativas con montos menores o condiciones especiales
  const alternativeBanks = banks.filter(bank => 
    bank.minIncome.dependiente <= (userData.monthlyIncome || 1000)
  ).slice(0, 5);
  
  return alternativeBanks.map((bank, index) => {
    const adjustedAmount = Math.min(userData.requestedAmount, bank.maxAmount.dependiente * 0.7);
    return {
      id: `alternative-${index}`,
      bankName: bank.name,
      interestRate: bank.baseRate + 3,
      rate: bank.baseRate + 3,
      monthlyPayment: Math.round(adjustedAmount * 0.06),
      term: 18,
      maxTerm: 36,
      maxAmount: Math.round(adjustedAmount),
      totalCost: Math.round(adjustedAmount * 1.25),
      savings: 0,
      status: "pre-aprobado" as const,
      approvalTime: "3-5 días",
      riskLevel: "Medio" as const,
      recommended: index === 0,
      requirements: ["Verificación de ingresos", "Evaluación crediticia"],
      score: 45 + index * 5,
      productType: userData.productType || "credito-personal",
      features: ["Monto ajustado a tu perfil", "Condiciones flexibles"],
      description: `${bank.name} ofrece condiciones especiales adaptadas a tu perfil financiero.`
    };
  });
};

// Función auxiliar para generar características por banco
const generateFeatures = (bankName: string, productType: string): string[] => {
  const baseFeatures = {
    "credito-personal": ["Sin garantía", "Tasa fija", "Desembolso rápido"],
    "credito-vehicular": ["Financiamiento hasta 90%", "Seguro incluido", "Tramitación ágil"],
    "credito-hipotecario": ["Financiamiento hasta 90%", "Tasa competitiva", "Plazos extensos"],
    "tarjeta-credito": ["Sin cuota de manejo", "Cashback", "Compras internacionales"],
    "credito-empresarial": ["Capital de trabajo", "Tasa preferencial", "Asesoría especializada"]
  };

  const bankSpecific = {
    "Banco de Crédito BCP": ["Red nacional más amplia", "Banca digital 24/7"],
    "BBVA Continental": ["Tecnología europea", "Procesos 100% digitales"],
    "Scotiabank Perú": ["Atención personalizada", "Beneficios exclusivos"],
    "Interbank": ["Innovación constante", "Respuesta inmediata"],
    "Banco Pichincha": ["Tarifas competitivas", "Flexibilidad en pagos"]
  };

  const features = [...(baseFeatures[productType as keyof typeof baseFeatures] || baseFeatures["credito-personal"])];
  const specific = bankSpecific[bankName as keyof typeof bankSpecific];
  if (specific) features.push(...specific);
  
  return features.slice(0, 5);
};

// Función auxiliar para generar descripción por banco
const generateDescription = (bankName: string, productType: string): string => {
  const productNames = {
    "credito-personal": "Crédito Personal",
    "credito-vehicular": "Crédito Vehicular",
    "credito-hipotecario": "Crédito Hipotecario",
    "tarjeta-credito": "Tarjeta de Crédito",
    "credito-empresarial": "Crédito Empresarial"
  };

  const productName = productNames[productType as keyof typeof productNames] || "Producto Financiero";
  
  return `${productName} de ${bankName} diseñado para satisfacer tus necesidades financieras con las mejores condiciones del mercado.`;
};
