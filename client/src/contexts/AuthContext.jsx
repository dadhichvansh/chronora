import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
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
        } = await authApi.getCurrentUser();
        if (ok) {
          setUser(user);
        }
      } catch (err) {
        console.error(
          import.meta.env.VITE_ENV === 'development'
            ? err.response.data.message
            : undefined
        );
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
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

  useEffect(() => {
    setupInterceptors(logoutUser);
  }, []);

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
