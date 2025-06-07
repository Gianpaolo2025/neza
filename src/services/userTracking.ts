
export interface UserSession {
  id: string;
  email: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  deviceType: 'web' | 'mobile';
  userAgent: string;
  duration?: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  activityType: 'product_view' | 'form_submit' | 'file_upload' | 'page_visit' | 'button_click';
  data: any;
  productType?: string;
  documentType?: string;
}

export interface UserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  dni?: string;
  phone?: string;
  monthlyIncome?: number;
  lastVisit: Date;
  totalSessions: number;
  totalTimeSpent: number;
  completedProcesses: number;
  abandonedProcesses: number;
}

export interface UploadedFile {
  id: string;
  userId: string;
  sessionId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadTime: Date;
  documentType: string;
  analysisResult?: any;
}

class UserTrackingService {
  private sessions: UserSession[] = [];
  private activities: UserActivity[] = [];
  private profiles: Map<string, UserProfile> = new Map();
  private uploadedFiles: UploadedFile[] = [];
  private currentSessionId: string | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private detectDeviceType(): 'web' | 'mobile' {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      ? 'mobile' : 'web';
  }

  private saveToStorage(): void {
    localStorage.setItem('neza_sessions', JSON.stringify(this.sessions));
    localStorage.setItem('neza_activities', JSON.stringify(this.activities));
    localStorage.setItem('neza_profiles', JSON.stringify(Array.from(this.profiles.entries())));
    localStorage.setItem('neza_files', JSON.stringify(this.uploadedFiles));
  }

  private loadFromStorage(): void {
    try {
      const sessions = localStorage.getItem('neza_sessions');
      if (sessions) this.sessions = JSON.parse(sessions);

      const activities = localStorage.getItem('neza_activities');
      if (activities) this.activities = JSON.parse(activities);

      const profiles = localStorage.getItem('neza_profiles');
      if (profiles) this.profiles = new Map(JSON.parse(profiles));

      const files = localStorage.getItem('neza_files');
      if (files) this.uploadedFiles = JSON.parse(files);
    } catch (error) {
      console.error('Error loading tracking data:', error);
    }
  }

  startSession(email: string): string {
    const sessionId = this.generateId();
    this.currentSessionId = sessionId;

    const session: UserSession = {
      id: this.generateId(),
      email,
      sessionId,
      startTime: new Date(),
      deviceType: this.detectDeviceType(),
      userAgent: navigator.userAgent
    };

    this.sessions.push(session);

    // Actualizar perfil del usuario
    const profile = this.profiles.get(email) || {
      email,
      lastVisit: new Date(),
      totalSessions: 0,
      totalTimeSpent: 0,
      completedProcesses: 0,
      abandonedProcesses: 0
    };

    profile.lastVisit = new Date();
    profile.totalSessions += 1;
    this.profiles.set(email, profile);

    this.saveToStorage();
    return sessionId;
  }

  endSession(): void {
    if (!this.currentSessionId) return;

    const session = this.sessions.find(s => s.sessionId === this.currentSessionId);
    if (session && !session.endTime) {
      session.endTime = new Date();
      session.duration = session.endTime.getTime() - session.startTime.getTime();

      // Actualizar tiempo total del perfil
      const profile = this.profiles.get(session.email);
      if (profile) {
        profile.totalTimeSpent += session.duration;
        this.profiles.set(session.email, profile);
      }

      this.saveToStorage();
    }

    this.currentSessionId = null;
  }

  trackActivity(activityType: UserActivity['activityType'], data: any, productType?: string, documentType?: string): void {
    if (!this.currentSessionId) return;

    const session = this.sessions.find(s => s.sessionId === this.currentSessionId);
    if (!session) return;

    const activity: UserActivity = {
      id: this.generateId(),
      userId: session.email,
      sessionId: this.currentSessionId,
      timestamp: new Date(),
      activityType,
      data,
      productType,
      documentType
    };

    this.activities.push(activity);
    this.saveToStorage();
  }

