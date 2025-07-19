import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginLogistics.css';

const LoginLogistics = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/loginLogistics', formData);
      
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/logistics-dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-logistics-container">
      <div className="card">
        <div className="header-text">Logistics Login</div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="d-grid">
            <button type="submit" className="btn btn-submit">Login</button>
          </div>
        </form>
        
        <div className="signin-link">
          <p>Don't have an account? <Link to="/signinLogistics">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginLogistics; 