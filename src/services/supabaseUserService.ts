
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type AdminUser = Database['public']['Tables']['admin_users']['Row'];
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

  async bulkCreateUsers(usersData: Partial<AdminUser>[]): Promise<{ data: AdminUser[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .upsert(usersData)
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

  async deleteUser(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      return { error };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { error };
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

  async getUserStats(): Promise<{ 
    totalUsers: number; 
    activeUsers: number; 
    completedProcesses: number; 
    byProduct: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    try {
      const { data: users, error } = await supabase
        .from('admin_users')
        .select('*');

      if (error || !users) {
        return {
          totalUsers: 0,
          activeUsers: 0,
          completedProcesses: 0,
          byProduct: {},
          byStatus: {}
        };
      }

      const totalUsers = users.length;
      const activeUsers = users.filter(user => user.process_status === 'En proceso').length;
      const completedProcesses = users.filter(user => user.process_status === 'Completado').length;

      const byProduct = users.reduce((acc, user) => {
        acc[user.product_type] = (acc[user.product_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const byStatus = users.reduce((acc, user) => {
        acc[user.process_status] = (acc[user.process_status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalUsers,
        activeUsers,
        completedProcesses,
        byProduct,
        byStatus
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        completedProcesses: 0,
        byProduct: {},
        byStatus: {}
      };
    }
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
