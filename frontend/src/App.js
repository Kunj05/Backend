import React from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import { useAuth } from './redux/AuthContext';
import './App.css'; // Import the CSS file for styling

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <div>
      <header className="app-header">
        <h1 className="app-title">E-Commerce App</h1>
        <nav className="navbar">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/signup">Sign Up</Link>
          <Link className="nav-link" to="/login">Log In</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
