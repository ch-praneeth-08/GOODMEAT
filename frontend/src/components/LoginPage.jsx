import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.svg'; // Import your logo
import './LoginPage.css';

function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Start loading

    axios.post('http://localhost:5000/auth/login', { password }, { withCredentials: true })
      .then(response => {
        setIsLoggedIn(true);
        navigate('/admin');
      })
      .catch(err => {
        setError('Invalid password. Please try again.');
        setIsLoggedIn(false);
        console.error('Login error:', err);
      })
      .finally(() => {
        setLoading(false); // Stop loading regardless of outcome
      });
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <Link to="/" className="login-logo-link">
          <img src={logo} alt="GoodMeat Logo" className="login-logo" />
        </Link>
        <h1 className="login-title">Admin Panel Access</h1>
        <p className="login-subtitle">Please enter your password to continue.</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn--primary btn--large" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;