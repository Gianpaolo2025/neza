export interface UserSession {
  id: string;
  email: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  deviceType: 'web' | 'mobile';
  userAgent: string;
  duration?: number;
  entryMethod: 'direct' | 'catalog' | 'onboarding' | 'search' | 'referral' | 'product_request';
  entryReason: string;
  currentRequest?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  activityType: 'product_view' | 'form_submit' | 'file_upload' | 'page_visit' | 'button_click' | 'form_start' | 'form_abandon' | 'offer_view' | 'offer_accept' | 'chat_interaction' | 'auction_validation_start' | 'auction_validation_completed' | 'faq_question_submit' | 'tutorial_step_completed' | 'tutorial_completed';
  data: any;
  productType?: string;
  documentType?: string;
  description: string;
  previousState?: any;
  newState?: any;
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
  currentStatus: 'new' | 'exploring' | 'applying' | 'pending' | 'approved' | 'rejected' | 'validating' | 'qualified';
  currentRequest?: string;
  registrationDate: Date;
  lastUpdate: Date;
  tags: string[];
}

export interface UserEvent {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  eventType: 'registration' | 'form_update' | 'status_change' | 'offer_received' | 'document_upload' | 'chat_message' | 'admin_note';
  description: string;
  data: any;
  automated: boolean;
  adminUserId?: string;
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
  private userEvents: UserEvent[] = [];
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
    localStorage.setItem('neza_events', JSON.stringify(this.userEvents));
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

