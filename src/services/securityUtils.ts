// Security utilities for input validation and sanitization
export class SecurityUtils {
  
  // XSS protection - sanitize HTML input
  static sanitizeHtml(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Sanitize general text input
  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
      .trim()
      .slice(0, 1000); // Limit length
  }

  // Validate DNI format
  static validateDNI(dni: string): boolean {
    const cleanDNI = dni.replace(/\D/g, '');
    return /^\d{8}$/.test(cleanDNI);
  }

  // Validate email format with stronger regex
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Validate phone number format
  static validatePhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    return /^9\d{8}$/.test(cleanPhone); // Peruvian mobile format
  }

  // Sanitize file name
  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^\w\s.-]/g, '') // Only allow word chars, spaces, dots, hyphens
      .replace(/\.\./g, '.') // Prevent directory traversal
      .trim()
      .slice(0, 255); // Limit length
  }

  // Check if file type is allowed
  static isAllowedFileType(file: File, allowedTypes: string[]): boolean {
    const fileType = file.type.toLowerCase();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // Check MIME type
    const allowedMimeTypes = allowedTypes.map(type => type.toLowerCase());
    if (allowedMimeTypes.includes(fileType)) {
      return true;
    }
    
    // Check extension as fallback
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    return allowedExtensions.includes(fileExtension || '');
  }

  // Validate file size
  static validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  // Check for suspicious file content (basic checks)
  static async validateFileContent(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        // Check for potentially malicious content patterns
        const suspiciousPatterns = [
          /<script/i,
          /javascript:/i,
          /data:text\/html/i,
          /vbscript:/i
        ];
        
        const isSuspicious = suspiciousPatterns.some(pattern => 
          pattern.test(content)
        );
        
        resolve(!isSuspicious);
      };
      reader.onerror = () => resolve(false);
      reader.readAsText(file.slice(0, 1024)); // Read first 1KB
    });
  }

  // Rate limiting for form submissions
  private static submissionTimes: Map<string, number[]> = new Map();
  
  static checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const times = this.submissionTimes.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validTimes = times.filter(time => now - time < windowMs);
    
    if (validTimes.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    validTimes.push(now);
    this.submissionTimes.set(identifier, validTimes);
    return true;
  }

  // Generate secure random ID
  static generateSecureId(): string {
    return 'sec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Security event logger
export class SecurityLogger {
  private static events: Array<{
    timestamp: Date;
    event: string;
    details: any;
    severity: 'low' | 'medium' | 'high';
  }> = [];

  static logEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' = 'low') {
    this.events.push({
      timestamp: new Date(),
      event,
      details,
      severity
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[SECURITY] ${severity.toUpperCase()}: ${event}`, details);
    }

    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events.shift();
    }
  }

  static getEvents() {
    return [...this.events];
  }

  static getHighSeverityEvents() {
    return this.events.filter(e => e.severity === 'high');
  }
}
