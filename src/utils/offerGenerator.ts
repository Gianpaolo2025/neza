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
  }
];

export const generateOffers = (userData: UserData): BankOffer[] => {
  const offers: BankOffer[] = [];
  
  console.log("Generando ofertas para usuario con datos completos:", userData);
  
  // Validar que tengamos datos mínimos para generar ofertas
  if (!userData.requestedAmount || userData.requestedAmount <= 0 || 
      !userData.monthlyIncome || userData.monthlyIncome <= 0 ||
      !userData.productType) {
    console.log("Datos insuficientes para generar ofertas personalizadas");
    return [];
  }
  
  const incomeRatio = userData.requestedAmount / userData.monthlyIncome;
  const employmentType = (userData.employmentType || "dependiente") as keyof typeof banks[0]['maxAmount'];
  
  // Filtrar bancos que ofrezcan el producto solicitado
  const eligibleBanks = banks.filter(bank => 
    bank.productTypes.includes(userData.productType || "credito-personal")
  );
  
  console.log(`Bancos elegibles para ${userData.productType}: ${eligibleBanks.length}`);
  
  eligibleBanks.forEach((bank, index) => {
    const maxAmount = bank.maxAmount[employmentType];
    const minIncome = bank.minIncome[employmentType];
    
    // Criterios más estrictos para generar solo ofertas relevantes
    let canOffer = true;
    let status: BankOffer["status"] = "aprobado";
    
    // Verificar si cumple requisitos básicos
    if (userData.requestedAmount > maxAmount) {
      canOffer = false; // No ofrecer si excede el límite del banco
    }
    
    if (userData.monthlyIncome < minIncome) {
      if (userData.monthlyIncome < minIncome * 0.8) {
        canOffer = false; // No ofrecer si está muy por debajo del mínimo
      } else {
        status = "pendiente"; // Requiere evaluación adicional
      }
    }
    
    // Solo proceder si el banco puede ofrecer el producto
    if (!canOffer) {
      return;
    }

    const creditHistory = (userData.creditHistory || "nuevo") as keyof typeof bank.riskAdjustment;
    let interestRate = bank.baseRate + bank.riskAdjustment[creditHistory];
    
    // Ajustes por perfil del usuario
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
    
    // Variación competitiva pequeña
    const competitiveVariation = (Math.random() - 0.5) * 1;
    interestRate += competitiveVariation;
    
    // Límites del mercado peruano
    interestRate = Math.max(15, Math.min(40, interestRate));
    
    // Calcular plazo basado en monto y tipo de producto
    let term = 24;
    let maxTerm = 60;
    if (userData.productType === "credito-vehicular") {
      term = 60;
      maxTerm = 96;
    } else if (userData.productType === "credito-hipotecario") {
      term = 240;
      maxTerm = 360;
    } else if (userData.requestedAmount > 50000) {
      term = 36;
      maxTerm = 72;
    } else if (userData.requestedAmount > 20000) {
      term = 30;
      maxTerm = 48;
    }
    
    const offerAmount = userData.requestedAmount; // Usar el monto exacto solicitado
    
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (offerAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1);
    
    const totalCost = monthlyPayment * term;
    const averageCost = offerAmount * (1 + (interestRate * term / 12 / 100)); 
    const savings = Math.max(0, averageCost - totalCost);
    
    // Evaluar aprobación
    const approvalScore = (
      (creditHistory === "excelente" ? 40 : 
       creditHistory === "bueno" ? 30 : 
       creditHistory === "regular" ? 15 : 10) +
      (incomeRatio < 4 ? 30 : incomeRatio < 7 ? 20 : 10) +
      (userData.monthlyIncome > minIncome ? 20 : 5) +
      (userData.hasOtherDebts === "no" ? 10 : 0)
    );
    
    if (approvalScore >= 60) {
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
    
    const approvalTime = status === "aprobado" ? 
      (userData.urgencyLevel === "inmediato" ? "24 horas" : "48 horas") :
      status === "pre-aprobado" ? "3-5 días" : "5-10 días";

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

    const features = generateFeatures(bank.name, userData.productType || "credito-personal");
    const description = generateDescription(bank.name, userData.productType || "credito-personal");
    
    // Calcular score basado en múltiples factores
    const score = Math.min(100, Math.round(
      approvalScore + 
      (interestRate < 20 ? 20 : interestRate < 25 ? 15 : 10) +
      (status === "aprobado" ? 20 : status === "pre-aprobado" ? 10 : 5) +
      (Math.random() * 10)
    ));

    offers.push({
      id: `${bank.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}-${index}`,
      bankName: bank.name,
      interestRate: Math.round(interestRate * 100) / 100,
      rate: Math.round(interestRate * 100) / 100,
      monthlyPayment: Math.round(monthlyPayment),
      term,
      maxTerm,
      maxAmount,
      totalCost: Math.round(totalCost),
      savings: Math.round(savings),
      status,
      approvalTime,
      riskLevel,
      recommended: false,
      requirements: baseRequirements,
      score,
      productType: userData.productType || "credito-personal",
      features,
      description
    });
  });
  
  console.log(`Ofertas generadas: ${offers.length} de ${eligibleBanks.length} bancos elegibles`);
  
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
