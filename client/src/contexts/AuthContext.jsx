import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';

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

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
