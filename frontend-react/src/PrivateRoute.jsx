import { Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/AuthProvider';

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
