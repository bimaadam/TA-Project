import Cookies from 'js-cookie';

// src/services/auth.service.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Gunakan variabel lingkungan atau fallback // Ganti dengan URL API NestJS Anda

interface AuthResponse {
  message?: string; // Optional message for register
  data: {
    accessToken: string;
    user: {
      id: string;
      email: string;
      fullName: string;
      role: string;
    };
  };
}

interface ProfileResponse {
  id: string;
  email: string;
  fullName: string;
  role: string;
  // Add other profile fields if they exist in your API response
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string; // Made optional
  avatar?: string; // Made optional
  role: 'CLIENT';
  isVerified: boolean;
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async getProfile(): Promise<ProfileResponse> {
  const token = this.getToken();
  if (!token) throw new Error('No access token found');

  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch profile (${response.status})`);
  }

  const data = await response.json();
  return data.user; // <-- balikin langsung user clean
  },

  // Fungsi untuk menyimpan token (akan diimplementasikan nanti)
  saveToken(token: string) {
    localStorage.setItem('accessToken', token);
    Cookies.set('accessToken', token, { path: '/' }); // Also set as cookie
  },

  // Fungsi untuk mendapatkan token (akan diimplementasikan nanti)
  getToken(): string | null {
    let token = localStorage.getItem('accessToken');
    if (!token) {
      token = Cookies.get('accessToken');
    }
    return token;
  },

  // Fungsi untuk menghapus token (akan diimplementasikan nanti)
  removeToken() {
    localStorage.removeItem('accessToken');
    Cookies.remove('accessToken', { path: '/' }); // Also remove from cookie
  },
};
