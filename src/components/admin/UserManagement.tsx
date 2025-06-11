
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, User, FileText, Calendar, Phone, CreditCard, Briefcase } from "lucide-react";

interface AdminUser {
  id: string;
  fullName: string;
  dni: string;
  email: string;
  birthDate: string;
  phone: string;
  monthlyIncome: number;
  requestedAmount: number;
  productType: string;
  employmentType: string;
  workDetails: string;
  documents: {
    dni: string | null;
    payslips: string | null;
    others: string | null;
  };
  processStatus: string;
  currentStep: string;
  registrationDate: string;
  lastUpdate: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const adminUsers = JSON.parse(localStorage.getItem('nezaAdminUsers') || '[]');
    setUsers(adminUsers);
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.dni.includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedUser(null)}
            className="border-neza-blue-300 text-neza-blue-600 md:h-10 md:px-4 md:text-sm h-8 px-3 text-xs"
          >
            ← Volver a la lista
          </Button>
          <h2 className="md:text-2xl text-xl font-bold text-neza-blue-800">Detalle del Usuario</h2>
        </div>

        <Card className="border-neza-blue-200">
          <CardHeader className="bg-neza-blue-50">
            <CardTitle className="text-neza-blue-800 flex items-center gap-2 md:text-xl text-lg">
              <User className="md:w-5 md:h-5 w-4 h-4" />
              {selectedUser.fullName}
            </CardTitle>
            <CardDescription className="md:text-base text-sm">
              Registrado el {new Date(selectedUser.registrationDate).toLocaleDateString('es-ES')}
            </CardDescription>
          </CardHeader>
          <CardContent className="md:p-6 p-4 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-neza-blue-800 md:text-base text-sm">Información Personal</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600 md:text-sm text-xs">DNI:</span>
                    <span className="font-medium md:text-sm text-xs">{selectedUser.dni}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600 md:text-sm text-xs">Email:</span>
                    <span className="font-medium md:text-sm text-xs break-all">{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600 md:text-sm text-xs">Teléfono:</span>
                    <span className="font-medium md:text-sm text-xs">{selectedUser.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600 md:text-sm text-xs">Fecha de nacimiento:</span>
                    <span className="font-medium md:text-sm text-xs">{selectedUser.birthDate || 'No proporcionada'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-neza-blue-800 md:text-base text-sm">Información Financiera</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600 md:text-sm text-xs">Ingresos mensuales:</span>
                    <span className="font-medium md:text-sm text-xs">S/ {selectedUser.monthlyIncome?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600 md:text-sm text-xs">Monto solicitado:</span>
                    <span className="font-medium md:text-sm text-xs">S/ {selectedUser.requestedAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neza-blue-600 md:text-sm text-xs">Producto:</span>
                    <Badge className="bg-neza-blue-100 text-neza-blue-800 md:text-xs text-[10px]">{selectedUser.productType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600 md:text-sm text-xs">Tipo de empleo:</span>
                    <span className="font-medium capitalize md:text-sm text-xs">{selectedUser.employmentType}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-neza-blue-800 md:text-base text-sm">Archivos Subidos</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-gray-200">
                  <CardContent className="md:p-4 p-3 text-center">
                    <FileText className="md:w-8 md:h-8 w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="md:text-sm text-xs font-medium">DNI</p>
                    <p className="text-xs text-gray-600">
                      {selectedUser.documents.dni || 'No subido'}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="md:p-4 p-3 text-center">
                    <FileText className="md:w-8 md:h-8 w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="md:text-sm text-xs font-medium">Boletas de pago</p>
                    <p className="text-xs text-gray-600">
                      {selectedUser.documents.payslips || 'No subido'}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="md:p-4 p-3 text-center">
                    <FileText className="md:w-8 md:h-8 w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="md:text-sm text-xs font-medium">Otros documentos</p>
                    <p className="text-xs text-gray-600">
                      {selectedUser.documents.others || 'No subido'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-neza-blue-800 md:text-base text-sm">Estado del Proceso</h3>
              <div className="flex items-center justify-between md:p-4 p-3 bg-neza-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-neza-blue-800 md:text-base text-sm">{selectedUser.processStatus}</p>
                  <p className="md:text-sm text-xs text-neza-blue-600">{selectedUser.currentStep}</p>
                </div>
                <Badge variant="outline" className="border-neza-blue-300 text-neza-blue-600 md:text-xs text-[10px]">
                  Activo
                </Badge>
              </div>
            </div>

            {selectedUser.workDetails && (
              <div className="space-y-4">
                <h3 className="font-semibold text-neza-blue-800 md:text-base text-sm">Detalles Laborales</h3>
                <p className="md:text-sm text-xs text-gray-700 bg-gray-50 md:p-3 p-2 rounded-lg">
                  {selectedUser.workDetails}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="md:text-2xl text-xl font-bold text-neza-blue-800">Gestión de Usuarios</h2>
        <Button 
          onClick={loadUsers} 
          variant="outline"
          className="border-neza-blue-300 text-neza-blue-600 md:h-10 md:px-4 md:text-sm h-8 px-3 text-xs"
        >
          Actualizar
        </Button>
      </div>

      <Card className="border-neza-blue-200">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 md:w-4 md:h-4 w-3 h-3" />
            <Input
              placeholder="Buscar por nombre, DNI o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:pl-10 pl-8 md:h-10 h-9 md:text-base text-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <User className="md:w-12 md:h-12 w-10 h-10 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 md:text-base text-sm">
                {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user) => (
                <Card 
                  key={user.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer border-gray-200"
                  onClick={() => setSelectedUser(user)}
                >
                  <CardContent className="md:p-4 p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="md:w-10 md:h-10 w-8 h-8 bg-neza-blue-100 rounded-full flex items-center justify-center">
                            <User className="md:w-5 md:h-5 w-4 h-4 text-neza-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neza-blue-800 md:text-base text-sm">{user.fullName}</h3>
                            <p className="md:text-sm text-xs text-gray-600 break-all">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 md:text-sm text-xs">
                              <CreditCard className="md:w-4 md:h-4 w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">DNI:</span>
                              <span className="font-medium">{user.dni}</span>
                            </div>
                            <div className="flex items-center gap-2 md:text-sm text-xs">
                              <Phone className="md:w-4 md:h-4 w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">Teléfono:</span>
                              <span className="font-medium">{user.phone}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 md:text-sm text-xs">
                              <Briefcase className="md:w-4 md:h-4 w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">Producto:</span>
                              <Badge className="bg-neza-blue-100 text-neza-blue-800 md:text-xs text-[10px]">
                                {user.productType}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 md:text-sm text-xs">
                              <Calendar className="md:w-4 md:h-4 w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">Registro:</span>
                              <span className="font-medium">
                                {new Date(user.registrationDate).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 text-right">
                        <Badge variant="outline" className="border-green-300 text-green-600 mb-2 md:text-xs text-[10px]">
                          {user.processStatus}
                        </Badge>
                        <p className="text-xs text-gray-500">{user.currentStep}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
