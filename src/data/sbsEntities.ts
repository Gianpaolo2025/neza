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
  // Bancos
  {
    id: 'alfin-banco',
    name: 'Alfin Banco',
    type: 'banco',
    sbsCode: '056',
    products: []
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
    id: 'banco-bci',
    name: 'Banco BCI',
    type: 'banco',
    sbsCode: '055',
    products: []
  },
  {
    id: 'bancom',
    name: 'Bancom',
    type: 'banco',
    sbsCode: '038',
    products: []
  },
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
    id: 'banco-nacion',
    name: 'Banco de la Nación',
    type: 'banco',
    sbsCode: '018',
    products: []
  },
  {
    id: 'banco-falabella',
    name: 'Banco Falabella',
    type: 'banco',
    sbsCode: '041',
    products: []
  },
  {
    id: 'banco-gnb',
    name: 'Banco GNB',
    type: 'banco',
    sbsCode: '053',
    products: []
  },
  {
    id: 'banbif',
    name: 'Banbif',
    type: 'banco',
    sbsCode: '038',
    products: []
  },
  {
    id: 'interbank',
    name: 'Interbank',
    type: 'banco',
    sbsCode: '003',
    products: []
  },
  {
    id: 'banco-pichincha',
    name: 'Banco Pichincha',
    type: 'banco',
    sbsCode: '049',
    products: []
  },
  {
    id: 'banco-ripley',
    name: 'Banco Ripley',
    type: 'banco',
    sbsCode: '043',
    products: []
  },
  {
    id: 'santander-peru',
    name: 'Santander Perú',
    type: 'banco',
    sbsCode: '007',
    products: []
  },
  {
    id: 'bank-of-china-peru',
    name: 'Bank of China (Perú)',
    type: 'banco',
    sbsCode: '052',
    products: []
  },
  {
    id: 'citibank-peru',
    name: 'Citibank del Perú',
    type: 'banco',
    sbsCode: '017',
    products: []
  },
  {
    id: 'compartamos-banco',
    name: 'Compartamos Banco',
    type: 'banco',
    sbsCode: '047',
    products: []
  },
  {
    id: 'icbc-peru',
    name: 'ICBC Perú Bank S.A.',
    type: 'banco',
    sbsCode: '051',
    products: []
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
    id: 'bn-santander-cons',
    name: 'BN Santander Consumer',
    type: 'banco',
    sbsCode: '054',
    products: []
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

  // Financieras
  {
    id: 'financiera-confianza',
    name: 'Financiera Confianza',
    type: 'financiera',
    sbsCode: '128',
    products: []
  },
  {
    id: 'financiera-efectiva',
    name: 'Financiera Efectiva',
    type: 'financiera',
    sbsCode: '125',
    products: []
  },
  {
    id: 'financiera-oh',
    name: 'Financiera OH',
    type: 'financiera',
    sbsCode: '129',
    products: []
  },
  {
    id: 'financiera-proempresa',
    name: 'Financiera Proempresa',
    type: 'financiera',
    sbsCode: '127',
    products: []
  },
  {
    id: 'financiera-qapaq',
    name: 'Financiera Qapaq',
    type: 'financiera',
    sbsCode: '130',
    products: []
  },
  {
    id: 'financiera-surgir',
    name: 'Financiera Surgir',
    type: 'financiera',
    sbsCode: '131',
    products: []
  },

  // Cajas Municipales
  {
    id: 'cmac-cusco',
    name: 'CMAC Cusco',
    type: 'caja',
    sbsCode: '801',
    products: []
  },
  {
    id: 'cmac-arequipa',
    name: 'CMAC Arequipa',
    type: 'caja',
    sbsCode: '802',
    products: []
  },
  {
    id: 'cmac-del-santa',
    name: 'CMAC del Santa',
    type: 'caja',
    sbsCode: '803',
    products: []
  },
  {
    id: 'cmac-huancayo',
    name: 'CMAC Huancayo',
    type: 'caja',
    sbsCode: '804',
    products: []
  },
  {
    id: 'cmac-ica',
    name: 'CMAC Ica',
    type: 'caja',
    sbsCode: '805',
    products: []
  },
  {
    id: 'cmac-maynas',
    name: 'CMAC Maynas',
    type: 'caja',
    sbsCode: '806',
    products: []
  },
  {
    id: 'cmac-paita',
    name: 'CMAC Paita',
    type: 'caja',
    sbsCode: '807',
    products: []
  },
  {
    id: 'caja-piura',
    name: 'CMAC Piura',
    type: 'caja',
    sbsCode: '808',
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
  },
  {
    id: 'cmac-tacna',
    name: 'CMAC Tacna',
    type: 'caja',
    sbsCode: '809',
    products: []
  },
  {
    id: 'cmac-trujillo',
    name: 'CMAC Trujillo',
    type: 'caja',
    sbsCode: '810',
    products: []
  },
  {
    id: 'cmcp-lima',
    name: 'CMCP Lima',
    type: 'caja',
    sbsCode: '811',
    products: []
  },

  // Cajas Rurales
  {
    id: 'crac-cencosud-scotia',
    name: 'CRAC Cencosud Scotia',
    type: 'caja',
    sbsCode: '901',
    products: []
  },
  {
    id: 'crac-los-andes',
    name: 'CRAC Los Andes',
    type: 'caja',
    sbsCode: '902',
    products: []
  },
  {
    id: 'crac-del-centro',
    name: 'CRAC del Centro',
    type: 'caja',
    sbsCode: '903',
    products: []
  },
  {
    id: 'crac-prymera',
    name: 'CRAC Prymera',
    type: 'caja',
    sbsCode: '904',
    products: []
  },
  {
    id: 'crac-incasur',
    name: 'CRAC Incasur',
    type: 'caja',
    sbsCode: '905',
    products: []
  }
];
