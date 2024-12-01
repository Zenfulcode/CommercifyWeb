export class AuthStorage {
    private isClient = typeof window !== 'undefined';
  
    setToken(token: string) {
      if (this.isClient) {
        localStorage.setItem('token', token);
      }
    }
  
    getToken(): string | null {
      if (!this.isClient) return null;
      return localStorage.getItem('token');
    }
  
    removeToken() {
      if (this.isClient) {
        localStorage.removeItem('token');
      }
    }
  
    hasToken(): boolean {
      return !!this.getToken();
    }
  }
  
  export const authStorage = new AuthStorage();