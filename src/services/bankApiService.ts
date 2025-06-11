export interface BankApiConfig {
  id: string;
  bankName: string;
  apiUrl: string;
  authType: 'token' | 'api_key' | 'oauth' | 'basic';
  authValue: string;
  updateFrequency: number; // minutes
  isActive: boolean;
  lastUpdated?: Date;
  connectionStatus: 'connected' | 'disconnected' | 'error';
}

export interface BankProduct {
  id: string;
  bankId: string;
  bankName: string;
  productName: string;
  productType: string;
  tea: number;
  tcea: number;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  requirements: string[];
  profileRequirements: {
    minIncome: number;
    employmentType: string[];
    creditHistory: string[];
  };
  lastUpdated: Date;
}

class BankApiService {
  private apiConfigs: BankApiConfig[] = [];
  private bankProducts: BankProduct[] = [];
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.loadConfigs();
    this.initializeUpdateIntervals();
  }

  private loadConfigs() {
    const saved = localStorage.getItem('nezaBankApiConfigs');
    if (saved) {
      this.apiConfigs = JSON.parse(saved);
    }
  }

  private saveConfigs() {
    localStorage.setItem('nezaBankApiConfigs', JSON.stringify(this.apiConfigs));
  }

  private loadProducts() {
    const saved = localStorage.getItem('nezaBankProducts');
    if (saved) {
      this.bankProducts = JSON.parse(saved).map((p: any) => ({
        ...p,
        lastUpdated: new Date(p.lastUpdated)
      }));
    }
  }

  private saveProducts() {
    localStorage.setItem('nezaBankProducts', JSON.stringify(this.bankProducts));
  }

  async addApiConfig(config: Omit<BankApiConfig, 'id' | 'connectionStatus' | 'lastUpdated'>): Promise<string> {
    const id = `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newConfig: BankApiConfig = {
      ...config,
      id,
      connectionStatus: 'disconnected'
    };

    // Test connection
    const isConnected = await this.testConnection(newConfig);
    newConfig.connectionStatus = isConnected ? 'connected' : 'error';

    this.apiConfigs.push(newConfig);
    this.saveConfigs();

    if (isConnected && newConfig.isActive) {
      this.startUpdateInterval(newConfig);
    }

    return id;
  }

  async testConnection(config: BankApiConfig): Promise<boolean> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      switch (config.authType) {
        case 'token':
          headers['Authorization'] = `Bearer ${config.authValue}`;
          break;
        case 'api_key':
          headers['X-API-Key'] = config.authValue;
          break;
        case 'basic':
          headers['Authorization'] = `Basic ${btoa(config.authValue)}`;
          break;
      }

      const response = await fetch(config.apiUrl, {
        method: 'GET',
        headers
      });

      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  async fetchBankProducts(config: BankApiConfig): Promise<BankProduct[]> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      switch (config.authType) {
        case 'token':
          headers['Authorization'] = `Bearer ${config.authValue}`;
          break;
        case 'api_key':
          headers['X-API-Key'] = config.authValue;
          break;
        case 'basic':
          headers['Authorization'] = `Basic ${btoa(config.authValue)}`;
          break;
      }

      const response = await fetch(config.apiUrl, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Transform API response to our format
      return this.transformApiResponse(data, config);
    } catch (error) {
      console.error(`Failed to fetch products from ${config.bankName}:`, error);
      return [];
    }
  }

  private transformApiResponse(data: any, config: BankApiConfig): BankProduct[] {
    // This is a generic transformer - in real implementation, each bank would have its own transformer
    if (Array.isArray(data)) {
      return data.map(item => ({
        id: `${config.id}_${item.id || Math.random()}`,
        bankId: config.id,
        bankName: config.bankName,
        productName: item.name || item.productName || 'Producto',
        productType: item.type || item.productType || 'credito-personal',
        tea: parseFloat(item.tea || item.interestRate || '0'),
        tcea: parseFloat(item.tcea || item.totalCost || '0'),
        minAmount: parseInt(item.minAmount || '1000'),
        maxAmount: parseInt(item.maxAmount || '500000'),
        minTerm: parseInt(item.minTerm || '12'),
        maxTerm: parseInt(item.maxTerm || '60'),
        requirements: item.requirements || [],
        profileRequirements: {
          minIncome: parseInt(item.minIncome || '1000'),
          employmentType: item.employmentTypes || ['dependiente', 'independiente'],
          creditHistory: item.creditHistory || ['bueno', 'regular']
        },
        lastUpdated: new Date()
      }));
    }
    return [];
  }

  private startUpdateInterval(config: BankApiConfig) {
    if (this.updateIntervals.has(config.id)) {
      clearInterval(this.updateIntervals.get(config.id));
    }

    const interval = setInterval(async () => {
      await this.updateBankProducts(config);
    }, config.updateFrequency * 60 * 1000);

    this.updateIntervals.set(config.id, interval);
  }

  private async updateBankProducts(config: BankApiConfig) {
    const products = await this.fetchBankProducts(config);
    
    // Remove old products from this bank
    this.bankProducts = this.bankProducts.filter(p => p.bankId !== config.id);
    
    // Add new products
    this.bankProducts.push(...products);
    this.saveProducts();

    // Update config status
    const configIndex = this.apiConfigs.findIndex(c => c.id === config.id);
    if (configIndex !== -1) {
      this.apiConfigs[configIndex].lastUpdated = new Date();
      this.apiConfigs[configIndex].connectionStatus = products.length > 0 ? 'connected' : 'error';
      this.saveConfigs();
    }
  }

  private initializeUpdateIntervals() {
    this.loadProducts();
    this.apiConfigs
      .filter(config => config.isActive && config.connectionStatus === 'connected')
      .forEach(config => this.startUpdateInterval(config));
  }

  getApiConfigs(): BankApiConfig[] {
    return [...this.apiConfigs];
  }

  getBankProducts(): BankProduct[] {
    return [...this.bankProducts];
  }

  async updateApiConfig(id: string, updates: Partial<BankApiConfig>): Promise<boolean> {
    const index = this.apiConfigs.findIndex(c => c.id === id);
    if (index === -1) return false;

    const oldConfig = this.apiConfigs[index];
    this.apiConfigs[index] = { ...oldConfig, ...updates };

    if (updates.isActive !== undefined || updates.updateFrequency !== undefined) {
      if (this.updateIntervals.has(id)) {
        clearInterval(this.updateIntervals.get(id));
        this.updateIntervals.delete(id);
      }

      if (this.apiConfigs[index].isActive) {
        this.startUpdateInterval(this.apiConfigs[index]);
      }
    }

    this.saveConfigs();
    return true;
  }

  async deleteApiConfig(id: string): Promise<boolean> {
    const index = this.apiConfigs.findIndex(c => c.id === id);
    if (index === -1) return false;

    if (this.updateIntervals.has(id)) {
      clearInterval(this.updateIntervals.get(id));
      this.updateIntervals.delete(id);
    }

    this.apiConfigs.splice(index, 1);
    this.bankProducts = this.bankProducts.filter(p => p.bankId !== id);
    
    this.saveConfigs();
    this.saveProducts();
    return true;
  }

  getProductsByUserProfile(userProfile: any): BankProduct[] {
    return this.bankProducts
      .filter(product => {
        const meetsIncome = userProfile.income >= product.profileRequirements.minIncome;
        const meetsEmployment = product.profileRequirements.employmentType.includes(userProfile.employment);
        const meetsCreditHistory = product.profileRequirements.creditHistory.includes(userProfile.creditScore);
        
        return meetsIncome && meetsEmployment && meetsCreditHistory;
      })
      .sort((a, b) => a.tea - b.tea); // Sort by TEA ascending
  }
}

export const bankApiService = new BankApiService();
