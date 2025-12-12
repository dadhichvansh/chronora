import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RedirectIfAuth({ children }) {
  const { user, isLoading } = useAuth();

  // still checking auth — don't redirect yet
  if (isLoading) return null;

  // If user exists → redirect to home
  if (user) return <Navigate to="/" replace />;

  // Else show the wrapped component (login/register page)
  return children;
}
