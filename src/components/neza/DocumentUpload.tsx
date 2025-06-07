
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle, AlertCircle, FileText, Loader2, Eye, Download } from "lucide-react";
import { DocumentAnalyzer, DocumentAnalysis } from "@/services/documentAnalyzer";
import { fileStorageService } from "@/services/fileStorage";
import { userTrackingService } from "@/services/userTracking";

interface DocumentUploadProps {
  title: string;
  description: string;
  required: boolean;
  documentType: string;
  onUpload: (file: File, analysis: DocumentAnalysis, fileId: string) => void;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
}

export const DocumentUpload = ({ 
  title, 
  description, 
  required, 
  documentType,
  status, 
  onUpload 
}: DocumentUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file && (file.type.includes('pdf') || file.type.includes('image'))) {
      setUploading(true);
      setUploadedFile(file);
      setAnalyzing(true);
      
      try {
        // Almacenar archivo real
        const storedFileId = await fileStorageService.storeFile(file, documentType);
        setFileId(storedFileId);
        
        // Trackear subida de archivo
        userTrackingService.trackFileUpload(
          file.name, 
          file.type, 
          file.size, 
          documentType
        );
        
        // Analizar documento
        const documentAnalysis = await DocumentAnalyzer.analyzeDocument(file, documentType);
        setAnalysis(documentAnalysis);
        
        // Actualizar análisis en el almacenamiento
        const storedFile = fileStorageService.getFile(storedFileId);
        if (storedFile) {
          storedFile.metadata = {
            ...storedFile.metadata,
            analysisResult: documentAnalysis
          };
        }
        
        onUpload(file, documentAnalysis, storedFileId);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error al subir el archivo. Por favor, inténtalo de nuevo.');
      } finally {
        setAnalyzing(false);
        setUploading(false);
      }
    } else {
      alert('Por favor selecciona un archivo PDF o imagen (JPG, PNG)');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDownload = async () => {
    if (fileId) {
      try {
        await fileStorageService.downloadFile(fileId);
      } catch (error) {
        console.error('Error downloading file:', error);
        alert('Error al descargar el archivo');
      }
    }
  };

  const getStatusIcon = () => {
    if (uploading || analyzing) {
      return <Loader2 className="w-5 h-5 text-neza-blue-500 animate-spin" />;
    }
    
    switch (status) {
      case 'pending':
        return <Upload className="w-5 h-5 text-neza-silver-400" />;
      case 'uploaded':
        return <Loader2 className="w-5 h-5 text-neza-blue-500 animate-spin" />;
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-neza-blue-600" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (uploading) return 'Subiendo archivo...';
    if (analyzing) return 'Analizando documento...';
    
    switch (status) {
      case 'pending':
        return 'Pendiente de subir';
      case 'uploaded':
        return 'Procesando documento...';
      case 'verified':
        return `Documento verificado (${Math.round((analysis?.confidence || 0) * 100)}% confiabilidad)`;
      case 'rejected':
        return 'Documento rechazado - Volver a subir';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'border-neza-silver-200';
      case 'uploaded':
        return 'border-neza-blue-200 bg-neza-blue-50';
      case 'verified':
        return 'border-neza-blue-200 bg-neza-blue-50';
      case 'rejected':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <Card className={getStatusColor()}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center text-neza-blue-800">
              {title}
              {required && <span className="text-red-500 ml-1">*</span>}
            </CardTitle>
            <CardDescription className="text-neza-silver-600">{description}</CardDescription>
          </div>
          <div className="flex items-center ml-4">
            {getStatusIcon()}
            <span className="ml-2 text-sm font-medium text-neza-blue-700">{getStatusText()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {(status === 'pending' || status === 'rejected') && !analyzing && !uploading ? (
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${dragOver ? 'border-neza-blue-400 bg-neza-blue-50' : 'border-neza-silver-300 hover:border-neza-blue-400'}
            `}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="w-8 h-8 text-neza-silver-400 mx-auto mb-2" />
            <p className="text-sm text-neza-silver-600 mb-2">
              Arrastra tu archivo aquí o <span className="text-neza-blue-600 font-medium">haz clic para seleccionar</span>
            </p>
            <p className="text-xs text-neza-silver-500">
              Formatos aceptados: PDF, JPG, PNG (máx. 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-neza-silver-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-neza-silver-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-neza-blue-800">{uploadedFile?.name || 'Documento subido'}</p>
                  <p className="text-xs text-neza-silver-500">
                    {uploadedFile ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {analysis && (
                  <Button variant="outline" size="sm" className="border-neza-blue-300 text-neza-blue-600">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Análisis
                  </Button>
                )}
                {fileId && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownload}
                    className="border-neza-cyan-300 text-neza-cyan-600"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Descargar
                  </Button>
                )}
              </div>
            </div>
            
            {analysis && analysis.extractedData && (
              <div className="p-3 bg-neza-blue-50 border border-neza-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-neza-blue-900 mb-2">Datos Extraídos:</h4>
                <div className="text-xs text-neza-blue-700 space-y-1">
                  {Object.entries(analysis.extractedData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {status === 'rejected' && analysis && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Problemas detectados:</strong>
            </p>
            <ul className="text-sm text-red-600 mt-1 list-disc list-inside">
              {analysis.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
