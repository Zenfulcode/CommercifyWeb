export class AuthStorage {
    private readonly TOKEN_KEY = 'token';
    private readonly REMEMBER_ME_KEY = 'rememberMe';

    setToken(token: string, rememberMe: boolean) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.REMEMBER_ME_KEY, String(rememberMe));
    }

    getToken(): string | null {
        // First check sessionStorage
        const sessionToken = sessionStorage.getItem(this.TOKEN_KEY);
        if (sessionToken) {
            return sessionToken;
        }

        // Then check localStorage if user chose "remember me"
        const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
        if (rememberMe) {
            return localStorage.getItem(this.TOKEN_KEY);
        }

        return null;
    }

    clearToken() {
        sessionStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REMEMBER_ME_KEY);
    }

    isRememberMe(): boolean {
        return localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
    }
}

export const authStorage = new AuthStorage();