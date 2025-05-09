import { useContext } from 'react';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Update login state
    setIsLoggedIn(false);
    console.log('Logged out');

    // Redirect to login
    navigate('/login');
  };

  return (
    <nav className="navbar container pt-3 pb-3 align-items-start">
      <Link className="navbar-brand text-light" to="/">Stock Prediction Portal</Link>

      <div>
        {isLoggedIn ? (
          <>
            <Button text="Dashboard" class="btn btn-outline-info" url="/dashboard" />
            &nbsp;
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Button text="Login" class="btn btn-outline-info" url="/login" />
            &nbsp;
            <Button text="Register" class="btn-info" url="/register" />
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
