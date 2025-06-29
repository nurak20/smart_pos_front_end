import Cookies from 'js-cookie';

class AuthService {
    constructor() {
        this.TOKEN_KEY = 'access_token';
        this.USER_KEY = 'user_data';
        this.AUTH_KEY = 'authorization_data';
    }

    // Save authentication data
    saveAuthData(loginResponse) {
        try {
            const { data, meta } = loginResponse;

            // Save token in cookies (httpOnly would be better for production)
            Cookies.set(this.TOKEN_KEY, meta.token, {
                expires: 1, // 1 day
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            // Save user data in localStorage
            localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));

            // Save authorization data in localStorage
            localStorage.setItem(this.AUTH_KEY, JSON.stringify(data.authorization));

            return true;
        } catch (error) {
            console.error('Error saving auth data:', error);
            return false;
        }
    }
    saveUserData(userData) {
        try {
            localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    }

    // Get stored token
    getToken() {
        return Cookies.get(this.TOKEN_KEY);
    }

    // Get stored user data
    getUser() {
        try {
            const userData = localStorage.getItem(this.USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    }

    // Get stored authorization data
    getAuthorization() {
        try {
            const authData = localStorage.getItem(this.AUTH_KEY);
            return authData ? JSON.parse(authData) : null;
        } catch (error) {
            console.error('Error getting authorization data:', error);
            return null;
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user);
    }

    // Check if user has specific role
    hasRole(role) {
        const auth = this.getAuthorization();
        return auth?.roles?.includes(role) || false;
    }

    // Check if user has specific permission
    hasPermission(permission) {
        const auth = this.getAuthorization();
        return auth?.permissions?.includes(permission) || false;
    }

    // Check if user is admin
    isAdmin() {
        return this.hasRole('admin');
    }

    // Get user roles
    getUserRoles() {
        const auth = this.getAuthorization();
        return auth?.roles || [];
    }

    // Get user permissions
    getUserPermissions() {
        const auth = this.getAuthorization();
        return auth?.permissions || [];
    }

    // Verify token is still valid (decode JWT without verification - for client-side checks only)
    isTokenExpired() {
        const token = this.getToken();
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error checking token expiration:', error);
            return true;
        }
    }

    // Logout user
    logout() {
        Cookies.remove(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.AUTH_KEY);
    }

    // Get authorization header for API requests
    getAuthHeader() {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}

export default new AuthService();