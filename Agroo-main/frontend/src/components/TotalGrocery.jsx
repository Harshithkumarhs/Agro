import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TotalGrocery.css';
import Navbar from './Navbar';

const TotalGrocery = () => {
  const [groceryData, setGroceryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState({});

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
      const response = await axios.post(`http://localhost:3001/api/confirm-farmer/${apartmentId}`, {
        canSupply
      });
      
      // Refresh the data after confirmation
      await fetchGroceryData();
      
      // Show success message with SMS status
      const smsStatus = response.data.smsSent ? 'SMS notification sent.' : 'SMS notification failed, but confirmation saved.';
      alert(`Successfully ${canSupply ? 'confirmed' : 'rejected'} grocery list for apartment ${apartmentId}. ${smsStatus}`);
    } catch (err) {
      console.error('Error confirming grocery list:', err);
      let errorMessage = 'Error confirming grocery list. Please try again.';
      
      if (err.response && err.response.data && err.response.data.errorMessage) {
        errorMessage = err.response.data.errorMessage;
      }
      
      alert(errorMessage);
    } finally {
      setConfirming(prev => ({ ...prev, [apartmentId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="total-grocery-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="total-grocery-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar userType="farmer" />
      <div className="total-grocery-container">
        <div className="container">
          <h1>Total Grocery List</h1>
          <p className="subtitle">Review and confirm grocery requests from consumers</p>
          
          {Object.keys(groceryData).length === 0 ? (
            <div className="no-data">
              <i className="fas fa-shopping-basket"></i>
              <h3>No grocery requests yet</h3>
              <p>When consumers submit grocery lists, they will appear here for your review.</p>
            </div>
          ) : (
            <div className="grocery-list">
              {Object.entries(groceryData).map(([apartmentId, items]) => (
                <div key={apartmentId} className="grocery-item">
                  <div className="item-header">
                    <h3>Apartment {apartmentId}</h3>
                    <span className="item-count">{items.length} items</span>
                  </div>
                  
                  <div className="items-details">
                    {items.map((item, index) => (
                      <div key={index} className="item-row">
                        <span className="item-name"><strong>{item.item}</strong></span>
                        <span className="item-quantity">Quantity: {item.totalQuantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="confirmation-buttons">
                    <button
                      className="btn btn-success"
                      onClick={() => handleConfirm(apartmentId, true)}
                      disabled={confirming[apartmentId]}
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
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TotalGrocery; 