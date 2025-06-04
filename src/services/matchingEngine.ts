
import { FinancialEntity, FinancialProduct, sbsEntities } from '../data/sbsEntities';
import { UserProfile } from './documentAnalyzer';

export interface ProductMatch {
  entity: FinancialEntity;
  product: FinancialProduct;
  compatibilityScore: number;
  meetsRequirements: boolean;
  missingRequirements: string[];
  estimatedRate: number;
  recommendedAmount: number;
  riskLevel: 'bajo' | 'medio' | 'alto';
}

export interface AuctionOffer {
  match: ProductMatch;
  dynamicRate: number;
  specialConditions: string[];
  expiresAt: Date;
  rank: number;
}

export class MatchingEngine {
  static findCompatibleProducts(userProfile: UserProfile, productType?: string): ProductMatch[] {
    const matches: ProductMatch[] = [];
    
    sbsEntities.forEach(entity => {
      entity.products.forEach(product => {
        if (productType && product.type !== productType) return;
        
        const match = this.evaluateProductMatch(userProfile, entity, product);
        matches.push(match);
      });
    });

    return matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  private static evaluateProductMatch(
    userProfile: UserProfile, 
    entity: FinancialEntity, 
    product: FinancialProduct
  ): ProductMatch {
    const requirements = product.requirements;
    const missingRequirements: string[] = [];
    let compatibilityScore = 0;
    let meetsRequirements = true;

    // Evaluar edad
    if (userProfile.personalInfo?.age) {
      if (userProfile.personalInfo.age < requirements.minAge || 
          userProfile.personalInfo.age > requirements.maxAge) {
        missingRequirements.push(`Edad debe estar entre ${requirements.minAge} y ${requirements.maxAge} años`);
        meetsRequirements = false;
      } else {
        compatibilityScore += 20;
      }
    }

    // Evaluar ingresos
    if (userProfile.employment?.monthlyIncome) {
      if (userProfile.employment.monthlyIncome < requirements.minIncome) {
        missingRequirements.push(`Ingreso mínimo requerido: S/. ${requirements.minIncome}`);
        meetsRequirements = false;
      } else {
        const incomeRatio = userProfile.employment.monthlyIncome / requirements.minIncome;
        compatibilityScore += Math.min(25, incomeRatio * 10);
      }
    }

    // Evaluar tiempo de trabajo
    if (userProfile.employment?.workTime) {
      if (userProfile.employment.workTime < requirements.minWorkTime) {
        missingRequirements.push(`Tiempo mínimo de trabajo: ${requirements.minWorkTime} meses`);
        meetsRequirements = false;
      } else {
        compatibilityScore += 15;
      }
    }

    // Evaluar score crediticio
    if (userProfile.credit?.score) {
      if (userProfile.credit.score < requirements.minCreditScore) {
        missingRequirements.push(`Score crediticio mínimo: ${requirements.minCreditScore}`);
        meetsRequirements = false;
      } else {
        const scoreRatio = userProfile.credit.score / requirements.minCreditScore;
        compatibilityScore += Math.min(20, scoreRatio * 10);
      }
    }

    // Evaluar ratio deuda/ingresos
    if (userProfile.credit?.debtToIncome) {
      if (userProfile.credit.debtToIncome > requirements.maxDebtToIncome) {
        missingRequirements.push(`Ratio deuda/ingresos máximo: ${requirements.maxDebtToIncome}%`);
        meetsRequirements = false;
      } else {
        compatibilityScore += 15;
      }
    }

    // Evaluar calidad de documentos
    const qualityBonus = userProfile.qualityScore * 0.05;
    compatibilityScore += qualityBonus;

    // Penalizar si faltan documentos requeridos
    const requiredDocs = requirements.documentos.map(doc => doc.toLowerCase().replace(/\s+/g, '-'));
    const userDocs = Object.keys(userProfile.documents || {});
    const missingDocs = requiredDocs.filter(doc => !userDocs.includes(doc));
    
    if (missingDocs.length > 0) {
      missingRequirements.push(`Documentos faltantes: ${missingDocs.join(', ')}`);
      compatibilityScore *= 0.7;
    }

    // Calcular tasa estimada
    const baseRate = (product.interestRateRange.min + product.interestRateRange.max) / 2;
    const riskAdjustment = this.calculateRiskAdjustment(userProfile, product);
    const estimatedRate = baseRate + riskAdjustment;

    // Calcular monto recomendado
    const recommendedAmount = this.calculateRecommendedAmount(userProfile, product);

    // Determinar nivel de riesgo
    const riskLevel = this.calculateRiskLevel(userProfile, product);

    return {
      entity,
      product,
      compatibilityScore: Math.round(compatibilityScore),
      meetsRequirements,
      missingRequirements,
      estimatedRate: Math.round(estimatedRate * 100) / 100,
      recommendedAmount,
      riskLevel
    };
  }

  private static calculateRiskAdjustment(userProfile: UserProfile, product: FinancialProduct): number {
    let adjustment = 0;

    // Ajuste por score crediticio
    if (userProfile.credit?.score) {
      if (userProfile.credit.score < 350) adjustment += 3;
      else if (userProfile.credit.score < 400) adjustment += 1.5;
      else if (userProfile.credit.score > 500) adjustment -= 1;
    }

    // Ajuste por ratio deuda/ingresos
    if (userProfile.credit?.debtToIncome) {
      if (userProfile.credit.debtToIncome > 40) adjustment += 2;
      else if (userProfile.credit.debtToIncome < 20) adjustment -= 0.5;
    }

    // Ajuste por calidad de documentos
    if (userProfile.qualityScore < 70) adjustment += 1;
    else if (userProfile.qualityScore > 90) adjustment -= 0.5;

    return adjustment;
  }

  private static calculateRecommendedAmount(userProfile: UserProfile, product: FinancialProduct): number {
    if (!userProfile.employment?.monthlyIncome) return product.conditions.minAmount;

    const monthlyIncome = userProfile.employment.monthlyIncome;
    const debtToIncomeRatio = userProfile.credit?.debtToIncome || 0;
    
    // Calcular capacidad de pago (30% de ingresos menos deudas existentes)
    const availableIncome = monthlyIncome * 0.3 * (1 - debtToIncomeRatio / 100);
    
    // Calcular monto máximo basado en capacidad de pago
    const maxByIncome = availableIncome * product.conditions.maxTerm;
    
    // Limitar por condiciones del producto
    return Math.min(
      Math.max(product.conditions.minAmount, maxByIncome),
      product.conditions.maxAmount
    );
  }

  private static calculateRiskLevel(userProfile: UserProfile, product: FinancialProduct): 'bajo' | 'medio' | 'alto' {
    let riskScore = 0;

    if (userProfile.credit?.score) {
      if (userProfile.credit.score > 450) riskScore += 3;
      else if (userProfile.credit.score > 350) riskScore += 2;
      else riskScore += 1;
    }

    if (userProfile.credit?.debtToIncome) {
      if (userProfile.credit.debtToIncome < 30) riskScore += 2;
      else if (userProfile.credit.debtToIncome < 50) riskScore += 1;
    }

    if (userProfile.qualityScore > 80) riskScore += 1;

    if (riskScore >= 5) return 'bajo';
    if (riskScore >= 3) return 'medio';
    return 'alto';
  }

  static createDynamicAuction(matches: ProductMatch[]): AuctionOffer[] {
    const eligibleMatches = matches.filter(match => match.meetsRequirements);
    
    return eligibleMatches.map((match, index) => {
      // Simular competencia dinámica
      const competitiveDiscount = Math.random() * 2; // 0-2% descuento
      const dynamicRate = Math.max(
        match.product.interestRateRange.min,
        match.estimatedRate - competitiveDiscount
      );

      const specialConditions: string[] = [];
      if (match.compatibilityScore > 80) {
        specialConditions.push('Cliente preferencial - Sin comisiones');
      }
      if (match.riskLevel === 'bajo') {
        specialConditions.push('Aprobación express en 24 horas');
      }

      return {
        match,
        dynamicRate: Math.round(dynamicRate * 100) / 100,
        specialConditions,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        rank: index + 1
      };
    }).sort((a, b) => a.dynamicRate - b.dynamicRate);
  }
}
