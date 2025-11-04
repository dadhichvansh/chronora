import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { setupInterceptors } from '../lib/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

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
      }
    };

    checkAuth();
  }, []);

  const loginUser = async (credentials) => {
    const {
      data: { ok, user },
    } = await authApi.login(credentials);

    if (ok) {
      setUser(user);
      return ok;
    }

    setUser(null);
    return ok;
  };

  const logoutUser = async () => {
    const {
      data: { ok },
    } = await authApi.logout();

    if (ok) {
      setUser(null);
      return ok;
    }
  };

  useEffect(() => {
    setupInterceptors(logoutUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
