import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../redux/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import ReCAPTCHA from 'react-google-recaptcha';
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null); 
  const { login } = useAuth();
  const navigate = useNavigate();
  const captchaRef=useRef();


  // console.log(captchaValue);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!captchaValue) {
      setError('Please complete the CAPTCHA');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/login', { email, password, captcha: captchaValue });
      alert('Login successful');
      localStorage.setItem('token', response.data.token);
      login();
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed: ' + (error.response?.data?.message || 'Invalid credentials'));
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:8000/api/v1/auth/google', {
        idToken: credentialResponse.credential
      });
      alert('Google login successful');
      localStorage.setItem('token', res.data.token);
      login();
      navigate('/');
    } catch (error) {
      setError('Google login failed: ' + (error.response?.data?.message || 'Try again.'));
    }
  };

  const handleGoogleFailure = (error) => {
    setError('Google login failed: ' + error.details);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAT_CAPTCHA_KEY} 
          onChange={(value) => setCaptchaValue(value)}
          ref={captchaRef}
        />
        <button type="submit" className="submit-button">Login</button>
      </form>
      <GoogleOAuthProvider clientId={process.env.RECAT_GOOGLE_KEY}>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={handleGoogleFailure}
          style={{ marginTop: '20px' }}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default Login;
