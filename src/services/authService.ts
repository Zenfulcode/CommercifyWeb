import { BaseApiService } from '@/types/apiBase';
import { RegisterRequest, LoginRequest, AuthResponse } from '@/types/auth';
import { authStorage } from './authStorage';

interface LoginOptions {
  rememberMe: boolean;
}

class AuthService extends BaseApiService {
  private static instance: AuthService;

  private constructor() {
    super('http://localhost:6091/api/v1/auth');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(data: RegisterRequest, rememberMe = false): Promise<AuthResponse> {
    try {
      const response = await this.post<AuthResponse>('/signup', data);
      authStorage.setToken(response.token, rememberMe);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed');
    }
  }

  async login(data: LoginRequest, options: LoginOptions = { rememberMe: false }): Promise<AuthResponse> {
    try {
      const response = await this.post<AuthResponse>('/signin', data);
      authStorage.setToken(response.token, options.rememberMe);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    }
  }

  logout() {
    authStorage.clearToken();
  }

  getToken() {
    return authStorage.getToken();
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  isRememberMe() {
    return authStorage.isRememberMe();
  }
}


export const authService = AuthService.getInstance();