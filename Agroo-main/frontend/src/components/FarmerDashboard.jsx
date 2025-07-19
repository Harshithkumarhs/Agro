import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FarmerDashboard.css';
import Navbar from './Navbar';

const FarmerDashboard = () => {
  const [groceryData, setGroceryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState({});
  const [farmerCosts, setFarmerCosts] = useState({});

  useEffect(() => {
    fetchGroceryData();
  }, []);

  const fetchGroceryData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/total-grocery');
      setGroceryData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch grocery data');
      setLoading(false);
    }
  };

  const handleConfirm = async (apartmentId, canSupply) => {
    setConfirming(prev => ({ ...prev, [apartmentId]: true }));
    
    try {
      const farmerCost = canSupply ? farmerCosts[apartmentId] || 0 : 0;
      
      await axios.post(`http://localhost:3001/api/confirm-farmer/${apartmentId}`, {
        canSupply,
        farmerCost
      });
      
      // Refresh the data after confirmation
      await fetchGroceryData();
      
      // Show success message
      alert(`Successfully ${canSupply ? 'confirmed' : 'rejected'} grocery list for apartment ${apartmentId}`);
    } catch (err) {
      alert('Error confirming grocery list. Please try again.');
    } finally {
      setConfirming(prev => ({ ...prev, [apartmentId]: false }));
    }
  };

  const handleCostChange = (apartmentId, cost) => {
    setFarmerCosts(prev => ({
      ...prev,
      [apartmentId]: cost
    }));
  };

  if (loading) {
    return (
      <div className="farmer-dashboard-container">
        <div className="loading">Loading grocery lists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="farmer-dashboard-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar userType="farmer" />
      <div className="farmer-dashboard-container">
        <div className="container">
          <div className="header-section">
            <h1>Farmer Dashboard</h1>
            <p>Review and confirm grocery requests from consumers</p>
          </div>
          
          {Object.keys(groceryData).length === 0 ? (
            <div className="no-data">
              <i className="fas fa-shopping-basket"></i>
              <h3>No grocery requests yet</h3>
              <p>When consumers submit grocery lists, they will appear here for your review.</p>
            </div>
          ) : (
            <div className="grocery-lists">
              {Object.entries(groceryData).map(([apartmentId, items]) => (
                <div key={apartmentId} className="grocery-card">
                  <div className="card-header">
                    <h3>Apartment {apartmentId}</h3>
                    <span className="item-count">{items.length} items</span>
                  </div>
                  
                  <div className="items-list">
                    {items.map((item, index) => (
                      <div key={index} className="item-row">
                        <span className="item-name">{item.item}</span>
                        <span className="item-quantity">{item.totalQuantity} units</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="card-actions">
                    <div className="cost-input-section mb-3">
                      <label htmlFor={`cost-${apartmentId}`} className="cost-label">
                        Cost (USD):
                      </label>
                      <input
                        type="number"
                        id={`cost-${apartmentId}`}
                        className="cost-input"
                        placeholder="Enter cost"
                        value={farmerCosts[apartmentId] || ''}
                        onChange={(e) => handleCostChange(apartmentId, e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="action-buttons">
                      <button
                        className="btn btn-success"
                        onClick={() => handleConfirm(apartmentId, true)}
                        disabled={confirming[apartmentId] || !farmerCosts[apartmentId]}
                      >
                        {confirming[apartmentId] ? 'Confirming...' : 'Confirm Supply'}
                      </button>
                      
                      <button
                        className="btn btn-danger"
                        onClick={() => handleConfirm(apartmentId, false)}
                        disabled={confirming[apartmentId]}
                      >
                        {confirming[apartmentId] ? 'Rejecting...' : 'Cannot Supply'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmerDashboard; 