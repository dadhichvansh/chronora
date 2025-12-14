import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { setupInterceptors } from '../lib/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { ok, user },
        } = await userApi.getCurrentUser();
        if (ok) setUser(user);
        else setUser(null);
      } catch (err) {
        if (import.meta.env.MODE === 'development') {
          console.error(
            'Auth check failed:',
            err.response?.data || err.message
          );
        }

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    setupInterceptors(logoutUser);
  }, []);

  const loginUser = async (credentials) => {
    try {
      const {
        data: { ok, user },
      } = await authApi.login(credentials);

      if (ok) {
        setUser(user);
        return ok;
      }
    } catch (err) {
      console.error('Login failed:', err);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      setIsLoading(true);

      const {
        data: { ok },
      } = await authApi.logout();

      if (ok) {
        setUser(null);
        return ok;
      }
    } catch (err) {
      console.error('Logout failed:', err);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
