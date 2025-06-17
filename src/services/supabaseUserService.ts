
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type AdminUser = Database['public']['Tables']['admin_users']['Row'];
type UserActivity = Database['public']['Tables']['user_activities']['Row'];
type UserSession = Database['public']['Tables']['user_sessions']['Row'];

export interface UserRegistrationData {
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  birthDate?: string;
  monthlyIncome?: number;
  requestedAmount?: number;
  productType: string;
  employmentType?: string;
  workDetails?: string;
  processStatus?: string;
  currentStep?: string;
}

export interface UserActivityData {
  userId: string;
  activityType: string;
  description: string;
  productType?: string;
  documentType?: string;
  sessionId?: string;
  activityData?: any;
}

export interface UserSessionData {
  sessionId: string;
  userId: string;
  deviceType?: string;
  userAgent?: string;
  entryMethod?: string;
  entryReason?: string;
  currentRequest?: string;
}

export const supabaseUserService = {
  async createUser(userData: UserRegistrationData): Promise<{ data: AdminUser | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          full_name: userData.fullName,
          dni: userData.dni,
          email: userData.email,
          phone: userData.phone,
          birth_date: userData.birthDate || null,
          monthly_income: userData.monthlyIncome || null,
          requested_amount: userData.requestedAmount || null,
          product_type: userData.productType,
          employment_type: userData.employmentType || null,
          work_details: userData.workDetails || null,
          process_status: userData.processStatus || 'En proceso',
          current_step: userData.currentStep || 'personal_data',
          registration_date: new Date().toISOString(),
          last_update: new Date().toISOString()
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating user:', error);
      return { data: null, error };
    }
  },

  async getAllUsers(): Promise<{ data: AdminUser[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('registration_date', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { data: null, error };
    }
  },

  async bulkCreateUsers(usersData: Database['public']['Tables']['admin_users']['Insert'][]): Promise<{ data: AdminUser[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert(usersData)
        .select();

      return { data, error };
    } catch (error) {
      console.error('Error bulk creating users:', error);
      return { data: null, error };
    }
  },

  async updateUser(id: string, updates: Partial<AdminUser>): Promise<{ data: AdminUser | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .update({
          ...updates,
          last_update: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating user:', error);
      return { data: null, error };
    }
  },

  async deleteUser(id: string): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      return { success: !error, error };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error };
    }
  },

  async getUserByEmail(email: string): Promise<{ data: AdminUser | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      return { data, error };
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return { data: null, error };
    }
  },

  async searchUsers(searchTerm: string): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,dni.ilike.%${searchTerm}%`)
        .order('registration_date', { ascending: false });

      if (error) {
        console.error('Error searching users:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  async exportToCSV(): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('registration_date', { ascending: false });

      if (error || !data) {
        console.error('Error exporting users:', error);
        return null;
      }

      const headers = ['Nombre', 'DNI', 'Email', 'Teléfono', 'Producto', 'Estado', 'Fecha de Registro'];
      const csvContent = [
        headers.join(','),
        ...data.map(user => [
          user.full_name,
          user.dni,
          user.email,
          user.phone,
          user.product_type,
          user.process_status,
          new Date(user.registration_date).toLocaleDateString('es-ES')
        ].join(','))
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error exporting users:', error);
      return null;
    }
  },

  async migrateFromLocalStorage(): Promise<{ success: boolean; message: string }> {
    try {
      const localUsers = localStorage.getItem('nezaAdminUsers');
      if (!localUsers) {
        return { success: false, message: 'No se encontraron datos en localStorage' };
      }

      const users = JSON.parse(localUsers);
      if (!Array.isArray(users) || users.length === 0) {
        return { success: false, message: 'No hay usuarios válidos para migrar' };
      }

      const { data, error } = await supabase.rpc('migrate_localstorage_data', { data: users });

      if (error) {
        console.error('Error migrating data:', error);
        return { success: false, message: `Error en la migración: ${error.message}` };
      }

      return { success: true, message: data || 'Migración completada exitosamente' };
    } catch (error) {
      console.error('Error migrating from localStorage:', error);
      return { success: false, message: 'Error inesperado durante la migración' };
    }
  },

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
        .select('*');

      if (error || !users) {
        return {
          totalUsers: 0,
          activeApplications: 0,
          completedApplications: 0,
          byProductType: {},
          byStatus: {}
        };
      }

      const totalUsers = users.length;
      const activeApplications = users.filter(user => 
        user.process_status === 'En proceso' || user.process_status === 'Completó formulario'
      ).length;
      const completedApplications = users.filter(user => 
        user.process_status === 'Completado' || user.process_status === 'Aprobado'
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
      console.error('Error getting statistics:', error);
      return {
        totalUsers: 0,
        activeApplications: 0,
        completedApplications: 0,
        byProductType: {},
        byStatus: {}
      };
    }
  },

  async getUserStats(): Promise<{ 
    totalUsers: number; 
    activeUsers: number; 
    completedProcesses: number; 
    byProduct: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    return this.getStatistics().then(stats => ({
      totalUsers: stats.totalUsers,
      activeUsers: stats.activeApplications,
      completedProcesses: stats.completedApplications,
      byProduct: stats.byProductType,
      byStatus: stats.byStatus
    }));
  },

  async logUserActivity(activityData: UserActivityData): Promise<{ data: UserActivity[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .insert([{
          user_id: activityData.userId,
          activity_type: activityData.activityType,
          description: activityData.description,
          product_type: activityData.productType || null,
          document_type: activityData.documentType || null,
          session_id: activityData.sessionId || null,
          activity_data: activityData.activityData || null
        }])
        .select();

      return { data, error };
    } catch (error) {
      console.error('Error logging user activity:', error);
      return { data: null, error };
    }
  },

  async getUserActivities(userId: string): Promise<{ data: UserActivity[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching user activities:', error);
      return { data: null, error };
    }
  }
};