  trackFileUpload(fileName: string, fileType: string, fileSize: number, documentType: string, analysisResult?: any): string {
    if (!this.currentSessionId) return '';

    const session = this.sessions.find(s => s.sessionId === this.currentSessionId);
    if (!session) return '';

    const uploadedFile: UploadedFile = {
      id: this.generateId(),
      userId: session.email,
      sessionId: this.currentSessionId,
      fileName,
      fileType,
      fileSize,
      uploadTime: new Date(),
      documentType,
      analysisResult
    };

    this.uploadedFiles.push(uploadedFile);
    this.trackActivity('file_upload', { fileName, fileType, documentType });
    this.saveToStorage();

    return uploadedFile.id;
  }

  updateUserProfile(email: string, data: Partial<UserProfile>): void {
    const profile = this.profiles.get(email) || {
      email,
      lastVisit: new Date(),
      totalSessions: 0,
      totalTimeSpent: 0,
      completedProcesses: 0,
      abandonedProcesses: 0
    };

    Object.assign(profile, data);
    this.profiles.set(email, profile);
    this.saveToStorage();
  }

  getUserHistory(email: string): {
    profile: UserProfile | null;
    sessions: UserSession[];
    activities: UserActivity[];
    files: UploadedFile[];
  } {
    return {
      profile: this.profiles.get(email) || null,
      sessions: this.sessions.filter(s => s.email === email),
      activities: this.activities.filter(a => a.userId === email),
      files: this.uploadedFiles.filter(f => f.userId === email)
    };
  }

  getAllMetrics(): {
    totalUsers: number;
    totalSessions: number;
    averageSessionTime: number;
    topProducts: Array<{ product: string; views: number }>;
    deviceBreakdown: { web: number; mobile: number };
    hourlyTraffic: Array<{ hour: number; sessions: number }>;
    conversionRate: number;
    totalFilesUploaded: number;
    fileTypeBreakdown: Array<{ type: string; count: number }>;
  } {
    const totalUsers = this.profiles.size;
    const totalSessions = this.sessions.length;
    
    const completedSessions = this.sessions.filter(s => s.endTime);
    const averageSessionTime = completedSessions.length > 0 
      ? completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length
      : 0;

    const productViews = this.activities
      .filter(a => a.activityType === 'product_view' && a.productType)
      .reduce((acc, a) => {
        acc[a.productType!] = (acc[a.productType!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topProducts = Object.entries(productViews)
      .map(([product, views]) => ({ product, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    const deviceBreakdown = this.sessions.reduce(
      (acc, s) => {
        acc[s.deviceType]++;
        return acc;
      },
      { web: 0, mobile: 0 }
    );

    const hourlyTraffic = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      sessions: this.sessions.filter(s => new Date(s.startTime).getHours() === hour).length
    }));

    const totalCompleted = Array.from(this.profiles.values()).reduce((sum, p) => sum + p.completedProcesses, 0);
    const totalAbandoned = Array.from(this.profiles.values()).reduce((sum, p) => sum + p.abandonedProcesses, 0);
    const conversionRate = totalCompleted + totalAbandoned > 0 ? (totalCompleted / (totalCompleted + totalAbandoned)) * 100 : 0;

    const fileTypeBreakdown = this.uploadedFiles.reduce((acc, f) => {
      const existing = acc.find(item => item.type === f.fileType);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ type: f.fileType, count: 1 });
      }
      return acc;
    }, [] as Array<{ type: string; count: number }>);

    return {
      totalUsers,
      totalSessions,
      averageSessionTime,
      topProducts,
      deviceBreakdown,
      hourlyTraffic,
      conversionRate,
      totalFilesUploaded: this.uploadedFiles.length,
      fileTypeBreakdown
    };
  }
}

export const userTrackingService = new UserTrackingService();
