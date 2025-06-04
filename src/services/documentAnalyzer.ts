
export interface DocumentAnalysis {
  documentType: string;
  isValid: boolean;
  extractedData: any;
  confidence: number;
  issues: string[];
  expiryDate?: Date;
}

export interface UserProfile {
  personalInfo: {
    name: string;
    dni: string;
    age: number;
    email: string;
    phone: string;
  };
  employment: {
    type: 'dependiente' | 'independiente' | 'empresario';
    monthlyIncome: number;
    workTime: number; // meses
    company?: string;
    position?: string;
  };
  credit: {
    score: number;
    debtToIncome: number;
    hasNegativeHistory: boolean;
    infoCorpStatus: 'normal' | 'problema' | 'deficiente';
  };
  documents: {
    [key: string]: DocumentAnalysis;
  };
  qualityScore: number;
}

export class DocumentAnalyzer {
  static analyzeDocument(file: File, documentType: string): Promise<DocumentAnalysis> {
    return new Promise((resolve) => {
      // Simular análisis OCR y extracción de datos
      setTimeout(() => {
        const analysis = this.simulateDocumentAnalysis(file, documentType);
        resolve(analysis);
      }, 2000);
    });
  }

  private static simulateDocumentAnalysis(file: File, documentType: string): DocumentAnalysis {
    const baseConfidence = 0.7 + Math.random() * 0.3;
    const isValid = baseConfidence > 0.8;
    
    let extractedData = {};
    let issues: string[] = [];

    switch (documentType) {
      case 'dni':
        extractedData = {
          numero: '12345678',
          nombres: 'Juan Carlos',
          apellidos: 'García López',
          fechaNacimiento: '1985-05-15',
          fechaVencimiento: '2028-05-15'
        };
        if (!isValid) {
          issues = ['Imagen poco clara', 'Documento vencido'];
        }
        break;

      case 'boleta-pago':
        extractedData = {
          empleador: 'Empresa SAC',
          periodo: '2024-05',
          ingresoNeto: 3500,
          ingresoTotal: 4200,
          descuentos: 700,
          tiempoTrabajo: 24
        };
        if (!isValid) {
          issues = ['Datos ilegibles', 'Formato no estándar'];
        }
        break;

      case 'certificado-trabajo':
        extractedData = {
          empresa: 'Empresa SAC',
          cargo: 'Analista',
          fechaIngreso: '2022-01-15',
          salario: 3500,
          tipoContrato: 'indefinido'
        };
        if (!isValid) {
          issues = ['Firma poco clara', 'Información incompleta'];
        }
        break;

      case 'reporte-crediticio':
        extractedData = {
          score: 420,
          calificacion: 'normal',
          deudaTotal: 15000,
          entidadesReportantes: 3,
          fechaConsulta: '2024-06-01'
        };
        if (!isValid) {
          issues = ['Reporte desactualizado', 'Datos inconsistentes'];
        }
        break;
    }

    return {
      documentType,
      isValid,
      extractedData,
      confidence: baseConfidence,
      issues,
      expiryDate: documentType === 'dni' ? new Date('2028-05-15') : undefined
    };
  }

  static calculateQualityScore(documents: { [key: string]: DocumentAnalysis }): number {
    const documentTypes = ['dni', 'boleta-pago', 'certificado-trabajo', 'reporte-crediticio'];
    let totalScore = 0;
    let documentCount = 0;

    documentTypes.forEach(type => {
      if (documents[type]) {
        const doc = documents[type];
        let docScore = doc.confidence * 100;
        
        if (!doc.isValid) docScore *= 0.5;
        if (doc.issues.length > 0) docScore *= 0.8;
        if (doc.expiryDate && doc.expiryDate < new Date()) docScore *= 0.3;
        
        totalScore += docScore;
        documentCount++;
      }
    });

    return documentCount > 0 ? Math.round(totalScore / documentCount) : 0;
  }

  static extractUserProfile(documents: { [key: string]: DocumentAnalysis }): Partial<UserProfile> {
    const profile: Partial<UserProfile> = {
      documents,
      qualityScore: this.calculateQualityScore(documents)
    };

    // Extraer información personal del DNI
    if (documents.dni?.isValid) {
      const dniData = documents.dni.extractedData;
      profile.personalInfo = {
        name: `${dniData.nombres} ${dniData.apellidos}`,
        dni: dniData.numero,
        age: new Date().getFullYear() - new Date(dniData.fechaNacimiento).getFullYear(),
        email: '',
        phone: ''
      };
    }

    // Extraer información laboral de boletas y certificado
    if (documents['boleta-pago']?.isValid) {
      const boletaData = documents['boleta-pago'].extractedData;
      profile.employment = {
        type: 'dependiente',
        monthlyIncome: boletaData.ingresoNeto,
        workTime: boletaData.tiempoTrabajo,
        company: boletaData.empleador
      };
    }

    // Extraer información crediticia
    if (documents['reporte-crediticio']?.isValid) {
      const creditData = documents['reporte-crediticio'].extractedData;
      profile.credit = {
        score: creditData.score,
        debtToIncome: (creditData.deudaTotal / (profile.employment?.monthlyIncome || 1)) * 100,
        hasNegativeHistory: creditData.calificacion !== 'normal',
        infoCorpStatus: creditData.calificacion
      };
    }

    return profile;
  }
}
