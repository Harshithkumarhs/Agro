import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LogisticsRatingDisplay.css';

const LogisticsRatingDisplay = ({ logisticsId, logisticsName }) => {
  const [ratings, setRatings] = useState([]);
  const [overallStats, setOverallStats] = useState({
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    categoryAverages: {
      deliverySpeed: 0,
      serviceQuality: 0,
      communication: 0,
      packaging: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRatings();
  }, [logisticsId]);

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/logistics-ratings/${logisticsId}`);
      setRatings(response.data.ratings);
      setOverallStats(response.data.stats);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch ratings');
      setLoading(false);
    }
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

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#4CAF50';
    if (rating >= 3.5) return '#FF9800';
    if (rating >= 2.5) return '#FFC107';
    return '#f44336';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="rating-display-container">
        <div className="loading">Loading ratings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rating-display-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="rating-display-container">
      <div className="container">
        <div className="header-section">
          <h1>Logistics Ratings & Reviews</h1>
          <p>Customer feedback for {logisticsName}</p>
        </div>

        {/* Overall Statistics */}
        <div className="stats-section">
          <div className="overall-stats">
            <div className="main-rating">
              <div className="rating-number" style={{ color: getRatingColor(overallStats.averageRating) }}>
                {overallStats.averageRating.toFixed(1)}
              </div>
              <div className="rating-stars">
                {renderStars(Math.round(overallStats.averageRating))}
              </div>
              <div className="rating-count">
                Based on {overallStats.totalRatings} reviews
              </div>
            </div>

            <div className="rating-distribution">
              <h3>Rating Distribution</h3>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="distribution-row">
                  <span className="star-label">{star} stars</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${overallStats.totalRatings > 0 ? (overallStats.ratingDistribution[star] / overallStats.totalRatings) * 100 : 0}%`,
                        backgroundColor: getRatingColor(star)
                      }}
                    ></div>
                  </div>
                  <span className="count">{overallStats.ratingDistribution[star]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="category-stats">
            <h3>Category Averages</h3>
            <div className="category-grid">
              <div className="category-item">
                <label>Delivery Speed</label>
                <div className="category-rating">
                  {renderStars(Math.round(overallStats.categoryAverages.deliverySpeed))}
                  <span className="category-score">
                    {overallStats.categoryAverages.deliverySpeed.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="category-item">
                <label>Service Quality</label>
                <div className="category-rating">
                  {renderStars(Math.round(overallStats.categoryAverages.serviceQuality))}
                  <span className="category-score">
                    {overallStats.categoryAverages.serviceQuality.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="category-item">
                <label>Communication</label>
                <div className="category-rating">
                  {renderStars(Math.round(overallStats.categoryAverages.communication))}
                  <span className="category-score">
                    {overallStats.categoryAverages.communication.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="category-item">
                <label>Packaging</label>
                <div className="category-rating">
                  {renderStars(Math.round(overallStats.categoryAverages.packaging))}
                  <span className="category-score">
                    {overallStats.categoryAverages.packaging.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {ratings.length === 0 ? (
            <div className="no-reviews">
              <i className="fas fa-comments"></i>
              <h3>No reviews yet</h3>
              <p>Be the first to review this logistics service!</p>
            </div>
          ) : (
            <div className="reviews-grid">
              {ratings.map((rating, index) => (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="reviewer-details">
                        <h4>Customer {rating.customerId?.slice(-4) || 'Anonymous'}</h4>
                        <span className="review-date">{formatDate(rating.ratingDate)}</span>
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
  );
};

export default LogisticsRatingDisplay; 