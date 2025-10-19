import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RedirectIfAuth({ children }) {
  const { user } = useAuth();

  // If user exists → redirect to home
  if (user) return <Navigate to="/" replace />;

  // Else show the wrapped component (login/register page)
  return children;
}
