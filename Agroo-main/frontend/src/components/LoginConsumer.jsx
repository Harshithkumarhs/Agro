import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginConsumer.css';

const LoginConsumer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    apartment: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Apartment validation
    if (!formData.apartment.trim()) {
      newErrors.apartment = 'Apartment is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:3001/api/loginConsumer', {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        apartment: formData.apartment.trim(),
        password: formData.password
      });
      
      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/consumer-dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        setErrors({ submit: err.response.data.errorMessage });
      } else {
        setErrors({ submit: 'An error occurred. Please try again later.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-consumer-container">
      <div className="container-wrapper">
        <div className="quote-container animate__animated animate__fadeInLeft">
          <div className="quote-box">
            <p className="quote-text">
              "The greatest service which can be rendered any country is to add a useful plant to its culture."
            </p>
            <p className="quote-author">- Thomas Jefferson</p>
          </div>
          <div className="quote-box">
            <p className="quote-text">
              "When you buy from a local farmer, you are not just buying food. You are buying hundreds of years of tradition and dedication."
            </p>
            <p className="quote-author">- Anonymous</p>
          </div>
        </div>
        
        <div className="card animate__animated animate__fadeInRight">
          <div className="signin-link">
            <p>Don't have an account? <Link to="/signinConsumer">Sign In</Link></p>
          </div>
          
          <div className="header-text">Welcome Back</div>
          
          {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <div className="input-group">
                <i className="fas fa-phone"></i>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="apartment" className="form-label">Apartment</label>
              <div className="input-group">
                <i className="fas fa-home"></i>
                <input
                  type="text"
                  className={`form-control ${errors.apartment ? 'is-invalid' : ''}`}
                  id="apartment"
                  name="apartment"
                  placeholder="Enter your apartment name"
                  value={formData.apartment}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.apartment && <div className="invalid-feedback">{errors.apartment}</div>}
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            
            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging In...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginConsumer; 