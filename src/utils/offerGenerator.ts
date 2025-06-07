import { faker } from '@faker-js/faker';

export interface UserData {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  monthlyIncome: number;
  requestedAmount: number;
  employmentType: string;
  creditHistory: string;
  productType: string;
  hasOtherDebts: string;
  bankingRelationship: string;
  urgencyLevel: string;
  preferredBank: string;
  preferredCurrency?: string;
}

export interface Offer {
  bankName: string;
  productName: string;
  interestRate: number;
  monthlyPayment: number;
  loanAmount: number;
  termInMonths: number;
  requirements: string[];
  score: number;
  features: string[];
}

export interface BankOffer {
  id: string;
  bankName: string;
  productType: string;
  interestRate: number;
  rate: number;
  monthlyPayment: number;
  maxAmount: number;
  maxTerm: number;
  term: number;
  totalCost: number;
  savings: number;
  approvalTime: string;
  riskLevel: string;
  status: string;
  recommended: boolean;
  requirements: string[];
  features: string[];
  description: string;
  score: number;
  bankUrl: string;
  category: string;
  icon: string;
  auctionStatus: 'preapproved' | 'approved';
  currency: string;
}

const bankNames = ["BCP", "BBVA", "Scotiabank", "Interbank", "Banco Pichincha", "Banco de Crédito", "Banco Continental", "Mibanco", "Banco Falabella", "Banco Ripley", "Caja Municipal Arequipa", "Caja Municipal Cusco", "Caja Municipal Trujillo", "Crediscotia", "Compartamos Financiera"];

const productCategories = {
  "credito-personal": {
    name: "Créditos de Consumo",
    icon: "💰",
    products: ["Crédito Personal", "Crédito de Libre Disponibilidad", "Préstamo Personal"]
  },
  "credito-vehicular": {
    name: "Créditos Vehiculares", 
    icon: "🚗",
    products: ["Crédito Vehicular", "Financiamiento Automotriz"]
  },
  "credito-hipotecario": {
    name: "Créditos Hipotecarios",
    icon: "🏠", 
    products: ["Crédito Hipotecario", "Mi Vivienda"]
  },
  "tarjeta-credito": {
    name: "Tarjetas de Crédito",
    icon: "💳",
    products: ["Tarjeta de Crédito Clásica", "Tarjeta de Crédito Gold", "Tarjeta de Crédito Platinum"]
  },
  "cuenta-ahorros": {
    name: "Cuentas de Ahorro",
    icon: "🏦",
    products: ["Cuenta de Ahorros", "Cuenta Sueldo"]
  }
};

// Requisitos específicos por banco
const bankRequirements: Record<string, Record<string, string[]>> = {
  "BCP": {
    "credito-personal": ["DNI vigente", "Boletas de pago últimos 3 meses", "Constancia de trabajo", "Ingresos mínimos S/ 1,500"],
    "tarjeta-credito": ["DNI vigente", "Ingresos demostrables S/ 1,000", "No estar en centrales de riesgo"],
    "credito-vehicular": ["DNI vigente", "Licencia de conducir", "Ingresos mínimos S/ 2,500", "Inicial mínima 30%"],
    "credito-hipotecario": ["DNI vigente", "Ingresos familiares S/ 3,500", "Inicial mínima 10%", "Certificado registral"],
    "cuenta-ahorros": ["DNI vigente", "Depósito inicial S/ 50"]
  },
  "BBVA": {
    "credito-personal": ["DNI vigente", "Boletas de pago últimos 2 meses", "Récord crediticio positivo", "Ingresos mínimos S/ 1,200"],
    "tarjeta-credito": ["DNI vigente", "Ingresos demostrables S/ 800", "Sin deudas en mora"],
    "credito-vehicular": ["DNI vigente", "Licencia de conducir", "Ingresos mínimos S/ 2,000", "Inicial mínima 25%"],
    "credito-hipotecario": ["DNI vigente", "Ingresos familiares S/ 3,000", "Inicial mínima 15%", "Tasación del inmueble"],
    "cuenta-ahorros": ["DNI vigente", "Depósito inicial S/ 25"]
  },
  "Scotiabank": {
    "credito-personal": ["DNI vigente", "Boletas de pago últimos 3 meses", "Constancia laboral", "Ingresos mínimos S/ 1,800"],
    "tarjeta-credito": ["DNI vigente", "Ingresos demostrables S/ 1,200", "Historial crediticio"],
    "credito-vehicular": ["DNI vigente", "Licencia de conducir", "Ingresos mínimos S/ 3,000", "Inicial mínima 35%"],
    "credito-hipotecario": ["DNI vigente", "Ingresos familiares S/ 4,000", "Inicial mínima 20%", "Seguro de desgravamen"],
    "cuenta-ahorros": ["DNI vigente", "Depósito inicial S/ 100"]
  }
};

const bankUrls: Record<string, string> = {
  "BCP": "https://www.viabcp.com",
  "BBVA": "https://www.bbva.pe",
  "Scotiabank": "https://www.scotiabank.com.pe",
  "Interbank": "https://www.interbank.pe",
  "Banco Pichincha": "https://www.pichincha.pe"
};

