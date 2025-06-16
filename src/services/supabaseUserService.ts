
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/user";

export interface AdminUser {
  id: string;
  full_name: string;
  dni: string;
  email: string;
  phone: string;
  birth_date?: string;
  monthly_income?: number;
  requested_amount?: number;
  product_type: string;
  employment_type?: string;
  work_details?: string;
  process_status: string;
  current_step: string;
  registration_date: string;
  last_update: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_id: string;
  start_time: string;
  end_time?: string;
  duration_ms?: number;
  device_type?: string;
  user_agent?: string;
  entry_method?: string;
  entry_reason?: string;
  current_request?: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  session_id: string;
  activity_type: string;
  description: string;
  product_type?: string;
  document_type?: string;
  activity_data?: any;
  timestamp: string;
}

export interface UploadedDocument {
  id: string;
  user_id: string;
  document_type: string;
  file_name: string;
  file_size?: number;
  upload_date: string;
  file_path?: string;
}

class SupabaseUserService {
  // Migrar datos desde localStorage
  async migrateFromLocalStorage(): Promise<{ success: boolean; message: string }> {
    try {
      const localStorageUsers = localStorage.getItem('nezaAdminUsers');
      if (!localStorageUsers) {
        return { success: false, message: 'No hay datos en localStorage para migrar' };
      }

      const users = JSON.parse(localStorageUsers);
      
      // Llamar a la función de migración en Supabase
      const { data, error } = await supabase.rpc('migrate_localStorage_data', {
        data: users
      });

      if (error) {
        console.error('Error en migración:', error);
        return { success: false, message: `Error en migración: ${error.message}` };
      }

      return { success: true, message: data || 'Migración completada exitosamente' };
    } catch (error) {
      console.error('Error migrando datos:', error);
      return { success: false, message: 'Error inesperado durante la migración' };
    }
  }

  // Obtener todos los usuarios
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('registration_date', { ascending: false });

      if (error) {
        console.error('Error obteniendo usuarios:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // Crear nuevo usuario
  async createUser(userData: Partial<AdminUser>): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: 'Error inesperado creando usuario' };
    }
  }

  // Actualizar usuario
  async updateUser(id: string, updates: Partial<AdminUser>): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .update({ ...updates, last_update: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: 'Error inesperado actualizando usuario' };
    }
  }

  // Eliminar usuario
  async deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error inesperado eliminando usuario' };
    }
  }

  // Obtener usuario por email
  async getUserByEmail(email: string): Promise<AdminUser | null> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error obteniendo usuario por email:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  // Buscar usuarios
  async searchUsers(searchTerm: string): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,dni.ilike.%${searchTerm}%`)
        .order('registration_date', { ascending: false });

      if (error) {
        console.error('Error en búsqueda:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // Obtener estadísticas
  async getStatistics(): Promise<{
    totalUsers: number;
    activeApplications: number;
    completedApplications: number;
    byProductType: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    try {
      const { data: users, error } = await supabase
        .from('admin_users')
        .select('product_type, process_status');

      if (error) {
        console.error('Error obteniendo estadísticas:', error);
        return {
          totalUsers: 0,
          activeApplications: 0,
          completedApplications: 0,
          byProductType: {},
          byStatus: {}
        };
      }

      const totalUsers = users.length;
      const activeApplications = users.filter(u => 
        u.process_status === 'En proceso' || u.process_status === 'Completó formulario'
      ).length;
      const completedApplications = users.filter(u => 
        u.process_status === 'Aprobado' || u.process_status === 'Completado'
      ).length;

      const byProductType = users.reduce((acc, user) => {
        acc[user.product_type] = (acc[user.product_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byStatus = users.reduce((acc, user) => {
        acc[user.process_status] = (acc[user.process_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalUsers,
        activeApplications,
        completedApplications,
        byProductType,
        byStatus
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        totalUsers: 0,
        activeApplications: 0,
        completedApplications: 0,
        byProductType: {},
        byStatus: {}
      };
    }
  }

  // Registrar actividad de usuario
  async logActivity(activity: Omit<UserActivity, 'id' | 'timestamp'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_activities')
        .insert([activity]);

      if (error) {
        console.error('Error registrando actividad:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }

  // Obtener actividades de un usuario
  async getUserActivities(userId: string): Promise<UserActivity[]> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error obteniendo actividades:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  // Exportar datos a CSV
  async exportToCSV(): Promise<string> {
    try {
      const users = await this.getAllUsers();
      
      const headers = [
        'ID', 'Nombre Completo', 'DNI', 'Email', 'Teléfono', 'Fecha Nacimiento',
        'Ingresos Mensuales', 'Monto Solicitado', 'Tipo Producto', 'Tipo Empleo',
        'Estado Proceso', 'Paso Actual', 'Fecha Registro', 'Última Actualización'
      ];

      const csvContent = [
        headers.join(','),
        ...users.map(user => [
          user.id,
          `"${user.full_name}"`,
          user.dni,
          user.email,
          user.phone,
          user.birth_date || '',
          user.monthly_income || '',
          user.requested_amount || '',
          `"${user.product_type}"`,
          `"${user.employment_type || ''}"`,
          `"${user.process_status}"`,
          `"${user.current_step}"`,
          user.registration_date,
          user.last_update
        ].join(','))
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error exportando a CSV:', error);
      return '';
    }
  }
}

export const supabaseUserService = new SupabaseUserService();
