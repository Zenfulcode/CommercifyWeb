import { BaseApiService } from '@/types/apiBase';
import { RegisterRequest, LoginRequest, AuthResponse } from '@/types/auth';
import { authStorage } from './authStorage';

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

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.post<AuthResponse>('/signup', data);

      console.log(response);

      if (response.token.length >= 0) {
        authStorage.setToken(response.token);
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Registration failed');
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.post<AuthResponse>('/signin', data);

      authStorage.setToken(response.token);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Login failed');
    }
  }

  logout() {
    authStorage.removeToken();
  }

  getToken() {
    return authStorage.getToken();
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = AuthService.getInstance();