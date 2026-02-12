"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import bcrypt from 'bcryptjs';

// Hashed admin credentials
const ADMINS: Record<string, string> = {
    "admin": "$2b$10$MlD5d1mOzoesJwa1NrVukevwTkp3WVgP6TmLpT.ZnJq2oD90I33ZK", // Mega@2026
    "admin2": "$2b$10$9EGhxIRY6GkgfC1tkSnIMufzDA/q/44wX3dVnJcDh6giaHS6iKGoy" // Secure@2026
};

const SESSION_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours for session (or sliding window)
const REMEMBER_ME_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

interface AuthState {
    isAuthenticated: boolean;
    adminName: string;
    loginTime: number | null;
    sessionToken: string | null;
    isInitializing: boolean;
}

interface LoginResult {
    success: boolean;
    message?: string;
}

interface AuthContextType extends AuthState {
    login: (name: string, password: string, rememberMe: boolean) => Promise<LoginResult>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        adminName: '',
        loginTime: null,
        sessionToken: null,
        isInitializing: true,
    });

    const logout = useCallback(() => {
        setAuthState(prev => ({
            ...prev,
            isAuthenticated: false,
            adminName: '',
            loginTime: null,
            sessionToken: null,
        }));
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminSession');
    }, []);

    // Initialize from storage (check both localStorage and sessionStorage)
    useEffect(() => {
        const savedSession = localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession');

        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                const expiry = localStorage.getItem('adminSession') ? REMEMBER_ME_EXPIRY_MS : SESSION_EXPIRY_MS;

                if (session.loginTime && (Date.now() - session.loginTime < expiry)) {
                    setAuthState(prev => ({
                        ...prev,
                        ...session,
                        isAuthenticated: true,
                        isInitializing: false
                    }));
                    return; // Exit early to avoid setting isInitializing: false twice
                } else {
                    localStorage.removeItem('adminSession');
                    sessionStorage.removeItem('adminSession');
                }
            } catch (e) {
                console.error('Failed to parse auth session', e);
            }
        }

        // Cleanup old lockout data if it exists
        localStorage.removeItem('loginAttempts');
        setAuthState(prev => ({ ...prev, isInitializing: false }));
    }, []);

    // Session activity tracker (resets expiration on activity)
    useEffect(() => {
        if (!authState.isAuthenticated) return;

        const updateActivity = () => {
            const now = Date.now();
            const isPersistent = !!localStorage.getItem('adminSession');

            setAuthState(prev => {
                const newState = { ...prev, loginTime: now };
                const storage = isPersistent ? localStorage : sessionStorage;
                storage.setItem('adminSession', JSON.stringify({
                    adminName: newState.adminName,
                    loginTime: newState.loginTime,
                    sessionToken: newState.sessionToken
                }));
                return newState;
            });
        };

        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, updateActivity));

        const interval = setInterval(() => {
            const isPersistent = !!localStorage.getItem('adminSession');
            const expiry = isPersistent ? REMEMBER_ME_EXPIRY_MS : SESSION_EXPIRY_MS;

            if (authState.loginTime && (Date.now() - authState.loginTime > expiry)) {
                logout();
            }
        }, 60000);

        return () => {
            events.forEach(event => window.removeEventListener(event, updateActivity));
            clearInterval(interval);
        };
    }, [authState.isAuthenticated, authState.loginTime, logout]);

    const login = async (name: string, password: string, rememberMe: boolean): Promise<LoginResult> => {
        try {
            const normalizedName = name.toLowerCase();
            console.log(`Attempting login for: ${normalizedName}`);

            // Check username & password
            const hashedPass = ADMINS[normalizedName];
            const isPassValid = hashedPass ? await bcrypt.compare(password, hashedPass) : false;

            if (!isPassValid) {
                console.log(`Login failed for: ${normalizedName}`);
                return {
                    success: false,
                    message: 'Invalid username or password',
                };
            }

            console.log(`Login successful for: ${normalizedName}`);
            // Success
            const newSession = {
                adminName: normalizedName,
                loginTime: Date.now(),
                sessionToken: Math.random().toString(36).substring(2) + Date.now().toString(36),
            };

            setAuthState(prev => ({
                ...prev,
                ...newSession,
                isAuthenticated: true,
            }));

            // Persist based on rememberMe
            if (rememberMe) {
                localStorage.setItem('adminSession', JSON.stringify(newSession));
                sessionStorage.removeItem('adminSession');
            } else {
                sessionStorage.setItem('adminSession', JSON.stringify(newSession));
                localStorage.removeItem('adminSession');
            }

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'An internal error occurred' };
        }
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
