
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle, AlertCircle, FileText, Loader2 } from "lucide-react";

interface DocumentUploadProps {
  title: string;
  description: string;
  required: boolean;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  onUpload: (file: File) => void;
}

export const DocumentUpload = ({ 
  title, 
  description, 
  required, 
  status, 
  onUpload 
}: DocumentUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && (file.type.includes('pdf') || file.type.includes('image'))) {
      setUploadedFile(file);
      onUpload(file);
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

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Upload className="w-5 h-5 text-gray-400" />;
      case 'uploaded':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pendiente de subir';
      case 'uploaded':
        return 'Procesando documento...';
      case 'verified':
        return 'Documento verificado';
      case 'rejected':
        return 'Documento rechazado - Volver a subir';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'border-gray-200';
      case 'uploaded':
        return 'border-blue-200 bg-blue-50';
      case 'verified':
        return 'border-green-200 bg-green-50';
      case 'rejected':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <Card className={getStatusColor()}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center">
              {title}
              {required && <span className="text-red-500 ml-1">*</span>}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center ml-4">
            {getStatusIcon()}
            <span className="ml-2 text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {status === 'pending' || status === 'rejected' ? (
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${dragOver ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400'}
            `}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Arrastra tu archivo aquí o <span className="text-emerald-600 font-medium">haz clic para seleccionar</span>
            </p>
            <p className="text-xs text-gray-500">
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
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium">{uploadedFile?.name || 'Documento subido'}</p>
                <p className="text-xs text-gray-500">
                  {uploadedFile ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                </p>
              </div>
            </div>
            {status === 'rejected' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Subir nuevo
              </Button>
            )}
          </div>
        )}

        {status === 'rejected' && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <strong>Motivo del rechazo:</strong> El documento no es legible o no cumple con los requisitos. 
              Por favor, sube una imagen más clara o un archivo con mejor calidad.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
