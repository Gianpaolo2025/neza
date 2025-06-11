
import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface DocumentsStepProps {
  documents: {
    dni: File | null;
    payslips: File | null;
    others: File | null;
  };
  onFileUpload: (file: File, type: 'dni' | 'payslips' | 'others') => void;
}

export const DocumentsStep = ({ documents, onFileUpload }: DocumentsStepProps) => {
  const documentTypes = [
    { type: 'dni', label: 'DNI', icon: '🆔', required: false },
    { type: 'payslips', label: 'Boletas de pago', icon: '💰', required: false },
    { type: 'others', label: 'Otros documentos', icon: '📄', required: false }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">📁 Sube tus documentos</h3>
        <p className="text-slate-600">Estos documentos nos ayudarán a encontrar las mejores ofertas para ti</p>
      </div>

      {/* MENSAJE OBLIGATORIO DE DOCUMENTOS */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-amber-800">
          <AlertCircle className="w-5 h-5" />
          <p className="font-medium">
            Recuerda que más adelante deberás subir tus documentos para poder acceder a un producto financiero.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {documentTypes.map((doc) => (
          <div key={doc.type} className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            <div className="text-4xl mb-3">{doc.icon}</div>
            <h4 className="font-semibold text-slate-800 mb-2">{doc.label}</h4>
            <Badge variant="outline" className="mb-3">Opcional</Badge>
            
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onFileUpload(file, doc.type as 'dni' | 'payslips' | 'others');
                }
              }}
              className="mb-3"
            />
            
            {documents[doc.type as 'dni' | 'payslips' | 'others'] && (
              <div className="text-sm text-green-600 font-medium">
                ✅ {documents[doc.type as 'dni' | 'payslips' | 'others']?.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
