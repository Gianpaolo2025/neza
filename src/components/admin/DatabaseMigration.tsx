
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Database, Upload, CheckCircle, AlertCircle, Users, RefreshCw } from "lucide-react";
import { supabaseUserService } from "@/services/supabaseUserService";

export const DatabaseMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [migrationMessage, setMigrationMessage] = useState('');
  const [localStorageCount, setLocalStorageCount] = useState(0);

  // Verificar datos en localStorage al cargar
  useState(() => {
    const localUsers = localStorage.getItem('nezaAdminUsers');
    if (localUsers) {
      try {
        const users = JSON.parse(localUsers);
        setLocalStorageCount(Array.isArray(users) ? users.length : 0);
      } catch {
        setLocalStorageCount(0);
      }
    }
  });

  const handleMigration = async () => {
    setMigrationStatus('migrating');
    setMigrationMessage('Iniciando migración de datos...');

    try {
      const result = await supabaseUserService.migrateFromLocalStorage();
      
      if (result.success) {
        setMigrationStatus('success');
        setMigrationMessage(result.message);
      } else {
        setMigrationStatus('error');
        setMigrationMessage(result.message);
      }
    } catch (error) {
      setMigrationStatus('error');
      setMigrationMessage('Error inesperado durante la migración');
    }
  };

  const resetMigration = () => {
    setMigrationStatus('idle');
    setMigrationMessage('');
  };

  return (
    <div className="space-y-6">
      <Card className="border-neza-blue-200 bg-white/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neza-blue-800">
            <Database className="w-5 h-5" />
            Migración de Base de Datos
          </CardTitle>
          <CardDescription>
            Migra los datos de usuarios desde localStorage a la base de datos Supabase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Estado actual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-neza-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-neza-blue-600" />
                <span className="text-sm text-neza-blue-700">Datos en localStorage:</span>
              </div>
              <Badge variant="outline" className="bg-white">
                {localStorageCount} usuarios
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Base de datos:</span>
              </div>
              <Badge variant="outline" className="bg-white">
                Configurada
              </Badge>
            </div>
          </div>

          {/* Mensajes de estado */}
          {migrationMessage && (
            <Alert className={
              migrationStatus === 'success' ? 'border-green-200 bg-green-50' :
              migrationStatus === 'error' ? 'border-red-200 bg-red-50' :
              'border-neza-blue-200 bg-neza-blue-50'
            }>
              {migrationStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
              {migrationStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
              {migrationStatus === 'migrating' && <RefreshCw className="w-4 h-4 text-neza-blue-600 animate-spin" />}
              <AlertDescription className={
                migrationStatus === 'success' ? 'text-green-700' :
                migrationStatus === 'error' ? 'text-red-700' :
                'text-neza-blue-700'
              }>
                {migrationMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3">
            {migrationStatus === 'idle' && localStorageCount > 0 && (
              <Button
                onClick={handleMigration}
                className="bg-neza-blue-600 hover:bg-neza-blue-700 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Migrar Datos a Supabase
              </Button>
            )}

            {migrationStatus === 'success' && (
              <Button
                onClick={resetMigration}
                variant="outline"
                className="border-neza-blue-300 text-neza-blue-600 hover:bg-neza-blue-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Nueva Migración
              </Button>
            )}

            {migrationStatus === 'error' && (
              <Button
                onClick={resetMigration}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            )}
          </div>

          {localStorageCount === 0 && migrationStatus === 'idle' && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                No se encontraron datos en localStorage para migrar.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
