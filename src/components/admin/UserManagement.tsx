import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, User, FileText, Calendar, Phone, CreditCard, Briefcase, Clock, Activity, ChevronDown, ChevronUp } from "lucide-react";
import { userTrackingService } from "@/services/userTracking";

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

interface SessionHistory {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  productRequested?: string;
  dataChanges: any[];
  activities: any[];
}

export const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [expandedHistories, setExpandedHistories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const adminUsers = JSON.parse(localStorage.getItem('nezaAdminUsers') || '[]');
    setUsers(adminUsers);
  };

  const getUserSessionHistory = (userEmail: string): SessionHistory[] => {
    const userHistory = userTrackingService.getUserHistory(userEmail);
    
    // Group activities and events by session
    const sessionMap = new Map<string, SessionHistory>();
    
    userHistory.sessions.forEach(session => {
      sessionMap.set(session.sessionId, {
        sessionId: session.sessionId,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
        duration: session.duration,
        productRequested: session.currentRequest,
        dataChanges: [],
        activities: []
      });
    });

    // Add activities to sessions
    userHistory.activities.forEach(activity => {
      const session = sessionMap.get(activity.sessionId);
      if (session) {
        session.activities.push(activity);
        if (activity.activityType === 'form_submit' && activity.productType) {
          session.productRequested = activity.productType;
        }
      }
    });

    // Add events (data changes) to sessions
    userHistory.events.forEach(event => {
      const session = sessionMap.get(event.sessionId);
      if (session && event.eventType === 'form_update') {
        session.dataChanges.push(event);
      }
    });

    return Array.from(sessionMap.values()).sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  };

  const toggleHistoryExpansion = (userId: string) => {
    const newExpanded = new Set(expandedHistories);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedHistories(newExpanded);
  };

  const formatSessionTime = (startTime: Date, endTime?: Date) => {
    const start = startTime.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    if (endTime) {
      const end = endTime.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      return `${start} a ${end}`;
    }
    
    return `${start} (activa)`;
  };

  const formatSessionDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.dni.includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedUser) {
    const sessionHistory = getUserSessionHistory(selectedUser.email);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedUser(null)}
            className="border-neza-blue-300 text-neza-blue-600"
          >
            ← Volver a la lista
          </Button>
          <h2 className="text-2xl font-bold text-neza-blue-800">Detalle del Usuario</h2>
        </div>

        <Card className="border-neza-blue-200">
          <CardHeader className="bg-neza-blue-50">
            <CardTitle className="text-neza-blue-800 flex items-center gap-2">
              <User className="w-5 h-5" />
              {selectedUser.fullName}
            </CardTitle>
            <CardDescription>
              Registrado el {new Date(selectedUser.registrationDate).toLocaleDateString('es-ES')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-neza-blue-800">Información Personal</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600">DNI:</span>
                    <span className="font-medium">{selectedUser.dni}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600">Email:</span>
                    <span className="font-medium">{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600">Teléfono:</span>
                    <span className="font-medium">{selectedUser.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600">Fecha de nacimiento:</span>
                    <span className="font-medium">{selectedUser.birthDate || 'No proporcionada'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-neza-blue-800">Información Financiera</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600">Ingresos mensuales:</span>
                    <span className="font-medium">S/ {selectedUser.monthlyIncome?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600">Monto solicitado:</span>
                    <span className="font-medium">S/ {selectedUser.requestedAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600">Producto:</span>
                    <Badge className="bg-neza-blue-100 text-neza-blue-800">{selectedUser.productType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neza-blue-600">Tipo de empleo:</span>
                    <span className="font-medium capitalize">{selectedUser.employmentType}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-neza-blue-800">Archivos Subidos</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-gray-200">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium">DNI</p>
                    <p className="text-xs text-gray-600">
                      {selectedUser.documents.dni || 'No subido'}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium">Boletas de pago</p>
                    <p className="text-xs text-gray-600">
                      {selectedUser.documents.payslips || 'No subido'}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm font-medium">Otros documentos</p>
                    <p className="text-xs text-gray-600">
                      {selectedUser.documents.others || 'No subido'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-neza-blue-800">Estado del Proceso</h3>
              <div className="flex items-center justify-between p-4 bg-neza-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-neza-blue-800">{selectedUser.processStatus}</p>
                  <p className="text-sm text-neza-blue-600">{selectedUser.currentStep}</p>
                </div>
                <Badge variant="outline" className="border-neza-blue-300 text-neza-blue-600">
                  Activo
                </Badge>
              </div>
            </div>

            {/* Nueva sección de historial de conexiones */}
            <div className="space-y-4">
              <h3 className="font-semibold text-neza-blue-800 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Historial de Conexiones
              </h3>
              {sessionHistory.length > 0 ? (
                <div className="space-y-3">
                  {sessionHistory.map((session, index) => (
                    <Card key={session.sessionId} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">
                              {formatSessionDate(session.startTime)}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Sesión {index + 1}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Horario:</strong> {formatSessionTime(session.startTime, session.endTime)}
                        </div>
                        
                        {session.productRequested && (
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Producto solicitado:</strong> 
                            <Badge className="ml-2 bg-neza-blue-100 text-neza-blue-800 text-xs">
                              {session.productRequested}
                            </Badge>
                          </div>
                        )}
                        
                        {session.duration && (
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Duración:</strong> {Math.round(session.duration / 60000)} minutos
                          </div>
                        )}
                        
                        {(session.activities.length > 0 || session.dataChanges.length > 0) && (
                          <div className="mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleHistoryExpansion(session.sessionId)}
                              className="text-xs h-6 px-2"
                            >
                              {expandedHistories.has(session.sessionId) ? (
                                <>
                                  <ChevronUp className="w-3 h-3 mr-1" />
                                  Ocultar detalles
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3 mr-1" />
                                  Ver detalles ({session.activities.length + session.dataChanges.length})
                                </>
                              )}
                            </Button>
                            
                            {expandedHistories.has(session.sessionId) && (
                              <div className="mt-2 pl-4 border-l-2 border-gray-200 space-y-2">
                                {session.activities.map((activity, actIndex) => (
                                  <div key={actIndex} className="text-xs text-gray-500">
                                    <span className="font-medium">
                                      {new Date(activity.timestamp).toLocaleTimeString('es-ES')}:
                                    </span> {activity.description}
                                  </div>
                                ))}
                                
                                {session.dataChanges.map((change, changeIndex) => (
                                  <div key={changeIndex} className="text-xs text-orange-600">
                                    <span className="font-medium">
                                      {new Date(change.timestamp).toLocaleTimeString('es-ES')}:
                                    </span> {change.description}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600 text-sm">No hay historial de conexiones disponible</p>
                </div>
              )}
            </div>

            {selectedUser.workDetails && (
              <div className="space-y-4">
                <h3 className="font-semibold text-neza-blue-800">Detalles Laborales</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
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
        <h2 className="text-2xl font-bold text-neza-blue-800">Gestión de Usuarios</h2>
        <Button 
          onClick={loadUsers} 
          variant="outline"
          className="border-neza-blue-300 text-neza-blue-600"
        >
          Actualizar
        </Button>
      </div>

      <Card className="border-neza-blue-200">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, DNI o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map((user) => {
                const sessionHistory = getUserSessionHistory(user.email);
                const lastSession = sessionHistory[0];
                
                return (
                  <Card 
                    key={user.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer border-gray-200"
                    onClick={() => setSelectedUser(user)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-neza-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-neza-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-neza-blue-800">{user.fullName}</h3>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">DNI:</span>
                                <span className="font-medium">{user.dni}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Teléfono:</span>
                                <span className="font-medium">{user.phone}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Producto:</span>
                                <Badge className="bg-neza-blue-100 text-neza-blue-800 text-xs">
                                  {user.productType}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">Registro:</span>
                                <span className="font-medium">
                                  {new Date(user.registrationDate).toLocaleDateString('es-ES')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4 text-right">
                          <Badge variant="outline" className="border-green-300 text-green-600 mb-2">
                            {user.processStatus}
                          </Badge>
                          <p className="text-xs text-gray-500">{user.currentStep}</p>
                        </div>
                      </div>
                      
                      {/* Nueva sección de historial de conexión en tarjeta */}
                      {lastSession && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Activity className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">Última conexión:</span>
                          </div>
                          <div className="space-y-1 text-xs text-gray-500">
                            <div>
                              <span className="font-medium">Fecha:</span> {formatSessionDate(lastSession.startTime)}
                            </div>
                            <div>
                              <span className="font-medium">Horario:</span> {formatSessionTime(lastSession.startTime, lastSession.endTime)}
                            </div>
                            {lastSession.productRequested && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Producto:</span>
                                <Badge className="bg-gray-100 text-gray-700 text-xs">
                                  {lastSession.productRequested}
                                </Badge>
                              </div>
                            )}
                            <div className="text-blue-600">
                              Total de sesiones: {sessionHistory.length}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
