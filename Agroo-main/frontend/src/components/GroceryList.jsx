import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './GroceryList.css';

const GroceryList = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    apartmentId: '',
    houseId: '',
    groceryItems: [
      { item: '', quantity: '', cost: '' }
    ]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [calculating, setCalculating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('groceryItems')) {
      const [_, index, field] = name.match(/groceryItems\[(\d+)\]\[(\w+)\]/);
      const updatedItems = [...formData.groceryItems];
      updatedItems[index][field] = value;
      setFormData({
        ...formData,
        groceryItems: updatedItems
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      groceryItems: [...formData.groceryItems, { item: '', quantity: '', cost: '' }]
    });
  };

  const removeItem = (index) => {
    if (formData.groceryItems.length > 1) {
      const updatedItems = formData.groceryItems.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        groceryItems: updatedItems
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Filter out empty items
    const validItems = formData.groceryItems.filter(item => item.item.trim() && item.quantity.trim());
    
    if (validItems.length === 0) {
      setError('Please add at least one grocery item');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/submit-grocery', {
        apartmentId: formData.apartmentId,
        houseId: formData.houseId,
        groceryItems: validItems
      });
      
      if (response.status === 200) {
        setSuccess('Grocery list submitted successfully!');
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            apartmentId: '',
            houseId: '',
            groceryItems: [{ item: '', quantity: '', cost: '' }]
          });
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3001/api/calculate-grocery');
      
      if (response.status === 200) {
        setSuccess('Grocery calculation completed! SMS notifications sent to farmers.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        setError(err.response.data.errorMessage);
      } else {
        setError('An error occurred while calculating grocery. Please try again later.');
      }
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="grocery-list-container">
      <div className="container">
        <div className="quote-section animate__animated animate__fadeIn">
          <p className="quote-text">
            "Fresh ingredients make all the difference in creating healthy, delicious meals."
          </p>
          <p className="quote-author">- Farm to Table Movement</p>
        </div>
        
        <div className="form-container animate__animated animate__fadeInUp">
          <h2>Fresh Grocery List</h2>
          <p>Add your grocery items below and we'll make sure they're fresh from the farm to your table.</p>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="apartmentId" className="form-label">Apartment ID</label>
                  <div className="input-group">
                    <i className="fas fa-building"></i>
                    <input
                      type="text"
                      className="form-control"
                      id="apartmentId"
                      name="apartmentId"
                      placeholder="Enter Apartment ID"
                      value={formData.apartmentId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="houseId" className="form-label">House ID</label>
                  <div className="input-group">
                    <i className="fas fa-home"></i>
                    <input
                      type="text"
                      className="form-control"
                      id="houseId"
                      name="houseId"
                      placeholder="Enter House ID"
                      value={formData.houseId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div id="groceryItems">
              {formData.groceryItems.map((item, index) => (
                <div key={index} className="grocery-item animate__animated animate__fadeIn">
                  <div className="row">
                    <div className="col-md-4">
                      <label htmlFor={`item${index}`} className="form-label">Item</label>
                      <div className="input-group">
                        <i className="fas fa-shopping-basket"></i>
                        <input
                          type="text"
                          className="form-control"
                          id={`item${index}`}
                          name={`groceryItems[${index}][item]`}
                          placeholder="Enter item name"
                          value={item.item}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor={`quantity${index}`} className="form-label">Quantity</label>
                      <div className="input-group">
                        <i className="fas fa-balance-scale"></i>
                        <input
                          type="number"
                          className="form-control"
                          id={`quantity${index}`}
                          name={`groceryItems[${index}][quantity]`}
                          placeholder="Enter quantity"
                          value={item.quantity}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor={`cost${index}`} className="form-label">Cost (USD)</label>
                      <div className="input-group">
                        <i className="fas fa-dollar-sign"></i>
                        <input
                          type="number"
                          className="form-control"
                          id={`cost${index}`}
                          name={`groceryItems[${index}][cost]`}
                          placeholder="Enter cost"
                          value={item.cost}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      {formData.groceryItems.length > 1 && (
                        <div 
                          className="remove-item mt-3 text-center w-100"
                          onClick={() => removeItem(index)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="button" 
              className="btn btn-secondary mb-4 w-100"
              onClick={addItem}
            >
              <i className="fas fa-plus me-2"></i>Add More Items
            </button>

            <button type="submit" className="btn btn-primary w-100 mb-3">
              <i className="fas fa-paper-plane me-2"></i>Submit List
            </button>

            <div className="text-center">
              <button 
                type="button" 
                className="btn btn-success w-100 mb-3"
                onClick={handleCalculate}
                disabled={calculating}
              >
                <i className="fas fa-calculator me-2"></i>
                {calculating ? 'Calculating...' : 'Calculate & Send to Farmers'}
              </button>
              
              <div className="dashboard-links">
                <Link to="/consumer-dashboard" className="btn btn-link">
                  <i className="fas fa-tachometer-alt me-2"></i>View Consumer Dashboard
                </Link>
                
                <Link to="/total-grocery" className="btn btn-link">
                  <i className="fas fa-list-alt me-2"></i>View Total Grocery List
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GroceryList; 