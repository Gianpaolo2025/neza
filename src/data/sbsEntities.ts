
export interface FinancialEntity {
  id: string;
  name: string;
  type: 'banco' | 'caja' | 'financiera' | 'cooperativa';
  sbsCode: string;
  products: FinancialProduct[];
}

export interface FinancialProduct {
  id: string;
  name: string;
  type: 'credito-personal' | 'credito-vehicular' | 'credito-hipotecario' | 'tarjeta-credito' | 'credito-empresarial';
  requirements: ProductRequirements;
  conditions: ProductConditions;
  interestRateRange: {
    min: number;
    max: number;
  };
}

export interface ProductRequirements {
  minIncome: number;
  maxAge: number;
  minAge: number;
  minWorkTime: number; // meses
  maxDebtToIncome: number; // porcentaje
  minCreditScore: number;
  documentos: string[];
  additionalRequirements: string[];
  restrictions: string[];
}

export interface ProductConditions {
  minAmount: number;
  maxAmount: number;
  minTerm: number; // meses
  maxTerm: number; // meses
  initialPayment?: number; // porcentaje
  processing: {
    timeToApproval: string;
    requirements: string[];
  };
}

export const sbsEntities: FinancialEntity[] = [
  {
    id: 'bcp',
    name: 'Banco de Crédito del Perú',
    type: 'banco',
    sbsCode: '002',
    products: [
      {
        id: 'bcp-credito-personal',
        name: 'Crédito Personal BCP',
        type: 'credito-personal',
        requirements: {
          minIncome: 1500,
          maxAge: 70,
          minAge: 18,
          minWorkTime: 6,
          maxDebtToIncome: 60,
          minCreditScore: 350,
          documentos: ['DNI', 'Boletas de pago (3 últimas)', 'Certificado de trabajo'],
          additionalRequirements: ['No estar en INFOCORP con calificación deficiente'],
          restrictions: ['Solo residentes en Perú']
        },
        conditions: {
          minAmount: 1000,
          maxAmount: 150000,
          minTerm: 6,
          maxTerm: 60,
          processing: {
            timeToApproval: '24-48 horas',
            requirements: ['Evaluación crediticia', 'Verificación laboral']
          }
        },
        interestRateRange: { min: 16.5, max: 24.0 }
      },
      {
        id: 'bcp-credito-hipotecario',
        name: 'Crédito Hipotecario BCP',
        type: 'credito-hipotecario',
        requirements: {
          minIncome: 2500,
          maxAge: 65,
          minAge: 21,
          minWorkTime: 12,
          maxDebtToIncome: 40,
          minCreditScore: 400,
          documentos: ['DNI', 'Boletas de pago (6 últimas)', 'Certificado de trabajo', 'Estados financieros'],
          additionalRequirements: ['Avalúo del inmueble', 'Seguro de desgravamen'],
          restrictions: ['Inmueble ubicado en zonas urbanas']
        },
        conditions: {
          minAmount: 50000,
          maxAmount: 1000000,
          minTerm: 60,
          maxTerm: 300,
          initialPayment: 10,
          processing: {
            timeToApproval: '7-15 días',
            requirements: ['Avalúo inmobiliario', 'Verificación de dominio']
          }
        },
        interestRateRange: { min: 8.5, max: 12.0 }
      }
    ]
  },
  {
    id: 'bbva',
    name: 'BBVA Continental',
    type: 'banco',
    sbsCode: '011',
    products: [
      {
        id: 'bbva-credito-personal',
        name: 'Préstamo Personal BBVA',
        type: 'credito-personal',
        requirements: {
          minIncome: 1800,
          maxAge: 68,
          minAge: 18,
          minWorkTime: 8,
          maxDebtToIncome: 55,
          minCreditScore: 370,
          documentos: ['DNI', 'Boletas de pago (3 últimas)', 'Certificado de trabajo'],
          additionalRequirements: ['Cuenta en BBVA de al menos 3 meses'],
          restrictions: ['Evaluación interna del banco']
        },
        conditions: {
          minAmount: 2000,
          maxAmount: 120000,
          minTerm: 12,
          maxTerm: 48,
          processing: {
            timeToApproval: '2-5 días',
            requirements: ['Evaluación crediticia BBVA', 'Validación de ingresos']
          }
        },
        interestRateRange: { min: 17.0, max: 25.5 }
      }
    ]
  },
  {
    id: 'scotiabank',
    name: 'Scotiabank Perú',
    type: 'banco',
    sbsCode: '009',
    products: [
      {
        id: 'scotia-credito-vehicular',
        name: 'Crédito Vehicular Scotia',
        type: 'credito-vehicular',
        requirements: {
          minIncome: 2000,
          maxAge: 70,
          minAge: 18,
          minWorkTime: 6,
          maxDebtToIncome: 50,
          minCreditScore: 380,
          documentos: ['DNI', 'Boletas de pago (3 últimas)', 'Certificado de trabajo', 'Proforma del vehículo'],
          additionalRequirements: ['Seguro vehicular todo riesgo', 'GPS obligatorio'],
          restrictions: ['Vehículos de hasta 5 años de antigüedad']
        },
        conditions: {
          minAmount: 15000,
          maxAmount: 200000,
          minTerm: 12,
          maxTerm: 84,
          initialPayment: 20,
          processing: {
            timeToApproval: '3-7 días',
            requirements: ['Verificación del vehículo', 'Evaluación crediticia']
          }
        },
        interestRateRange: { min: 12.0, max: 18.5 }
      }
    ]
  },
  {
    id: 'mibanco',
    name: 'Mi Banco',
    type: 'banco',
    sbsCode: '049',
    products: [
      {
        id: 'mibanco-credito-personal',
        name: 'Crédito Personal Mi Banco',
        type: 'credito-personal',
        requirements: {
          minIncome: 800,
          maxAge: 70,
          minAge: 18,
          minWorkTime: 3,
          maxDebtToIncome: 70,
          minCreditScore: 300,
          documentos: ['DNI', 'Boletas de pago (2 últimas)', 'Certificado de trabajo'],
          additionalRequirements: ['Evaluación in situ del negocio'],
          restrictions: ['Dirigido a micro y pequeña empresa']
        },
        conditions: {
          minAmount: 500,
          maxAmount: 50000,
          minTerm: 6,
          maxTerm: 36,
          processing: {
            timeToApproval: '1-3 días',
            requirements: ['Visita de evaluación', 'Referencias comerciales']
          }
        },
        interestRateRange: { min: 20.0, max: 35.0 }
      }
    ]
  },
  {
    id: 'caja-piura',
    name: 'Caja Municipal de Piura',
    type: 'caja',
    sbsCode: '801',
    products: [
      {
        id: 'piura-credito-empresarial',
        name: 'Crédito MYPE Caja Piura',
        type: 'credito-empresarial',
        requirements: {
          minIncome: 1200,
          maxAge: 70,
          minAge: 21,
          minWorkTime: 12,
          maxDebtToIncome: 65,
          minCreditScore: 320,
          documentos: ['DNI', 'RUC', 'Estados financieros', 'Declaraciones SUNAT'],
          additionalRequirements: ['Negocio en funcionamiento mínimo 1 año'],
          restrictions: ['Solo para micro y pequeñas empresas']
        },
        conditions: {
          minAmount: 1000,
          maxAmount: 80000,
          minTerm: 6,
          maxTerm: 48,
          processing: {
            timeToApproval: '2-5 días',
            requirements: ['Evaluación del negocio', 'Referencias comerciales']
          }
        },
        interestRateRange: { min: 18.0, max: 30.0 }
      }
    ]
  }
];
