import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const authData = {
      username, password
    };

    try {
      const response = await axiosInstance.post('/token/', authData);

      // Save tokens to localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Update login state
      setIsLoggedIn(true);

      // Redirect to the homepage or dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Invalid credentials');
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 bg-light-dark p-5 rounded">
          <h3 className="text-light text-center mb-4">Login Into Your Account</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-danger">{error}</div>}

            {loading ? (
              <button type="submit" className="btn btn-info d-block mx-auto" disabled>
                <FontAwesomeIcon icon={faSpinner} spin /> Logging in...
              </button>
            ) : (
              <button type="submit" className="btn btn-info d-block mx-auto">
                Login
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
