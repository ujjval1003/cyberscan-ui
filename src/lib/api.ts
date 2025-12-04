const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Event emitter for auth events
type AuthEventType = 'session_expired' | 'forbidden';
const authEventListeners: Map<AuthEventType, Set<() => void>> = new Map();

export const authEvents = {
  on: (event: AuthEventType, callback: () => void) => {
    if (!authEventListeners.has(event)) {
      authEventListeners.set(event, new Set());
    }
    authEventListeners.get(event)?.add(callback);
  },
  off: (event: AuthEventType, callback: () => void) => {
    authEventListeners.get(event)?.delete(callback);
  },
  emit: (event: AuthEventType) => {
    authEventListeners.get(event)?.forEach(callback => callback());
  }
};

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private clearAuth() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    let response: Response;
    
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (error) {
      throw new ApiError(
        'Unable to connect to the server. Please check your internet connection and try again.',
        undefined,
        true
      );
    }

    if (response.status === 401) {
      this.clearAuth();
      authEvents.emit('session_expired');
      throw new ApiError('Session expired. Please log in again.', 401);
    }

    if (response.status === 403) {
      throw new ApiError('You do not have permission to perform this action.', 403);
    }

    if (response.status === 404) {
      throw new ApiError('The requested resource was not found.', 404);
    }

    if (response.status >= 500) {
      throw new ApiError('Server error. Please try again later.', response.status);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new ApiError(error.message || 'Request failed', response.status);
    }

    if (response.headers.get('content-type')?.includes('application/json')) {
      return response.json();
    }

    return response as unknown as T;
  }

  // Get protected image URL
  getProtectedImageUrl(filename: string): string {
    const token = this.getToken();
    return `${API_BASE_URL}/api/results/${filename}?token=${token}`;
  }

  // Fetch image as blob for protected images
  async fetchImageBlob(imageUrl: string): Promise<string> {
    try {
      const token = this.getToken();
      const response = await fetch(imageUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to load image');
      }
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Failed to fetch protected image:', error);
      return '';
    }
  }

  // Image endpoints
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.request<{ id: string; filename: string; message: string }>(
      '/api/images/upload',
      { method: 'POST', body: formData }
    );
  }

  async getImages() {
    return this.request<{ images: Image[] }>('/api/images');
  }

  async getImage(id: string) {
    return this.request<Image>(`/api/images/${id}`);
  }

  async deleteImage(id: string) {
    return this.request<{ message: string }>(`/api/images/${id}`, { method: 'DELETE' });
  }

  async deleteAllImages() {
    return this.request<{ message: string }>('/api/images', { method: 'DELETE' });
  }

  // Analysis endpoints
  async runPhase1(imageId: string) {
    return this.request<AnalysisResult>(`/api/analyze/phase1/${imageId}`, { method: 'POST' });
  }

  async runPhase2(imageId: string) {
    return this.request<AnalysisResult>(`/api/analyze/phase2/${imageId}`, { method: 'POST' });
  }

  async getAnalysis(imageId: string) {
    return this.request<AnalysisResult>(`/api/analysis/${imageId}`);
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request<DashboardStats>('/api/admin/dashboard');
  }

  async getUsers() {
    return this.request<{ users: User[] }>('/api/admin/users');
  }

  async getUser(id: string) {
    return this.request<User>(`/api/admin/users/${id}`);
  }

  async createUser(data: { email: string; password: string; name: string; role: string }) {
    return this.request<User>('/api/admin/create-user', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: Partial<{ email: string; name: string; role: string }>) {
    return this.request<User>(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<{ message: string }>(`/api/admin/users/${id}`, { method: 'DELETE' });
  }

  async getUserImages(userId: string) {
    return this.request<{ images: Image[] }>(`/api/admin/users/${userId}/images`);
  }

  async getUserImage(userId: string, imageId: string) {
    return this.request<Image>(`/api/admin/users/${userId}/images/${imageId}`);
  }

  async deleteUserImages(userId: string) {
    return this.request<{ message: string }>(`/api/admin/users/${userId}/images`, { method: 'DELETE' });
  }

  async deleteUserImage(userId: string, imageId: string) {
    return this.request<{ message: string }>(`/api/admin/users/${userId}/images/${imageId}`, { method: 'DELETE' });
  }

  async downloadUserData(userId: string) {
    const token = this.getToken();
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/download`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (response.status === 401) {
      this.clearAuth();
      authEvents.emit('session_expired');
      throw new ApiError('Session expired. Please log in again.', 401);
    }

    if (response.status === 404) {
      throw new ApiError('No data available for download.', 404);
    }
    
    if (!response.ok) {
      throw new ApiError('Download failed. Please try again.', response.status);
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_${userId}_data.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export const api = new ApiClient();

// Types
export interface Image {
  id: string;
  filename: string;
  original_url: string;
  uploaded_at: string;
  user_id: string;
  analysis?: AnalysisResult;
}

export interface AnalysisResult {
  id: string;
  image_id: string;
  phase1_complete: boolean;
  phase2_complete: boolean;
  phase1_heatmap?: string;
  phase2_mask?: string;
  prediction: 'forged' | 'authentic' | 'pending';
  probability_forged?: number;
  probability_authentic?: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'employee';
  created_at: string;
  image_count?: number;
}

export interface DashboardStats {
  total_users: number;
  total_images: number;
  forged_images: number;
  authentic_images: number;
  pending_analysis: number;
  recent_uploads: { date: string; count: number }[];
  analysis_breakdown: { forged: number; authentic: number; pending: number };
}
