import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { setupInterceptors } from '../lib/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await userApi.getCurrentUser();
        if (data.ok) {
          setUser(data.user);
        }
      } catch (err) {
        if (import.meta.env.MODE === 'development') {
          console.error(
            'Auth check failed:',
            err.response?.data || err.message,
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
    const { data } = await authApi.login(credentials);
    if (data.ok) {
      setUser(data.user);
      return true;
    }
    return false;
  };

  const logoutUser = async () => {
    const { data } = await authApi.logout();
    if (data.ok) {
      setUser(null);
      return true;
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
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
        testimonialsRef,
        scrollToSection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
