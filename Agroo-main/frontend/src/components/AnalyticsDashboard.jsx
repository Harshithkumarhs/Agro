import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/analytics?range=${timeRange}`);
      setAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch analytics');
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="container">
        <div className="header-section">
          <h1>Analytics Dashboard</h1>
          <p>Track your performance and insights</p>
          <div className="time-range-selector">
            <button 
              className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Week
            </button>
            <button 
              className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Month
            </button>
            <button 
              className={`range-btn ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              Year
            </button>
          </div>
        </div>

        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="metric-content">
                  <h3>Total Orders</h3>
                  <p className="metric-value">{analytics.totalOrders}</p>
                  <span className={`metric-change ${analytics.orderGrowth >= 0 ? 'positive' : 'negative'}`}>
                    <i className={`fas fa-arrow-${analytics.orderGrowth >= 0 ? 'up' : 'down'}`}></i>
                    {Math.abs(analytics.orderGrowth)}%
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <div className="metric-content">
                  <h3>Total Revenue</h3>
                  <p className="metric-value">{formatCurrency(analytics.totalRevenue)}</p>
                  <span className={`metric-change ${analytics.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                    <i className={`fas fa-arrow-${analytics.revenueGrowth >= 0 ? 'up' : 'down'}`}></i>
                    {Math.abs(analytics.revenueGrowth)}%
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="metric-content">
                  <h3>Active Users</h3>
                  <p className="metric-value">{analytics.activeUsers}</p>
                  <span className={`metric-change ${analytics.userGrowth >= 0 ? 'positive' : 'negative'}`}>
                    <i className={`fas fa-arrow-${analytics.userGrowth >= 0 ? 'up' : 'down'}`}></i>
                    {Math.abs(analytics.userGrowth)}%
                  </span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">
                  <i className="fas fa-star"></i>
                </div>
                <div className="metric-content">
                  <h3>Average Rating</h3>
                  <p className="metric-value">{analytics.averageRating.toFixed(1)}</p>
                  <span className="metric-change positive">
                    <i className="fas fa-star"></i>
                    {analytics.ratingCount} reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
              <div className="chart-card">
                <h3>Order Trends</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-line"></i>
                  <p>Order volume over time</p>
                </div>
              </div>

              <div className="chart-card">
                <h3>Revenue Analysis</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-bar"></i>
                  <p>Revenue breakdown by category</p>
                </div>
              </div>
            </div>

            {/* Top Items */}
            <div className="top-items-section">
              <h3>Top Ordered Items</h3>
              <div className="items-list">
                {analytics.topItems?.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-rank">#{index + 1}</div>
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>{item.category}</p>
                    </div>
                    <div className="item-stats">
                      <span className="quantity">{item.quantity} units</span>
                      <span className="revenue">{formatCurrency(item.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="performance-section">
              <h3>Performance Metrics</h3>
              <div className="metrics-grid-small">
                <div className="performance-card">
                  <h4>Order Completion Rate</h4>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${analytics.completionRate * 100}%` }}
                    ></div>
                  </div>
                  <p>{formatPercentage(analytics.completionRate)}</p>
                </div>

                <div className="performance-card">
                  <h4>Customer Satisfaction</h4>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${analytics.satisfactionRate * 100}%` }}
                    ></div>
                  </div>
                  <p>{formatPercentage(analytics.satisfactionRate)}</p>
                </div>

                <div className="performance-card">
                  <h4>Average Delivery Time</h4>
                  <p className="delivery-time">{analytics.avgDeliveryTime} hours</p>
                </div>

                <div className="performance-card">
                  <h4>Return Rate</h4>
                  <p className="return-rate">{formatPercentage(analytics.returnRate)}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 