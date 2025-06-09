
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
  emailVerified?: boolean;
  workDetails?: {
    workSituation: string;
    companyName: string;
    jobTitle: string;
    seniority: string;
  };
  documents?: {
    [key: string]: {
      file: File;
      analysis: any;
      fileId: string;
    };
  };
  // New fields for expanded work information
  carrera?: string;
  ciclo?: string;
  hacePracticas?: string;
  empresaPracticas?: string;
  empresaTrabajo?: string;
  nombreNegocio?: string;
  rubroNegocio?: string;
  actividadPrincipal?: string;
}
