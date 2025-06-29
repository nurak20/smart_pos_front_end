import { useState, useEffect, createContext, useContext } from 'react';
import AuthService from './AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [authorization, setAuthorization] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        try {
            if (AuthService.isAuthenticated() && !AuthService.isTokenExpired()) {
                setIsAuthenticated(true);
                setUser(AuthService.getUser());
                setAuthorization(AuthService.getAuthorization());
            } else {
                // Token expired or invalid, logout
                AuthService.logout();
                setIsAuthenticated(false);
                setUser(null);
                setAuthorization(null);
            }
        } catch (error) {

            AuthService.logout();
            setIsAuthenticated(false);
            setUser(null);
            setAuthorization(null);
        } finally {
            setLoading(false);
        }
    };

    const login = (loginResponse) => {
        if (AuthService.saveAuthData(loginResponse)) {
            setIsAuthenticated(true);
            setUser(loginResponse.data.user);
            setAuthorization(loginResponse.data.authorization);
            return true;
        }
        return false;
    };

    const logout = () => {
        AuthService.logout();
        setIsAuthenticated(false);
        setUser(null);
        setAuthorization(null);
    };

    const hasRole = (role) => {
        return authorization?.roles?.includes(role) || false;
    };

    const hasPermission = (permission) => {
        return authorization?.permissions?.includes(permission) || false;
    };

    const isAdmin = () => {
        return hasRole('administrator');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            authorization,
            loading,
            login,
            logout,
            hasRole,
            hasPermission,
            isAdmin,
            checkAuthStatus
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};