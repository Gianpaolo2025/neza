
import { UserProfile } from './documentAnalyzer';
import { bankApiService, BankProduct } from './bankApiService';
import { MatchingEngine } from './matchingEngine';

export interface EnhancedProductMatch {
  id: string;
  entity: {
    name: string;
    type: string;
  };
  product: {
    id: string;
    name: string;
    type: string;
  };
  isRealData: boolean;
  compatibilityScore: number;
  estimatedRate: number;
  recommendedAmount: number;
  riskLevel: 'bajo' | 'medio' | 'alto';
  meetsRequirements: boolean;
  missingRequirements: string[];
}

export interface EnhancedAuctionOffer {
  match: EnhancedProductMatch;
  dynamicRate: number;
  originalRate: number;
  specialConditions: string[];
  expiresAt: Date;
  isRealTimeData: boolean;
}

export class EnhancedMatchingEngine {
  static findCompatibleProducts(userProfile: UserProfile, productType?: string): EnhancedProductMatch[] {
    const matches: EnhancedProductMatch[] = [];
    
    // Get real bank products from APIs
    const realProducts = bankApiService.getProductsByUserProfile(userProfile);
    
    // Convert real products to matches
    const realMatches = realProducts
      .filter(product => !productType || product.productType === productType)
      .map(product => this.createMatchFromRealProduct(product, userProfile));
    
    matches.push(...realMatches);
    
    // If we don't have enough real data, supplement with simulated data
    if (realMatches.length < 5) {
      const simulatedMatches = MatchingEngine.findCompatibleProducts(userProfile, productType)
        .slice(0, 8 - realMatches.length)
        .map(match => this.convertToEnhancedMatch(match, false));
      
      matches.push(...simulatedMatches);
    }
    
    // Sort by compatibility score and TEA
    return matches.sort((a, b) => {
      if (a.isRealData && !b.isRealData) return -1;
      if (!a.isRealData && b.isRealData) return 1;
      if (a.compatibilityScore !== b.compatibilityScore) {
        return b.compatibilityScore - a.compatibilityScore;
      }
      return a.estimatedRate - b.estimatedRate;
    });
  }

  private static createMatchFromRealProduct(product: BankProduct, userProfile: UserProfile): EnhancedProductMatch {
    // Calculate compatibility score based on user profile
    let compatibilityScore = 80; // Base score for real data
    
    const userIncome = userProfile.employment?.monthlyIncome || 0;
    const incomeRatio = userIncome / product.profileRequirements.minIncome;
    if (incomeRatio >= 2) compatibilityScore += 15;
    else if (incomeRatio >= 1.5) compatibilityScore += 10;
    else if (incomeRatio >= 1) compatibilityScore += 5;
    
    if (product.profileRequirements.employmentType.includes(userProfile.employment?.type || 'dependiente')) {
      compatibilityScore += 5;
    }
    
    // Check requirements
    const missingRequirements: string[] = [];
    let meetsRequirements = true;
    
    if (userIncome < product.profileRequirements.minIncome) {
      missingRequirements.push(`Ingreso mínimo requerido: S/ ${product.profileRequirements.minIncome.toLocaleString()}`);
      meetsRequirements = false;
    }
    
    if (!product.profileRequirements.employmentType.includes(userProfile.employment?.type || 'dependiente')) {
      missingRequirements.push('Tipo de empleo no compatible');
      meetsRequirements = false;
    }
    
    const userCreditScore = userProfile.credit?.score || 300;
    const creditScoreMap: { [key: number]: string } = {
      300: 'malo',
      350: 'regular',
      420: 'bueno',
      500: 'excelente'
    };
    
    let creditStatus = 'malo';
    for (const [score, status] of Object.entries(creditScoreMap)) {
      if (userCreditScore >= parseInt(score)) {
        creditStatus = status;
      }
    }
    
    if (!product.profileRequirements.creditHistory.includes(creditStatus)) {
      missingRequirements.push('Historial crediticio insuficiente');
      meetsRequirements = false;
    }
    
    // Calculate recommended amount - use a default amount if not provided
    const maxByIncome = userIncome * 5;
    const defaultRequestedAmount = Math.min(50000, maxByIncome); // Default to 50k or income-based limit
    const recommendedAmount = Math.min(
      defaultRequestedAmount,
      Math.min(maxByIncome, product.maxAmount)
    );
    
    // Risk level based on income ratio and requested amount
    let riskLevel: 'bajo' | 'medio' | 'alto' = 'medio';
    if (incomeRatio >= 2 && recommendedAmount <= userIncome * 3) {
      riskLevel = 'bajo';
    } else if (incomeRatio < 1.2 || recommendedAmount > userIncome * 4) {
      riskLevel = 'alto';
    }
    
    return {
      id: product.id,
      entity: {
        name: product.bankName,
        type: 'banco'
      },
      product: {
        id: product.id,
        name: product.productName,
        type: product.productType
      },
      isRealData: true,
      compatibilityScore: Math.min(100, compatibilityScore),
      estimatedRate: product.tea,
      recommendedAmount,
      riskLevel,
      meetsRequirements,
      missingRequirements
    };
  }

  private static convertToEnhancedMatch(originalMatch: any, isRealData: boolean): EnhancedProductMatch {
    return {
      id: originalMatch.product.id,
      entity: originalMatch.entity,
      product: originalMatch.product,
      isRealData,
      compatibilityScore: originalMatch.compatibilityScore,
      estimatedRate: originalMatch.estimatedRate,
      recommendedAmount: originalMatch.recommendedAmount,
      riskLevel: originalMatch.riskLevel,
      meetsRequirements: originalMatch.meetsRequirements,
      missingRequirements: originalMatch.missingRequirements
    };
  }

  static createDynamicAuction(matches: EnhancedProductMatch[]): EnhancedAuctionOffer[] {
    const eligibleMatches = matches.filter(m => m.meetsRequirements);
    
    return eligibleMatches.slice(0, 5).map(match => {
      const baseRate = match.estimatedRate;
      const rateReduction = match.isRealData 
        ? Math.random() * 0.3 + 0.1  // 0.1% to 0.4% for real data
        : Math.random() * 0.8 + 0.2; // 0.2% to 1.0% for simulated data
      
      const dynamicRate = Math.max(baseRate - rateReduction, 8.0);
      
      const specialConditions: string[] = [];
      
      if (match.isRealData) {
        specialConditions.push('Datos en tiempo real');
      }
      
      if (match.compatibilityScore >= 90) {
        specialConditions.push('Cliente preferencial');
      }
      
      if (match.riskLevel === 'bajo') {
        specialConditions.push('Bajo riesgo');
      }
      
      return {
        match,
        dynamicRate: Number(dynamicRate.toFixed(2)),
        originalRate: baseRate,
        specialConditions,
        expiresAt: new Date(Date.now() + (Math.random() * 3600 + 1800) * 1000),
        isRealTimeData: match.isRealData
      };
    });
  }
}
