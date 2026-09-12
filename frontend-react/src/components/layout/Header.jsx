import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../features/auth/AuthProvider';
import { logout } from '../../services/authService';
import ProfileDropdown from './ProfileDropdown';
import ConfirmLogoutModal from './ConfirmLogoutModal';

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsLogoutModalOpen(false);
    toast.success('Signed out successfully.');
    navigate('/login');
  };

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          {/* Logo */}
          <Link to={isLoggedIn ? "/dashboard" : "/"} className="header__logo" aria-label="Stock Prediction Portal home">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="var(--color-accent)"/>
              <polyline points="5,22 11,14 16,18 22,9 27,12"
                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <span className="header__logo-text">StockAI</span>
          </Link>

          {/* Nav */}
          <nav className="header__nav" aria-label="Main navigation">
            {isLoggedIn ? (
              <>
                {location.pathname !== '/dashboard' && (
                  <Link
                    to="/dashboard"
                    className="header__nav-link"
                  >
                    Dashboard
                  </Link>
                )}
                <ProfileDropdown onLogoutClick={() => setIsLogoutModalOpen(true)} />
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <ConfirmLogoutModal 
        isOpen={isLogoutModalOpen} 
        onCancel={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogout} 
      />
    </>
  );
}
