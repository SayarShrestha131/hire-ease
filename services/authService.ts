import api, { setAccessToken, clearAccessToken, saveAccessToken, saveRefreshToken, clearAuthTokens } from './api';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async signup(data: SignupData): Promise<any> {
    try {
      console.log('Attempting signup with:', { name: data.name, email: data.email });
      console.log('API URL:', api.defaults.baseURL);
      
      const response = await api.post('/auth/signup', data);
      console.log('Signup response:', response.data);
      
      // Check if email verification is required
      if (response.data.requiresVerification) {
        // Don't save tokens yet, user needs to verify email first
        return response.data;
      }
      
      // If no verification required (shouldn't happen with new flow, but keeping for backwards compatibility)
      const { accessToken, refreshToken } = response.data;
      if (accessToken && refreshToken) {
        setAccessToken(accessToken);
        await saveAccessToken(accessToken);
        await saveRefreshToken(refreshToken);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Signup error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
      });
      throw error;
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const { accessToken, refreshToken } = response.data;
    
    setAccessToken(accessToken);
    await saveAccessToken(accessToken);
    await saveRefreshToken(refreshToken);
    
    return response.data;
  },

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAccessToken();
      await clearAuthTokens();
    }
  },

  async getProfile(): Promise<any> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      console.error('Forgot password error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  async resetPassword(otp: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/auth/reset-password', { otp, newPassword });
      return response.data;
    } catch (error: any) {
      console.error('Reset password error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  async verifyEmail(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/verify-email', { email, otp });
      const { accessToken, refreshToken } = response.data;
      
      setAccessToken(accessToken);
      await saveAccessToken(accessToken);
      await saveRefreshToken(refreshToken);
      
      return response.data;
    } catch (error: any) {
      console.error('Verify email error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },
};
