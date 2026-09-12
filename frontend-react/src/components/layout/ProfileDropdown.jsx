import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ProfileDropdown({ onLogoutClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'profile', 'history', or null
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate();

  const openModal = async (type) => {
    setIsOpen(false);
    setActiveModal(type);
    setLoading(true);
    try {
      const { data } = await api.get('/profile/');
      setProfileData(data);
    } catch (err) {
      toast.error("Failed to load user data.");
      setActiveModal(null);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (historyId) => {
    setActiveModal(null);
    navigate(`/dashboard?history_id=${historyId}`);
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button 
        className="profile-dropdown__trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <div className="profile-dropdown__avatar">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="profile-dropdown__menu">
          <button className="profile-dropdown__item" onClick={() => openModal('profile')}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Profile
          </button>
          <button className="profile-dropdown__item" onClick={() => openModal('history')}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Search History
          </button>
          <div className="profile-dropdown__divider"></div>
          <button className="profile-dropdown__item text-negative" onClick={() => { setIsOpen(false); onLogoutClick(); }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      )}

      {/* Modals using Portals so they escape the Header's stacking context */}
      {activeModal && createPortal(
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className={`modal-content ${activeModal}-modal`} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)} aria-label="Close">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="modal-title">
              {activeModal === 'profile' ? 'Your Profile' : 'Search History'}
            </h2>
            
            {loading ? (
              <div className="profile-modal__loading">
                <span className="spinner" style={{ borderColor: 'rgba(0,0,0,0.1)', borderTopColor: 'var(--color-accent)' }}></span>
                Loading...
              </div>
            ) : profileData ? (
              <div className="profile-modal__body">
                
                {activeModal === 'profile' && (
                  <div className="profile-info" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <div className="profile-info__avatar">{profileData.username.charAt(0).toUpperCase()}</div>
                    <div className="profile-info__details">
                      <h3>{profileData.username}</h3>
                      <p>{profileData.email}</p>
                      <small>Member since {new Date(profileData.date_joined).toLocaleDateString()}</small>
                    </div>
                  </div>
                )}
                
                {activeModal === 'history' && (
                  <div className="profile-history">
                    {profileData.search_history && profileData.search_history.length > 0 ? (
                      <ul className="profile-history-list">
                        {profileData.search_history.map((item, i) => (
                          <li 
                            key={i} 
                            className="profile-history-item" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleHistoryClick(item.id)}
                            title={`Load prediction for ${item.ticker}`}
                          >
                            <span className="profile-history-ticker">{item.ticker}</span>
                            <span className="profile-history-date">{new Date(item.searched_at).toLocaleString()}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="profile-history-empty">You haven't searched for any stocks yet.</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p>Failed to load.</p>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
