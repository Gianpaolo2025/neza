
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Download, Users, Eye, Edit, Trash2, Plus, 
  Filter, MoreHorizontal, Calendar, Mail, Phone 
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabaseUserService, AdminUser } from "@/services/supabaseUserService";
import { DatabaseMigration } from "./DatabaseMigration";

export const EnhancedUserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showMigration, setShowMigration] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await supabaseUserService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      const searchResults = await supabaseUserService.searchUsers(searchTerm);
      setUsers(searchResults);
      setLoading(false);
    } else {
      loadUsers();
    }
  };

  const handleExportCSV = async () => {
    const csvContent = await supabaseUserService.exportToCSV();
    if (csvContent) {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `usuarios_neza_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      const result = await supabaseUserService.deleteUser(userId);
      if (result.success) {
        await loadUsers();
      } else {
        alert(`Error eliminando usuario: ${result.error}`);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'Nuevo': 'bg-blue-100 text-blue-800',
      'En proceso': 'bg-yellow-100 text-yellow-800',
      'Completó formulario': 'bg-orange-100 text-orange-800',
      'Aprobado': 'bg-green-100 text-green-800',
      'Rechazado': 'bg-red-100 text-red-800',
      'Completado': 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  if (showMigration) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neza-blue-800">Migración de Base de Datos</h2>
          <Button
            onClick={() => setShowMigration(false)}
            variant="outline"
            className="border-neza-blue-300 text-neza-blue-600"
          >
            Volver a Gestión
          </Button>
        </div>
        <DatabaseMigration />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neza-blue-800">Gestión de Usuarios</h2>
          <p className="text-neza-blue-600">Sistema integrado con base de datos Supabase</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowMigration(true)}
            variant="outline"
            className="border-neza-blue-300 text-neza-blue-600"
          >
            Migrar Datos
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-neza-blue-300 text-neza-blue-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-neza-blue-200 bg-white/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-neza-blue-600" />
              <span className="text-sm text-neza-blue-700">Total Usuarios</span>
            </div>
            <div className="text-2xl font-bold text-neza-blue-800 mt-2">
              {users.length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-neza-blue-200 bg-white/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-700">En Proceso</span>
            </div>
            <div className="text-2xl font-bold text-orange-800 mt-2">
              {users.filter(u => u.process_status === 'En proceso').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-neza-blue-200 bg-white/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">Completados</span>
            </div>
            <div className="text-2xl font-bold text-green-800 mt-2">
              {users.filter(u => u.process_status === 'Completado' || u.process_status === 'Aprobado').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-neza-blue-200 bg-white/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">Nuevos</span>
            </div>
            <div className="text-2xl font-bold text-blue-800 mt-2">
              {users.filter(u => u.process_status === 'Nuevo').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="border-neza-blue-200 bg-white/60">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, email o DNI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="bg-neza-blue-600 hover:bg-neza-blue-700">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            <Button onClick={loadUsers} variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Todos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card className="border-neza-blue-200 bg-white/60">
        <CardHeader>
          <CardTitle className="text-neza-blue-800">Lista de Usuarios</CardTitle>
          <CardDescription>
            Gestión completa de usuarios registrados en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-neza-blue-600">Cargando usuarios...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron usuarios
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-gray-500">DNI: {user.dni}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.product_type}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.process_status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(user.registration_date).toLocaleDateString('es-ES')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles del usuario */}
      {selectedUser && (
        <Card className="border-neza-blue-200 bg-white/60">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Detalles del Usuario</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedUser(null)}
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-neza-blue-800 mb-2">Información Personal</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Nombre:</strong> {selectedUser.full_name}</div>
                  <div><strong>DNI:</strong> {selectedUser.dni}</div>
                  <div><strong>Email:</strong> {selectedUser.email}</div>
                  <div><strong>Teléfono:</strong> {selectedUser.phone}</div>
                  {selectedUser.birth_date && (
                    <div><strong>Fecha de Nacimiento:</strong> {selectedUser.birth_date}</div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-neza-blue-800 mb-2">Información Financiera</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Producto:</strong> {selectedUser.product_type}</div>
                  {selectedUser.monthly_income && (
                    <div><strong>Ingresos Mensuales:</strong> S/ {selectedUser.monthly_income.toLocaleString()}</div>
                  )}
                  {selectedUser.requested_amount && (
                    <div><strong>Monto Solicitado:</strong> S/ {selectedUser.requested_amount.toLocaleString()}</div>
                  )}
                  <div><strong>Estado:</strong> {getStatusBadge(selectedUser.process_status)}</div>
                  <div><strong>Paso Actual:</strong> {selectedUser.current_step}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
