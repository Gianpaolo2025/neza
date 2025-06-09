
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Upload, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { DocumentUpload } from "./DocumentUpload";
import { DocumentAnalysis } from "@/services/documentAnalyzer";

interface DocumentsSectionProps {
  onDocumentUpload?: (documentType: string, file: File, analysis: DocumentAnalysis, fileId: string) => void;
}

export const DocumentsSection = ({ onDocumentUpload }: DocumentsSectionProps) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<{ [key: string]: any }>({});

  const documentTypes = [
    {
      type: 'dni',
      title: 'Documento de Identidad',
      description: 'DNI vigente (ambas caras)',
      required: true,
      impact: 'Alto'
    },
    {
      type: 'income-proof',
      title: 'Comprobante de Ingresos',
      description: 'Boletas de pago, recibos por honorarios o declaración jurada',
      required: true,
      impact: 'Muy Alto'
    },
    {
      type: 'work-certificate',
      title: 'Certificado de Trabajo',
      description: 'Constancia laboral o carta de trabajo',
      required: false,
      impact: 'Medio'
    },
    {
      type: 'bank-statements',
      title: 'Estados de Cuenta',
      description: 'Últimos 3 meses de movimientos bancarios',
      required: false,
      impact: 'Alto'
    },
    {
      type: 'property-documents',
      title: 'Documentos de Propiedad',
      description: 'Títulos de propiedad, contratos de alquiler, etc.',
      required: false,
      impact: 'Medio'
    }
  ];

  const handleDocumentUpload = (documentType: string, file: File, analysis: DocumentAnalysis, fileId: string) => {
    setUploadedDocuments(prev => ({
      ...prev,
      [documentType]: {
        file,
        analysis,
        fileId,
        uploadedAt: new Date()
      }
    }));

    if (onDocumentUpload) {
      onDocumentUpload(documentType, file, analysis, fileId);
    }
  };

  const getDocumentStatus = (documentType: string): 'pending' | 'uploaded' | 'verified' | 'rejected' => {
    const doc = uploadedDocuments[documentType];
    if (!doc) return 'pending';
    
    // Simulate verification process
    if (doc.analysis && doc.analysis.confidence > 0.8) {
      return 'verified';
    } else if (doc.analysis && doc.analysis.confidence > 0.5) {
      return 'uploaded';
    } else {
      return 'rejected';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Muy Alto': return 'bg-green-100 text-green-800';
      case 'Alto': return 'bg-blue-100 text-blue-800';
      case 'Medio': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completionPercentage = () => {
    const totalDocs = documentTypes.length;
    const uploadedCount = Object.keys(uploadedDocuments).length;
    return Math.round((uploadedCount / totalDocs) * 100);
  };

  const requiredDocsUploaded = () => {
    const requiredDocs = documentTypes.filter(doc => doc.required);
    const uploadedRequired = requiredDocs.filter(doc => uploadedDocuments[doc.type]);
    return uploadedRequired.length;
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center text-emerald-800">
            <FileText className="w-6 h-6 mr-3" />
            Sube tus Documentos para Mejores Ofertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{completionPercentage()}%</div>
              <p className="text-sm text-emerald-700">Completado</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {requiredDocsUploaded()}/{documentTypes.filter(d => d.required).length}
              </div>
              <p className="text-sm text-blue-700">Documentos Requeridos</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(uploadedDocuments).length}/{documentTypes.length}
              </div>
              <p className="text-sm text-purple-700">Total Subidos</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-emerald-200">
            <div className="flex items-start">
              <TrendingUp className="w-5 h-5 text-emerald-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-emerald-800">¿Por qué subir documentos?</h4>
                <ul className="text-sm text-emerald-700 mt-2 space-y-1">
                  <li>• Accede a tasas de interés más bajas</li>
                  <li>• Recibe ofertas personalizadas y mejoradas</li>
                  <li>• Aumenta tus posibilidades de aprobación</li>
                  <li>• Los bancos pueden ofrecer montos más altos</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de documentos */}
      <div className="space-y-4">
        {documentTypes.map((docType) => (
          <div key={docType.type} className="relative">
            <div className="absolute top-4 right-4 z-10">
              <Badge className={getImpactColor(docType.impact)}>
                Impacto: {docType.impact}
              </Badge>
            </div>
            
            <DocumentUpload
              title={docType.title}
              description={docType.description}
              required={docType.required}
              documentType={docType.type}
              status={getDocumentStatus(docType.type)}
              onUpload={(file, analysis, fileId) => handleDocumentUpload(docType.type, file, analysis, fileId)}
            />
          </div>
        ))}
      </div>

      {/* Resumen y acciones */}
      {Object.keys(uploadedDocuments).length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-800">Estado de tus documentos</h3>
                <p className="text-sm text-blue-600">
                  Has subido {Object.keys(uploadedDocuments).length} de {documentTypes.length} documentos
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Actualizar Ofertas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
