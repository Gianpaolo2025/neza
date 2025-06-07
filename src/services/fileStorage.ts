
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
  };
}

class FileStorageService {
  private files: Map<string, StoredFile> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private generateId(): string {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private saveToStorage(): void {
    try {
      const serializedFiles = Array.from(this.files.entries()).map(([id, storedFile]) => ({
        id,
        base64: storedFile.base64,
        metadata: storedFile.metadata
      }));
      
      localStorage.setItem('neza_stored_files', JSON.stringify(serializedFiles));
    } catch (error) {
      console.error('Error saving files to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('neza_stored_files');
      if (stored) {
        const serializedFiles = JSON.parse(stored);
        
        serializedFiles.forEach((item: any) => {
          // Recrear el objeto File desde base64
          const base64Data = item.base64.split(',')[1];
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          const file = new File([byteArray], item.metadata.name, {
            type: item.metadata.type,
            lastModified: item.metadata.lastModified
          });

          this.files.set(item.id, {
            id: item.id,
            file,
            base64: item.base64,
            metadata: item.metadata
          });
        });
      }
    } catch (error) {
      console.error('Error loading files from storage:', error);
    }
  }

  async storeFile(file: File, documentType: string): Promise<string> {
    try {
      const id = this.generateId();
      const base64 = await this.fileToBase64(file);
      
      const storedFile: StoredFile = {
        id,
        file,
        base64,
        metadata: {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          uploadTime: new Date(),
          documentType
        }
      };

      this.files.set(id, storedFile);
      this.saveToStorage();
      
      console.log(`File stored successfully: ${file.name} (${file.size} bytes)`);
      return id;
    } catch (error) {
      console.error('Error storing file:', error);
      throw new Error('No se pudo almacenar el archivo');
    }
  }

  getFile(id: string): StoredFile | null {
    return this.files.get(id) || null;
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
    }
    return deleted;
  }

  async downloadFile(id: string): Promise<void> {
    const storedFile = this.getFile(id);
    if (!storedFile) {
      throw new Error('Archivo no encontrado');
    }

    // Crear un enlace de descarga
    const link = document.createElement('a');
    link.href = storedFile.base64;
    link.download = storedFile.metadata.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getTotalStorageSize(): number {
    return Array.from(this.files.values()).reduce((total, file) => total + file.metadata.size, 0);
  }

  getStorageStats(): {
    totalFiles: number;
    totalSize: number;
    fileTypes: Array<{ type: string; count: number; size: number }>;
    documentTypes: Array<{ type: string; count: number }>;
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
      documentTypes
    };
  }
}

export const fileStorageService = new FileStorageService();