// Función auxiliar para generar características por banco
const generateFeatures = (bankName: string, productType: string): string[] => {
  const baseFeatures: Record<string, string[]> = {
    "credito-personal": ["Sin garantía", "Tasa fija", "Desembolso rápido"],
    "credito-vehicular": ["Financiamiento hasta 90%", "Seguro incluido", "Tramitación ágil"],
    "credito-hipotecario": ["Financiamiento hasta 90%", "Tasa competitiva", "Plazos extensos"],
    "tarjeta-credito": ["Sin cuota de manejo", "Cashback", "Compras internacionales"],
    "cuenta-ahorros": ["Sin comisiones", "Rendimiento atractivo", "Acceso 24/7"]
  };

  const bankSpecific: Record<string, string[]> = {
    "BCP": ["Banca móvil avanzada", "Red de cajeros amplia"],
    "BBVA": ["Banca digital líder", "Tasas preferenciales"],
    "Scotiabank": ["Atención personalizada", "Beneficios exclusivos"],
    "Interbank": ["Innovación financiera", "Productos flexibles"],
    "Banco Pichincha": ["Tarifas competitivas", "Flexibilidad en pagos"]
  };

  const features = [...(baseFeatures[productType] || baseFeatures["credito-personal"])];
  const specific = bankSpecific[bankName];
  if (specific) features.push(...specific);
  
  return features.slice(0, 3);
};

const calculateScore = (user: UserData, product: any): number => {
  let score = 0;
  
  // Factor de ingreso
  const incomeRatio = user.monthlyIncome / (product.minIncome || 1500);
  score += Math.min(incomeRatio * 20, 40);
  
  // Factor de monto solicitado
  const amountRatio = user.requestedAmount / product.maxAmount;
  if (amountRatio <= 0.8) score += 30;
  else if (amountRatio <= 1) score += 15;
  
  // Factor de historial crediticio
  const creditScores: Record<string, number> = {
    "excelente": 30,
    "bueno": 20,
    "regular": 10,
    "nuevo": 5
  };
  score += creditScores[user.creditHistory] || 0;
  
  return Math.min(score, 100);
};

export const generateBankOffers = (user: UserData): BankOffer[] => {
  const offers: BankOffer[] = [];
  const selectedCurrency = user.preferredCurrency || "PEN";
  const currencySymbol = selectedCurrency === "PEN" ? "S/." : "$";

  // Generar ofertas de TODAS las entidades disponibles
  for (let i = 0; i < bankNames.length; i++) {
    for (let j = 0; j < 3; j++) { // 3 ofertas por banco
      const bankName = bankNames[i];
      const productType = user.productType;
      const category = productCategories[productType as keyof typeof productCategories];
      const interestRate = faker.number.float({ min: 5, max: 25, fractionDigits: 1 });
      const loanAmount = user.requestedAmount;
      const termInMonths = faker.number.int({ min: 12, max: 60 });
      const monthlyPayment = (loanAmount * (interestRate / 100)) / (1 - Math.pow(1 + (interestRate / 100), -termInMonths));

      const product = {
        minIncome: faker.number.int({ min: 1000, max: user.monthlyIncome }),
        maxAmount: faker.number.int({ min: user.requestedAmount, max: 100000 })
      };

      const score = calculateScore(user, product);
      const auctionStatus = faker.helpers.arrayElement(['preapproved', 'approved'] as const);

      const bankRequirement = bankRequirements[bankName]?.[productType] || [
        "DNI vigente",
        "Constancia de ingresos",
        "Historial crediticio"
      ];

      offers.push({
        id: `offer-${i}-${j}`,
        bankName,
        productType,
        category: category?.name || "Producto Financiero",
        icon: category?.icon || "💰",
        interestRate,
        rate: interestRate,
        monthlyPayment,
        maxAmount: loanAmount,
        maxTerm: termInMonths,
        term: termInMonths,
        totalCost: monthlyPayment * termInMonths,
        savings: faker.number.int({ min: 500, max: 5000 }),
        approvalTime: faker.helpers.arrayElement(["24 horas", "48 horas", "72 horas"]),
        riskLevel: faker.helpers.arrayElement(["Bajo", "Medio", "Alto"]),
        status: faker.helpers.arrayElement(["aprobado", "pre-aprobado", "pendiente"]),
        recommended: i === 0 && j === 0,
        requirements: bankRequirement,
        features: generateFeatures(bankName, productType),
        description: `${category?.name || "Producto financiero"} con condiciones preferenciales`,
        score,
        bankUrl: bankUrls[bankName] || "#",
        auctionStatus,
        currency: currencySymbol
      });
    }
  }

  return offers.sort((a, b) => b.score - a.score);
};

export const generateOffers = (user: UserData) => {
  const bankOffers = generateBankOffers(user);
  
  // Convert BankOffer to the Offer format expected by OffersDashboard
  return bankOffers.map((bankOffer, index) => ({
    id: bankOffer.id || `offer-${index}`,
    bankName: bankOffer.bankName,
    bankLogo: bankOffer.icon || "💰",
    productName: bankOffer.category || "Producto Financiero",
    productType: bankOffer.productType,
    amount: bankOffer.maxAmount,
    interestRate: bankOffer.interestRate,
    monthlyPayment: bankOffer.monthlyPayment,
    term: bankOffer.term,
    status: bankOffer.auctionStatus === 'approved' ? 'approved' : 
            bankOffer.auctionStatus === 'preapproved' ? 'pre-approved' : 'auction',
    score: bankOffer.score,
    features: bankOffer.features,
    requirements: bankOffer.requirements,
    bankUrl: bankOffer.bankUrl,
    originalRate: undefined,
    timeLeft: undefined
  }));
};
