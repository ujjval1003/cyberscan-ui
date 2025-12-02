const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    if (response.headers.get('content-type')?.includes('application/json')) {
      return response.json();
    }

    return response as unknown as T;
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
    
    if (!response.ok) throw new Error('Download failed');
    
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
