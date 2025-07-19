import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConsumerDashboard.css';
import Navbar from './Navbar';

const ConsumerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selecting, setSelecting] = useState({});
  const [showGroceryForm, setShowGroceryForm] = useState(false);
  const [groceryForm, setGroceryForm] = useState({
    apartmentId: '',
    houseId: '',
    groceryItems: [{ item: '', quantity: '' }]
  });
  const [submitting, setSubmitting] = useState(false);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/consumer-dashboard');
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleSelectLogistics = async (apartmentId, logisticsId) => {
    setSelecting(prev => ({ ...prev, [apartmentId]: true }));
    
    try {
      await axios.post(`http://localhost:3001/api/select-logistics/${apartmentId}`, {
        logisticsId
      });
      
      // Refresh the data after selection
      await fetchOrders();
      
      alert(`Logistics partner selected successfully for apartment ${apartmentId}`);
    } catch (err) {
      alert('Error selecting logistics partner. Please try again.');
    } finally {
      setSelecting(prev => ({ ...prev, [apartmentId]: false }));
    }
  };

  const handleGroceryChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('groceryItems')) {
      const [_, index, field] = name.match(/groceryItems\[(\d+)\]\[(\w+)\]/);
      const updatedItems = [...groceryForm.groceryItems];
      updatedItems[index][field] = value;
      setGroceryForm({
        ...groceryForm,
        groceryItems: updatedItems
      });
    } else {
      setGroceryForm({
        ...groceryForm,
        [name]: value
      });
    }
  };

  const addGroceryItem = () => {
    setGroceryForm({
      ...groceryForm,
      groceryItems: [...groceryForm.groceryItems, { item: '', quantity: '' }]
    });
  };

  const removeGroceryItem = (index) => {
    if (groceryForm.groceryItems.length > 1) {
      const updatedItems = groceryForm.groceryItems.filter((_, i) => i !== index);
      setGroceryForm({
        ...groceryForm,
        groceryItems: updatedItems
      });
    }
  };

  const handleSubmitGrocery = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Filter out empty items
    const validItems = groceryForm.groceryItems.filter(item => item.item.trim() && item.quantity.trim());
    
    if (validItems.length === 0) {
      alert('Please add at least one grocery item');
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/submit-grocery', {
        apartmentId: groceryForm.apartmentId,
        houseId: groceryForm.houseId,
        groceryItems: validItems
      });
      
      if (response.status === 200) {
        alert('Grocery list submitted successfully!');
        setGroceryForm({
          apartmentId: '',
          houseId: '',
          groceryItems: [{ item: '', quantity: '' }]
        });
        setShowGroceryForm(false);
      }
    } catch (err) {
      alert('Error submitting grocery list. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCalculate = async () => {
    setCalculating(true);
    
    try {
      const response = await axios.post('http://localhost:3001/api/calculate-grocery');
      
      if (response.status === 200) {
        alert('Grocery calculation completed! SMS notifications sent to farmers.');
        await fetchOrders(); // Refresh orders after calculation
      }
    } catch (err) {
      alert('Error calculating grocery. Please try again.');
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="consumer-dashboard-container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="consumer-dashboard-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar userType="consumer" />
      <div className="consumer-dashboard-container">
        <div className="container">
          <div className="header-section">
            <h1>Consumer Dashboard</h1>
            <p>View your grocery orders and select logistics partners</p>
          </div>

          {/* Grocery Submission Section */}
          <div className="grocery-submission-section">
            <div className="section-header">
              <h2>Add Your Grocery Requirements</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowGroceryForm(!showGroceryForm)}
              >
                {showGroceryForm ? 'Hide Form' : 'Add Grocery Items'}
              </button>
            </div>

            {showGroceryForm && (
              <div className="grocery-form-container">
                <form onSubmit={handleSubmitGrocery}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="apartmentId">Apartment ID</label>
                      <input
                        type="text"
                        id="apartmentId"
                        name="apartmentId"
                        value={groceryForm.apartmentId}
                        onChange={handleGroceryChange}
                        required
                        placeholder="Enter Apartment ID"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="houseId">House ID</label>
                      <input
                        type="text"
                        id="houseId"
                        name="houseId"
                        value={groceryForm.houseId}
                        onChange={handleGroceryChange}
                        required
                        placeholder="Enter House ID"
                      />
                    </div>
                  </div>

                  <div className="grocery-items-section">
                    <h3>Grocery Items</h3>
                    {groceryForm.groceryItems.map((item, index) => (
                      <div key={index} className="grocery-item-row">
                        <div className="item-input">
                          <label htmlFor={`item${index}`}>Item</label>
                          <input
                            type="text"
                            id={`item${index}`}
                            name={`groceryItems[${index}][item]`}
                            value={item.item}
                            onChange={handleGroceryChange}
                            required
                            placeholder="Enter item name"
                          />
                        </div>
                        <div className="quantity-input">
                          <label htmlFor={`quantity${index}`}>Quantity</label>
                          <input
                            type="number"
                            id={`quantity${index}`}
                            name={`groceryItems[${index}][quantity]`}
                            value={item.quantity}
                            onChange={handleGroceryChange}
                            required
                            placeholder="Enter quantity"
                          />
                        </div>
                        {groceryForm.groceryItems.length > 1 && (
                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeGroceryItem(index)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button 
                      type="button" 
                      className="btn btn-secondary add-item-btn"
                      onClick={addGroceryItem}
                    >
                      <i className="fas fa-plus"></i> Add More Items
                    </button>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Grocery List'}
                    </button>
                    
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={handleCalculate}
                      disabled={calculating}
                    >
                      <i className="fas fa-calculator"></i>
                      {calculating ? 'Calculating...' : 'Calculate & Send to Farmers'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Orders Section */}
          <div className="orders-section">
            <h2>Your Orders</h2>
            
            {orders.length === 0 ? (
              <div className="no-data">
                <i className="fas fa-shopping-cart"></i>
                <h3>No orders with logistics options yet</h3>
                <p>When logistics partners add their charges to your confirmed orders, they will appear here for you to select.</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.apartmentId} className="order-card">
                    <div className="card-header">
                      <h3>Apartment {order.apartmentId}</h3>
                      <div className="status-info">
                        <span className="status confirmed">Confirmed</span>
                        <span className="farmer-cost">Farmer Cost: ${order.farmerCost}</span>
                      </div>
                    </div>
                    
                    <div className="items-list">
                      <h4>Grocery Items:</h4>
                      {order.totalItems.map((item, index) => (
                        <div key={index} className="item-row">
                          <span className="item-name">{item.item}</span>
                          <span className="item-quantity">{item.totalQuantity} units</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="logistics-section">
                      <h4>Logistics Options:</h4>
                      {order.logisticsCharges.length === 0 ? (
                        <p className="no-logistics">No logistics options available yet. Please wait for logistics partners to add their charges.</p>
                      ) : (
                        <div className="logistics-options">
                          {order.logisticsCharges.map((logistics, index) => (
                            <div key={index} className={`logistics-option ${logistics.selected ? 'selected' : ''}`}>
                              <div className="logistics-info">
                                <div className="logistics-name">{logistics.logisticsName}</div>
                                <div className="logistics-charge">Charge: ${logistics.charge}</div>
                                <div className="total-cost">
                                  Total Cost: ${order.farmerCost + logistics.charge}
                                </div>
                              </div>
                              
                              {!logistics.selected && !order.selectedLogistics && (
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleSelectLogistics(order.apartmentId, logistics.logisticsId)}
                                  disabled={selecting[order.apartmentId]}
                                >
                                  {selecting[order.apartmentId] ? 'Selecting...' : 'Select This Partner'}
                                </button>
                              )}
                              
                              {logistics.selected && (
                                <div className="selected-badge">
                                  <i className="fas fa-check-circle"></i>
                                  Selected
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {order.selectedLogistics && (
                      <div className="selected-logistics">
                        <h4>Selected Logistics Partner:</h4>
                        <div className="selected-info">
                          <div className="partner-name">{order.selectedLogistics.logisticsName}</div>
                          <div className="partner-charge">Charge: ${order.selectedLogistics.charge}</div>
                          <div className="total-cost">Total Cost: ${order.farmerCost + order.selectedLogistics.charge}</div>
                          <div className="contact-info">
                            Contact: {order.selectedLogistics.logisticsPhone}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsumerDashboard; 