import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LogisticsDashboard.css';
import Navbar from './Navbar';

const LogisticsDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalRatings: 0,
    totalOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState({});
  const [charges, setCharges] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get user info from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        setError('User not found');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const logisticsId = user._id || user.id;

      // Fetch orders and ratings
      const [ordersResponse, ratingsResponse] = await Promise.all([
        axios.get('http://localhost:3001/api/logistics-dashboard'),
        axios.get(`http://localhost:3001/api/logistics-ratings/${logisticsId}`)
      ]);

      setOrders(ordersResponse.data);
      setRatings(ratingsResponse.data.ratings);
      setStats({
        ...ratingsResponse.data.stats,
        totalOrders: ordersResponse.data.length,
        completedOrders: ordersResponse.data.filter(order => order.status === 'Delivered').length
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const handleAddCharge = async (apartmentId) => {
    setSubmitting(prev => ({ ...prev, [apartmentId]: true }));
    
    try {
      const charge = charges[apartmentId];
      if (!charge || charge <= 0) {
        alert('Please enter a valid charge amount');
        return;
      }

      // Get current user info (in a real app, this would come from auth context)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      await axios.post(`http://localhost:3001/api/add-logistics-charge/${apartmentId}`, {
        logisticsId: user.logistics?._id || 'logistics-1',
        logisticsName: user.logistics?.name || 'Logistics Partner',
        logisticsPhone: user.logistics?.phone || '+918867337907',
        charge: Number(charge)
      });
      
      // Refresh the data after adding charge
      await fetchDashboardData();
      
      // Clear the charge input
      setCharges(prev => ({ ...prev, [apartmentId]: '' }));
      
      alert(`Logistics charge of $${charge} added successfully for apartment ${apartmentId}`);
    } catch (err) {
      alert('Error adding logistics charge. Please try again.');
    } finally {
      setSubmitting(prev => ({ ...prev, [apartmentId]: false }));
    }
  };

  const handleChargeChange = (apartmentId, charge) => {
    setCharges(prev => ({
      ...prev,
      [apartmentId]: charge
    }));
  };

  const renderStars = (rating) => {
    return (
      <div className="star-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#ff9800';
      case 'Confirmed':
        return '#4CAF50';
      case 'In Progress':
        return '#2196F3';
      case 'Delivered':
        return '#4CAF50';
      case 'Cancelled':
        return '#f44336';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <div className="logistics-dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="logistics-dashboard-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar userType="logistics" />
      <div className="logistics-dashboard-container">
        <div className="container">
          <div className="header-section">
            <h1>Logistics Dashboard</h1>
            <p>Manage your delivery services and track performance</p>
          </div>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-truck"></i>
              </div>
              <div className="stat-content">
                <h3>Total Orders</h3>
                <p className="stat-value">{stats.totalOrders}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <h3>Completed Orders</h3>
                <p className="stat-value">{stats.completedOrders}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-star"></i>
              </div>
              <div className="stat-content">
                <h3>Average Rating</h3>
                <div className="rating-display">
                  {renderStars(Math.round(stats.averageRating))}
                  <span className="rating-score">{stats.averageRating.toFixed(1)}/5</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <h3>Total Reviews</h3>
                <p className="stat-value">{stats.totalRatings}</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="orders-section">
            <h2>Recent Orders</h2>
            {orders.length === 0 ? (
              <div className="no-orders">
                <i className="fas fa-clipboard-list"></i>
                <h3>No orders yet</h3>
                <p>Orders will appear here when customers select your service</p>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map((order, index) => (
                  <div key={index} className="order-card">
                    <div className="order-header">
                      <h3>Order #{order._id?.slice(-6) || index + 1}</h3>
                      <div 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="order-details">
                      <div className="detail-row">
                        <span className="label">Apartment:</span>
                        <span className="value">{order.apartmentId}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Items:</span>
                        <span className="value">{order.totalItems?.length || 0}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Farmer Cost:</span>
                        <span className="value">${order.farmerCost || 0}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Your Charge:</span>
                        <span className="value">${order.logisticsCharges?.[0]?.charge || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="reviews-section">
            <h2>Recent Reviews</h2>
            {ratings.length === 0 ? (
              <div className="no-reviews">
                <i className="fas fa-comments"></i>
                <h3>No reviews yet</h3>
                <p>Customer reviews will appear here after service completion</p>
              </div>
            ) : (
              <div className="reviews-grid">
                {ratings.slice(0, 5).map((rating, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          <i className="fas fa-user"></i>
                        </div>
                        <div className="reviewer-details">
                          <h4>Customer {rating.customerId?.slice(-4) || 'Anonymous'}</h4>
                          <span className="review-date">
                            {new Date(rating.ratingDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="review-rating">
                        {renderStars(rating.overallRating)}
                        <span className="rating-score">{rating.overallRating}/5</span>
                      </div>
                    </div>

                    {rating.review && (
                      <div className="review-text">
                        <p>{rating.review}</p>
                      </div>
                    )}

                    <div className="category-breakdown">
                      <div className="category-item">
                        <span>Speed</span>
                        {renderStars(rating.categoryRatings.deliverySpeed)}
                      </div>
                      <div className="category-item">
                        <span>Quality</span>
                        {renderStars(rating.categoryRatings.serviceQuality)}
                      </div>
                      <div className="category-item">
                        <span>Communication</span>
                        {renderStars(rating.categoryRatings.communication)}
                      </div>
                      <div className="category-item">
                        <span>Packaging</span>
                        {renderStars(rating.categoryRatings.packaging)}
                      </div>
                    </div>
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

export default LogisticsDashboard; 