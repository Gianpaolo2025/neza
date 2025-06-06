
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface BankRequirement {
  id: string;
  bankName: string;
  requirements: string[];
  status: "pending" | "submitted" | "approved" | "rejected";
  deadline: string;
  notes?: string;
}

interface BankRequirementsUploadProps {
  onBack: () => void;
  bankOffers: any[];
}

export const BankRequirementsUpload = ({ onBack, bankOffers }: BankRequirementsUploadProps) => {
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({});
  const [additionalInfo, setAdditionalInfo] = useState<{ [key: string]: string }>({});
  const [submissionStatus, setSubmissionStatus] = useState<{ [key: string]: string }>({});

  // Simular requerimientos específicos por banco
  const bankRequirements: BankRequirement[] = bankOffers.map(offer => ({
    id: offer.id,
    bankName: offer.bankName,
    requirements: offer.requirements || [
      "DNI vigente (ambas caras)",
      "Últimas 3 boletas de pago",
      "Certificado de trabajo",
      "Estado de cuenta últimos 3 meses"
    ],
    status: "pending",
    deadline: "15 días hábiles",
    notes: "Documentos en PDF de máximo 5MB cada uno"
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "submitted": return <Upload className="w-4 h-4 text-blue-500" />;
      case "approved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected": return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "submitted": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleFileUpload = (bankId: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => ({
        ...prev,
        [bankId]: [...(prev[bankId] || []), ...fileArray]
      }));
    }
  };

  const handleSubmitToBank = (bankId: string) => {
    setSubmissionStatus(prev => ({
      ...prev,
      [bankId]: "submitted"
    }));
    
    // Simular proceso de envío
    setTimeout(() => {
      setSubmissionStatus(prev => ({
        ...prev,
        [bankId]: Math.random() > 0.3 ? "approved" : "pending"
      }));
    }, 2000);
  };

  const removeFile = (bankId: string, fileIndex: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [bankId]: prev[bankId]?.filter((_, index) => index !== fileIndex) || []
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver a ofertas
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Envío de Documentos</h1>
            <p className="text-gray-600">Completa los requisitos de cada banco</p>
          </div>
          
          <div className="w-24" />
        </div>

        <div className="max-w-6xl mx-auto">
          {!selectedBank ? (
            /* Vista general de bancos */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bankRequirements.map((bank) => {
                const currentStatus = submissionStatus[bank.id] || bank.status;
                const filesCount = uploadedFiles[bank.id]?.length || 0;
                const totalRequirements = bank.requirements.length;
                const progress = filesCount > 0 ? (filesCount / totalRequirements) * 100 : 0;
                
                return (
                  <motion.div
                    key={bank.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card 
                      className="cursor-pointer transition-all hover:shadow-lg"
                      onClick={() => setSelectedBank(bank.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{bank.bankName}</CardTitle>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(currentStatus)}
                            <Badge className={getStatusColor(currentStatus)}>
                              {currentStatus === "pending" ? "Pendiente" :
                               currentStatus === "submitted" ? "Enviado" :
                               currentStatus === "approved" ? "Aprobado" : "Rechazado"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Documentos subidos:</span>
                            <span className="font-medium">{filesCount}/{totalRequirements}</span>
                          </div>
                          
                          {progress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500">
                            Plazo: {bank.deadline}
                          </div>
                          
                          <Button 
                            className="w-full" 
                            variant={currentStatus === "approved" ? "default" : "outline"}
                            disabled={currentStatus === "submitted"}
                          >
                            {currentStatus === "approved" ? "✓ Completado" :
                             currentStatus === "submitted" ? "Procesando..." : "Subir documentos"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Vista detallada del banco seleccionado */
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {(() => {
                  const bank = bankRequirements.find(b => b.id === selectedBank)!;
                  const currentStatus = submissionStatus[bank.id] || bank.status;
                  const bankFiles = uploadedFiles[bank.id] || [];
                  
                  return (
                    <div className="space-y-6">
                      {/* Header del banco */}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <Button 
                                variant="ghost" 
                                onClick={() => setSelectedBank('')}
                                className="mb-2"
                              >
                                ← Volver a lista de bancos
                              </Button>
                              <CardTitle className="text-2xl">{bank.bankName}</CardTitle>
                              <p className="text-gray-600">Requisitos para tu solicitud de crédito</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-2">
                                {getStatusIcon(currentStatus)}
                                <Badge className={getStatusColor(currentStatus)}>
                                  {currentStatus === "pending" ? "Pendiente" :
                                   currentStatus === "submitted" ? "Enviado" :
                                   currentStatus === "approved" ? "Aprobado" : "Rechazado"}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500">
                                Plazo: {bank.deadline}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>

                      {/* Lista de requisitos */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Documentos requeridos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {bank.requirements.map((req, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <span className="font-medium">{req}</span>
                                <Badge variant="outline">
                                  {bankFiles.length > index ? "✓ Subido" : "Pendiente"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Subida de archivos */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Subir documentos</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor={`files-${bank.id}`}>
                              Seleccionar archivos (PDF, JPG, PNG - máx. 5MB c/u)
                            </Label>
                            <Input
                              id={`files-${bank.id}`}
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileUpload(bank.id, e.target.files)}
                              className="mt-2"
                            />
                          </div>

                          {/* Archivos subidos */}
                          {bankFiles.length > 0 && (
                            <div>
                              <Label>Archivos subidos:</Label>
                              <div className="mt-2 space-y-2">
                                {bankFiles.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span className="text-sm">{file.name}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeFile(bank.id, index)}
                                    >
                                      Eliminar
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Información adicional */}
                          <div>
                            <Label htmlFor={`additional-${bank.id}`}>
                              Información adicional (opcional)
                            </Label>
                            <Textarea
                              id={`additional-${bank.id}`}
                              placeholder="Comentarios adicionales para el banco..."
                              value={additionalInfo[bank.id] || ''}
                              onChange={(e) => setAdditionalInfo(prev => ({
                                ...prev,
                                [bank.id]: e.target.value
                              }))}
                              className="mt-2"
                            />
                          </div>

                          {/* Notas del banco */}
                          {bank.notes && (
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-blue-800">Notas importantes:</p>
                                  <p className="text-sm text-blue-700">{bank.notes}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Botón de envío */}
                          <Button
                            onClick={() => handleSubmitToBank(bank.id)}
                            disabled={bankFiles.length === 0 || currentStatus === "submitted"}
                            className="w-full"
                            size="lg"
                          >
                            {currentStatus === "submitted" ? (
                              "Procesando..."
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Enviar documentos a {bank.bankName}
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};
