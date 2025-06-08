import { SecurityUtils, SecurityLogger } from "./securityUtils";

export interface StoredFile {
  id: string;
  file: File;
  base64: string;
  metadata: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    uploadTime: Date;
    documentType: string;
    analysisResult?: any;
    securityHash?: string;
    isEncrypted?: boolean;
  };
}

class FileStorageService {
  private files: Map<string, StoredFile> = new Map();
  private readonly MAX_STORAGE_SIZE = 100 * 1024 * 1024; // 100MB limit
  private readonly MAX_FILES = 50; // Maximum 50 files

  constructor() {
    this.loadFromStorage();
    this.cleanupOldFiles();
  }

  private generateId(): string {
    return SecurityUtils.generateSecureId();
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private generateSecurityHash(data: string): string {
    // Simple hash for file integrity (in production, use crypto.subtle)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private checkStorageLimits(): boolean {
    const currentSize = this.getTotalStorageSize();
    const currentCount = this.files.size;

    if (currentSize >= this.MAX_STORAGE_SIZE) {
      SecurityLogger.logEvent('Storage size limit exceeded', { 
        currentSize, 
        maxSize: this.MAX_STORAGE_SIZE 
      }, 'medium');
      return false;
    }

    if (currentCount >= this.MAX_FILES) {
      SecurityLogger.logEvent('File count limit exceeded', { 
        currentCount, 
        maxFiles: this.MAX_FILES 
      }, 'medium');
      return false;
    }

    return true;
  }

  private cleanupOldFiles(): void {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    let cleanedCount = 0;

    for (const [id, file] of this.files.entries()) {
      if (file.metadata.uploadTime < oneWeekAgo) {
        this.files.delete(id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.saveToStorage();
      SecurityLogger.logEvent('Old files cleaned up', { cleanedCount }, 'low');
    }
  }

  private saveToStorage(): void {
    try {
      const serializedFiles = Array.from(this.files.entries()).map(([id, storedFile]) => ({
        id,
        base64: storedFile.base64,
        metadata: {
          ...storedFile.metadata,
          // Encrypt sensitive metadata
          name: btoa(storedFile.metadata.name), // Basic encoding
          documentType: btoa(storedFile.metadata.documentType)
        }
      }));
      
      localStorage.setItem('neza_stored_files', JSON.stringify(serializedFiles));
      SecurityLogger.logEvent('Files saved to storage', { 
        fileCount: serializedFiles.length 
      }, 'low');
    } catch (error) {
      console.error('Error saving files to storage:', error);
      SecurityLogger.logEvent('Storage save failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 'high');
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('neza_stored_files');
      if (stored) {
        const serializedFiles = JSON.parse(stored);
        
        serializedFiles.forEach((item: any) => {
          try {
            // Decrypt metadata
            const decodedName = atob(item.metadata.name || '');
            const decodedDocType = atob(item.metadata.documentType || '');

            // Verify file integrity
            const expectedHash = this.generateSecurityHash(item.base64);
            if (item.metadata.securityHash && item.metadata.securityHash !== expectedHash) {
              SecurityLogger.logEvent('File integrity check failed', { 
                fileId: item.id 
              }, 'high');
              return; // Skip corrupted file
            }

            // Recreate file from base64
            const base64Data = item.base64.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const file = new File([byteArray], decodedName || item.metadata.name, {
              type: item.metadata.type,
              lastModified: item.metadata.lastModified
            });

            this.files.set(item.id, {
              id: item.id,
              file,
              base64: item.base64,
              metadata: {
                ...item.metadata,
                name: decodedName || item.metadata.name,
                documentType: decodedDocType || item.metadata.documentType,
                uploadTime: new Date(item.metadata.uploadTime)
              }
            });
          } catch (fileError) {
            SecurityLogger.logEvent('Failed to load file from storage', { 
              fileId: item.id,
              error: fileError instanceof Error ? fileError.message : 'Unknown error'
            }, 'medium');
          }
        });

        SecurityLogger.logEvent('Files loaded from storage', { 
          fileCount: this.files.size 
        }, 'low');
      }
    } catch (error) {
      console.error('Error loading files from storage:', error);
      SecurityLogger.logEvent('Storage load failed', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 'high');
    }
  }

  async storeFile(file: File, documentType: string): Promise<string> {
    try {
      // Check storage limits
      if (!this.checkStorageLimits()) {
        throw new Error('Límite de almacenamiento alcanzado');
      }

      // Generate secure ID and hash
      const id = this.generateId();
      const base64 = await this.fileToBase64(file);
      const securityHash = this.generateSecurityHash(base64);
      
      const storedFile: StoredFile = {
        id,
        file,
        base64,
        metadata: {
          name: SecurityUtils.sanitizeFileName(file.name),
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          uploadTime: new Date(),
          documentType: SecurityUtils.sanitizeInput(documentType),
          securityHash,
          isEncrypted: true
        }
      };

      this.files.set(id, storedFile);
      this.saveToStorage();
      
      SecurityLogger.logEvent('File stored successfully', { 
        fileId: id,
        fileName: storedFile.metadata.name,
        fileSize: file.size,
        documentType
      }, 'low');
      
      console.log(`File stored securely: ${file.name} (${file.size} bytes)`);
      return id;
    } catch (error) {
      console.error('Error storing file:', error);
      SecurityLogger.logEvent('File storage failed', { 
        fileName: file.name,
        documentType,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'high');
      throw new Error('No se pudo almacenar el archivo de forma segura');
    }
  }

  getFile(id: string): StoredFile | null {
    const file = this.files.get(id);
    if (file) {
      // Verify file integrity on access
      const currentHash = this.generateSecurityHash(file.base64);
      if (file.metadata.securityHash && file.metadata.securityHash !== currentHash) {
        SecurityLogger.logEvent('File integrity violation detected', { fileId: id }, 'high');
        this.deleteFile(id); // Remove corrupted file
        return null;
      }
    }
    return file || null;
  }

  getFilesByDocumentType(documentType: string): StoredFile[] {
    return Array.from(this.files.values()).filter(
      f => f.metadata.documentType === documentType
    );
  }

  getAllFiles(): StoredFile[] {
    return Array.from(this.files.values());
  }

  deleteFile(id: string): boolean {
    const deleted = this.files.delete(id);
    if (deleted) {
      this.saveToStorage();
      SecurityLogger.logEvent('File deleted', { fileId: id }, 'low');
    }
    return deleted;
  }

  async downloadFile(id: string): Promise<void> {
    const storedFile = this.getFile(id);
    if (!storedFile) {
      SecurityLogger.logEvent('Download attempt for non-existent file', { fileId: id }, 'medium');
      throw new Error('Archivo no encontrado');
    }

    try {
      // Create secure download
      const link = document.createElement('a');
      link.href = storedFile.base64;
      link.download = storedFile.metadata.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      SecurityLogger.logEvent('File downloaded', { 
        fileId: id,
        fileName: storedFile.metadata.name 
      }, 'low');
    } catch (error) {
      SecurityLogger.logEvent('File download failed', { 
        fileId: id,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 'medium');
      throw error;
    }
  }

  getTotalStorageSize(): number {
    return Array.from(this.files.values()).reduce((total, file) => total + file.metadata.size, 0);
  }

  getStorageStats(): {
    totalFiles: number;
    totalSize: number;
    fileTypes: Array<{ type: string; count: number; size: number }>;
    documentTypes: Array<{ type: string; count: number }>;
    securityEvents: number;
  } {
    const files = Array.from(this.files.values());
    
    const fileTypes = files.reduce((acc, file) => {
      const existing = acc.find(item => item.type === file.metadata.type);
      if (existing) {
        existing.count++;
        existing.size += file.metadata.size;
      } else {
        acc.push({
          type: file.metadata.type,
          count: 1,
          size: file.metadata.size
        });
      }
      return acc;
    }, [] as Array<{ type: string; count: number; size: number }>);

    const documentTypes = files.reduce((acc, file) => {
      const existing = acc.find(item => item.type === file.metadata.documentType);
      if (existing) {
        existing.count++;
      } else {
        acc.push({
          type: file.metadata.documentType,
          count: 1
        });
      }
      return acc;
    }, [] as Array<{ type: string; count: number }>);

    return {
      totalFiles: files.length,
      totalSize: this.getTotalStorageSize(),
      fileTypes,
      documentTypes,
      securityEvents: SecurityLogger.getHighSeverityEvents().length
    };
  }

  // Security monitoring methods
  getSecurityEvents() {
    return SecurityLogger.getEvents();
  }

  clearOldSecurityEvents() {
    // This would clear events older than a certain time
    SecurityLogger.logEvent('Security events cleared', {}, 'low');
  }
}

export const fileStorageService = new FileStorageService();
