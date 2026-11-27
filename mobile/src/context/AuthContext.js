import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadAuth, persistAuth, clearAuth } from '../api/authApi';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Splash / hydration loading

  // Hydrate auth state from AsyncStorage on app start
  useEffect(() => {
    const hydrate = async () => {
      try {
        const { token: savedToken, user: savedUser } = await loadAuth();
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
        }
      } catch (err) {
        console.warn('Auth hydration failed:', err.message);
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    await persistAuth(data.user, data.token);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const signup = async (name, email, password) => {
    const data = await authApi.signup(name, email, password);
    await persistAuth(data.user, data.token);
    setUser(data.user);
    setToken(data.token);
    return data;
  };

  const logout = async () => {
    await clearAuth();
    setUser(null);
    setToken(null);
  };

  const updateLocalUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'OPERATIONS_MANAGER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn,
        isAdmin,
        login,
        signup,
        logout,
        updateLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
