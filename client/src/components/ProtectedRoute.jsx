import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // If not logged in, redirect to landing page (or /auth)
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
