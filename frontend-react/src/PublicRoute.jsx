import { Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/AuthProvider';

export default function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
}
