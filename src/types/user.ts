
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
  workDetails?: string;
  documents?: {
    dni: File | null;
    payslips: File | null;
    others: File | null;
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
