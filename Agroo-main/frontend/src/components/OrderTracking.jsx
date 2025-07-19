import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogisticsRating from './LogisticsRating';
import './OrderTracking.css';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [logisticsRatings, setLogisticsRatings] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/user-orders');
      console.log('Fetched orders:', response.data);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const fetchLogisticsRating = async (logisticsId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/logistics-ratings/${logisticsId}`);
      setLogisticsRatings(prev => ({
        ...prev,
        [logisticsId]: response.data.stats
      }));
    } catch (err) {
      console.error('Failed to fetch logistics rating:', err);
    }
  };

  const handleRateOrder = (order) => {
    console.log('Rating order:', order);
    alert('Rating button clicked!'); // Debug alert
    setSelectedOrder(order);
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (ratingData) => {
    setShowRatingModal(false);
    setSelectedOrder(null);
    // Refresh orders to show updated status
    await fetchOrders();
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return 'fas fa-clock';
      case 'Confirmed':
        return 'fas fa-check-circle';
      case 'In Progress':
        return 'fas fa-truck';
      case 'Delivered':
        return 'fas fa-home';
      case 'Cancelled':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  const getTimelineSteps = (order) => {
    const steps = [
      { 
        title: 'Order Placed', 
        status: 'completed',
        icon: 'fas fa-shopping-cart',
        time: order.createdAt
      },
      { 
        title: 'Farmer Confirmed', 
        status: order.status === 'Confirmed' || order.status === 'In Progress' || order.status === 'Delivered' ? 'completed' : 'pending',
        icon: 'fas fa-user-tie',
        time: order.farmerConfirmedAt
      },
      { 
        title: 'Logistics Selected', 
        status: order.selectedLogistics ? 'completed' : 'pending',
        icon: 'fas fa-truck',
        time: order.logisticsSelectedAt
      },
      { 
        title: 'In Transit', 
        status: order.status === 'In Progress' || order.status === 'Delivered' ? 'completed' : 'pending',
        icon: 'fas fa-route',
        time: order.inTransitAt
      },
      { 
        title: 'Delivered', 
        status: order.status === 'Delivered' ? 'completed' : 'pending',
        icon: 'fas fa-home',
        time: order.deliveredAt
      }
    ];
    return steps;
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

  if (loading) {
    return (
      <div className="order-tracking-container">
        <div className="loading">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-tracking-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="order-tracking-container">
      <div className="container">
        <div className="header-section">
          <h1>Order Tracking</h1>
          <p>Track your grocery orders in real-time</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <i className="fas fa-shopping-bag"></i>
            <h3>No Orders Yet</h3>
            <p>Start by placing your first grocery order!</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    <i className={getStatusIcon(order.status)}></i>
                    {order.status}
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-row">
                    <span className="label">Apartment:</span>
                    <span className="value">{order.apartmentId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Total Items:</span>
                    <span className="value">{order.totalItems?.length || 0}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Farmer Cost:</span>
                    <span className="value">${order.farmerCost || 0}</span>
                  </div>
                  {order.selectedLogistics && (
                    <>
                      <div className="detail-row">
                        <span className="label">Logistics:</span>
                        <span className="value">{order.selectedLogistics.logisticsName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Logistics Rating:</span>
                        <span className="value">
                          {logisticsRatings[order.selectedLogistics.logisticsId] ? (
                            <div className="logistics-rating-display">
                              {renderStars(Math.round(logisticsRatings[order.selectedLogistics.logisticsId].averageRating))}
                              <span className="rating-text">
                                {logisticsRatings[order.selectedLogistics.logisticsId].averageRating.toFixed(1)}/5
                              </span>
                            </div>
                          ) : (
                            <button 
                              className="btn btn-small"
                              onClick={() => fetchLogisticsRating(order.selectedLogistics.logisticsId)}
                            >
                              <i className="fas fa-star"></i>
                              View Rating
                            </button>
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="timeline">
                  <h4>Order Timeline</h4>
                  <div className="timeline-steps">
                    {getTimelineSteps(order).map((step, index) => (
                      <div key={index} className={`timeline-step ${step.status}`}>
                        <div className="step-icon">
                          <i className={step.icon}></i>
                        </div>
                        <div className="step-content">
                          <h5>{step.title}</h5>
                          {step.time && (
                            <p>{new Date(step.time).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.totalItems && (
                  <div className="order-items">
                    <h4>Order Items</h4>
                    <div className="items-list">
                      {order.totalItems.map((item, index) => (
                        <div key={index} className="item">
                          <span className="item-name">{item.item}</span>
                          <span className="item-quantity">{item.totalQuantity} units</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="order-actions">
                  <button className="btn btn-primary">
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                  {order.status === 'Delivered' && order.selectedLogistics && (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleRateOrder(order)}
                    >
                      <i className="fas fa-star"></i>
                      Rate Service
                    </button>
                  )}
                  {/* Debug info */}
                  <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
                    Debug: Status={order.status}, Has Logistics={!!order.selectedLogistics}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rating Modal */}
        {showRatingModal && selectedOrder && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Rate Your Logistics Service</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowRatingModal(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <p>Rate your experience with <strong>{selectedOrder.selectedLogistics.logisticsName}</strong></p>
                <LogisticsRating 
                  orderId={selectedOrder._id}
                  logisticsId={selectedOrder.selectedLogistics.logisticsId}
                  onRatingSubmit={handleRatingSubmit}
                />
              </div>
            </div>
          </div>
        )}
        {/* Debug modal state */}
        <div style={{position: 'fixed', top: '10px', right: '10px', background: '#333', color: 'white', padding: '10px', fontSize: '12px', zIndex: 9999}}>
          Modal: {showRatingModal ? 'Open' : 'Closed'}, Selected: {selectedOrder ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking; 