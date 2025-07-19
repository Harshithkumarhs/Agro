import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './SigninConsumer.css';

const SigninConsumer = () => {
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
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
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
      const response = await axios.post('http://localhost:3001/api/signinConsumer', {
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
    <div className="signin-consumer-container">
      <div className="card">
        <div className="header-text">Consumer Sign In</div>
        
        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
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
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              id="phone"
              name="phone"
              placeholder="Enter your phone number (e.g., +1234567890)"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="apartment" className="form-label">Apartment</label>
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
            {errors.apartment && <div className="invalid-feedback">{errors.apartment}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              placeholder="Enter your password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          
          <div className="d-grid">
            <button 
              type="submit" 
              className="btn btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        
        <div className="login-link">
          <p>Already have an account? <Link to="/loginConsumer">Log In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SigninConsumer; 