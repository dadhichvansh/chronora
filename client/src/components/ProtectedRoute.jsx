import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  // still checking auth — don't redirect yet
  if (isLoading) return null;

  // If not logged in, redirect to landing page (or /auth)
  if (!user) return <Navigate to="/auth" replace />;

  return children;
}
