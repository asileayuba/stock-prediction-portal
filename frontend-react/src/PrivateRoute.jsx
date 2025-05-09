import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  // If the user is not logged in, redirect to login
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
