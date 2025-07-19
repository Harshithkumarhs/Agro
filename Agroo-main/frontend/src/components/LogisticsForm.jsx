import React, { useState } from 'react';
import axios from 'axios';
import './LogisticsForm.css';

const LogisticsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    vehicleType: '',
    capacity: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3001/api/logistics-form', formData);
      
      if (response.status === 200) {
        setSuccess('Logistics form submitted successfully!');
        setFormData({
          name: '',
          phone: '',
          location: '',
          vehicleType: '',
          capacity: ''
        });
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
    <div className="logistics-form-container">
      <div className="container">
        <h1>Logistics Partner Form</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
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
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              placeholder="Enter your location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="vehicleType" className="form-label">Vehicle Type</label>
            <select
              className="form-control"
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              required
            >
              <option value="">Select vehicle type</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label htmlFor="capacity" className="form-label">Capacity (kg)</label>
            <input
              type="number"
              className="form-control"
              id="capacity"
              name="capacity"
              placeholder="Enter capacity in kg"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="d-grid">
            <button type="submit" className="btn btn-submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogisticsForm; 