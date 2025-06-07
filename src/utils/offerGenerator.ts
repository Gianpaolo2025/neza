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

const bankNames = ["BCP", "BBVA", "Scotiabank", "Interbank", "Banco Pichincha"];
const productNames = {
  "credito-personal": ["Crédito Personal"],
  "credito-vehicular": ["Crédito Vehicular"],
  "credito-hipotecario": ["Crédito Hipotecario"],
  "tarjeta-credito": ["Tarjeta de Crédito Clásica", "Tarjeta de Crédito Gold", "Tarjeta de Crédito Platinum"],
  "cuenta-ahorros": ["Cuenta de Ahorros"]
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

// Corregir la función que causaba el error TypeScript
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

export const generateOffers = (user: UserData): Offer[] => {
  const offers: Offer[] = [];

  for (let i = 0; i < 15; i++) {
    const bankName = bankNames[i % bankNames.length];
    const productType = user.productType;
    const productName = productNames[productType][i % productNames[productType].length];
    const interestRate = faker.number.float({ min: 5, max: 25, precision: 0.1 });
    const loanAmount = user.requestedAmount;
    const termInMonths = faker.number.int({ min: 12, max: 60 });
    const monthlyPayment = (loanAmount * (interestRate / 100)) / (1 - Math.pow(1 + (interestRate / 100), -termInMonths));

    const product = {
      minIncome: faker.number.int({ min: 1000, max: user.monthlyIncome }),
      maxAmount: faker.number.int({ min: user.requestedAmount, max: 100000 })
    };

    const score = calculateScore(user, product);

    offers.push({
      bankName,
      productName,
      interestRate,
      monthlyPayment,
      loanAmount,
      termInMonths,
      requirements: [
        "DNI",
        "Justificante de ingresos",
        "Historial crediticio positivo"
      ],
      score,
      features: generateFeatures(bankName, productType)
    });
  }

  return offers.sort((a, b) => b.score - a.score);
};