      const events = localStorage.getItem('neza_events');
      if (events) this.userEvents = JSON.parse(events);
    } catch (error) {
      console.error('Error loading tracking data:', error);
    }
  }

  startSession(email: string, entryMethod: UserSession['entryMethod'] = 'direct', entryReason: string = 'Visita directa'): string {
    const sessionId = this.generateId();
    this.currentSessionId = sessionId;

    const session: UserSession = {
      id: this.generateId(),
      email,
      sessionId,
      startTime: new Date(),
      deviceType: this.detectDeviceType(),
      userAgent: navigator.userAgent,
      entryMethod,
      entryReason
    };

    this.sessions.push(session);

    // Actualizar o crear perfil del usuario
    const existingProfile = this.profiles.get(email);
    const profile: UserProfile = existingProfile || {
      email,
      lastVisit: new Date(),
      totalSessions: 0,
      totalTimeSpent: 0,
      completedProcesses: 0,
      abandonedProcesses: 0,
      currentStatus: 'new',
      registrationDate: new Date(),
      lastUpdate: new Date(),
      tags: []
    };

    profile.lastVisit = new Date();
    profile.totalSessions += 1;
    profile.lastUpdate = new Date();

    if (!existingProfile) {
      this.addUserEvent(email, sessionId, 'registration', `Nuevo usuario registrado - ${entryReason}`, { entryMethod, entryReason }, true);
    }

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
        profile.lastUpdate = new Date();
        this.profiles.set(session.email, profile);
      }

      this.saveToStorage();
    }

    this.currentSessionId = null;
  }

  trackActivity(activityType: UserActivity['activityType'], data: any, description: string, productType?: string, documentType?: string, previousState?: any, newState?: any): void {
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
      documentType,
      description,
      previousState,
      newState
    };

    this.activities.push(activity);
    
    // Actualizar el perfil con la última actividad
    const profile = this.profiles.get(session.email);
    if (profile) {
      profile.lastUpdate = new Date();
      this.profiles.set(session.email, profile);
    }

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
    this.trackActivity('file_upload', { fileName, fileType, documentType }, `Archivo subido: ${fileName}`, undefined, documentType);
    this.addUserEvent(session.email, this.currentSessionId, 'document_upload', `Documento subido: ${documentType}`, { fileName, fileType, fileSize }, true);
    this.saveToStorage();

    return uploadedFile.id;
  }

  addUserEvent(userId: string, sessionId: string, eventType: UserEvent['eventType'], description: string, data: any, automated: boolean = true, adminUserId?: string): void {
    const event: UserEvent = {
      id: this.generateId(),
      userId,
      sessionId,
      timestamp: new Date(),
      eventType,
      description,
      data,
      automated,
      adminUserId
    };

    this.userEvents.push(event);
    this.saveToStorage();
  }

  updateUserProfile(email: string, data: Partial<UserProfile>, reason: string = 'Actualización de perfil'): void {
    const profile = this.profiles.get(email) || {
      email,
      lastVisit: new Date(),
      totalSessions: 0,
      totalTimeSpent: 0,
      completedProcesses: 0,
      abandonedProcesses: 0,
      currentStatus: 'new' as const,
      registrationDate: new Date(),
      lastUpdate: new Date(),
      tags: []
    };

    const previousState = { ...profile };
    Object.assign(profile, data);
    profile.lastUpdate = new Date();
    this.profiles.set(email, profile);

    // Registrar el evento de actualización
    this.addUserEvent(email, this.currentSessionId || 'system', 'form_update', reason, { previousState, newState: profile }, true);
    this.saveToStorage();
  }

  updateUserStatus(email: string, newStatus: UserProfile['currentStatus'], reason: string): void {
    const profile = this.profiles.get(email);
    if (profile) {
      const previousStatus = profile.currentStatus;
      profile.currentStatus = newStatus;
      profile.lastUpdate = new Date();
      this.profiles.set(email, profile);

      this.addUserEvent(email, this.currentSessionId || 'system', 'status_change', 
        `Estado cambiado de ${previousStatus} a ${newStatus}: ${reason}`, 
        { previousStatus, newStatus, reason }, true);
      this.saveToStorage();
    }
  }

  getUserHistory(email: string): {
    profile: UserProfile | null;
    sessions: UserSession[];
    activities: UserActivity[];
    files: UploadedFile[];
    events: UserEvent[];
    timeline: Array<{ timestamp: Date; type: string; description: string; data: any; }>;
  } {
    const profile = this.profiles.get(email) || null;
    const sessions = this.sessions.filter(s => s.email === email);
    const activities = this.activities.filter(a => a.userId === email);
    const files = this.uploadedFiles.filter(f => f.userId === email);
    const events = this.userEvents.filter(e => e.userId === email);

    // Crear timeline consolidado
    const timeline: Array<{ timestamp: Date; type: string; description: string; data: any; }> = [];
    
    activities.forEach(activity => {
      timeline.push({
        timestamp: new Date(activity.timestamp),
        type: 'activity',
        description: activity.description,
        data: activity
      });
    });

    events.forEach(event => {
      timeline.push({
        timestamp: new Date(event.timestamp),
        type: 'event',
        description: event.description,
        data: event
      });
    });

    files.forEach(file => {
      timeline.push({
        timestamp: new Date(file.uploadTime),
        type: 'file',
        description: `Archivo subido: ${file.fileName}`,
        data: file
      });
    });

    // Ordenar timeline por fecha
    timeline.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      profile,
      sessions,
      activities,
      files,
      events,
      timeline
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
    userStatusBreakdown: Array<{ status: string; count: number }>;
    recentActivity: Array<{ timestamp: Date; description: string; userId: string; }>;
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

    const userStatusBreakdown = Array.from(this.profiles.values()).reduce((acc, profile) => {
      const existing = acc.find(item => item.status === profile.currentStatus);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ status: profile.currentStatus, count: 1 });
      }
      return acc;
    }, [] as Array<{ status: string; count: number }>);

    // Create separate arrays for activities and events, then merge them for the timeline
    const activityItems = this.activities.map(activity => ({
      timestamp: new Date(activity.timestamp),
      description: activity.description,
      userId: activity.userId
    }));

    const eventItems = this.userEvents.map(event => ({
      timestamp: new Date(event.timestamp),
      description: event.description,
      userId: event.userId
    }));

    const recentActivity = [...activityItems, ...eventItems]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20);

    return {
      totalUsers,
      totalSessions,
      averageSessionTime,
      topProducts,
      deviceBreakdown,
      hourlyTraffic,
      conversionRate,
      totalFilesUploaded: this.uploadedFiles.length,
      fileTypeBreakdown,
      userStatusBreakdown,
      recentActivity
    };
  }

  getCurrentUser(): { email: string } | null {
    if (!this.currentSessionId) return null;
    
    const session = this.sessions.find(s => s.sessionId === this.currentSessionId);
    return session ? { email: session.email } : null;
  }
}

export const userTrackingService = new UserTrackingService();
