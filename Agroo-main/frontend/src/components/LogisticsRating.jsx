import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LogisticsRating.css';

const LogisticsRating = ({ orderId, logisticsId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [ratingCategories, setRatingCategories] = useState({
    deliverySpeed: 0,
    serviceQuality: 0,
    communication: 0,
    packaging: 0,
    overall: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleStarClick = (value) => {
    console.log('Star clicked:', value);
    setRating(value);
    setRatingCategories(prev => ({
      ...prev,
      overall: value
    }));
  };

  const handleCategoryRating = (category, value) => {
    setRatingCategories(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting rating:', { orderId, logisticsId, rating, categoryRatings, review });
    setIsSubmitting(true);
    setMessage('');

    try {
      const ratingData = {
        orderId,
        logisticsId,
        overallRating: rating,
        categoryRatings: ratingCategories,
        review,
        ratingDate: new Date().toISOString()
      };

      console.log('Sending rating data:', ratingData);
      const response = await axios.post('http://localhost:3001/api/submit-rating', ratingData);
      console.log('Rating response:', response.data);
      
      setMessage('Rating submitted successfully!');
      if (onRatingSubmit) {
        onRatingSubmit(response.data);
      }
      
      // Reset form
      setRating(0);
      setRatingCategories({
        deliverySpeed: 0,
        serviceQuality: 0,
        communication: 0,
        packaging: 0,
        overall: 0
      });
      setReview('');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Rating submission error:', error);
      setMessage('Error submitting rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value, onStarClick, onStarHover, onStarLeave) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (hoverRating || value) ? 'filled' : ''}`}
            onClick={() => {
              console.log('Star clicked:', star);
              onStarClick(star);
            }}
            onMouseEnter={() => onStarHover(star)}
            onMouseLeave={onStarLeave}
            style={{ cursor: 'pointer' }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="logistics-rating-container">
      <div className="rating-card">
        <div className="rating-header">
          <h2>Rate Your Logistics Service</h2>
          <p>Help us improve by sharing your experience</p>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rating-form" style={{border: '2px solid red'}}>
          {/* Overall Rating */}
          <div className="rating-section">
            <h3>Overall Experience</h3>
            <div className="overall-rating">
              {renderStars(
                rating,
                handleStarClick,
                (star) => setHoverRating(star),
                () => setHoverRating(0)
              )}
              <span className="rating-text">
                {rating === 0 ? 'Select rating' : `${rating} out of 5 stars`}
              </span>
            </div>
          </div>

          {/* Category Ratings */}
          <div className="category-ratings">
            <h3>Rate Specific Aspects</h3>
            
            <div className="rating-category">
              <label>Delivery Speed</label>
              {renderStars(
                ratingCategories.deliverySpeed,
                (value) => handleCategoryRating('deliverySpeed', value),
                () => {},
                () => {}
              )}
            </div>

            <div className="rating-category">
              <label>Service Quality</label>
              {renderStars(
                ratingCategories.serviceQuality,
                (value) => handleCategoryRating('serviceQuality', value),
                () => {},
                () => {}
              )}
            </div>

            <div className="rating-category">
              <label>Communication</label>
              {renderStars(
                ratingCategories.communication,
                (value) => handleCategoryRating('communication', value),
                () => {},
                () => {}
              )}
            </div>

            <div className="rating-category">
              <label>Packaging & Handling</label>
              {renderStars(
                ratingCategories.packaging,
                (value) => handleCategoryRating('packaging', value),
                () => {},
                () => {}
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="review-section">
            <label htmlFor="review">Additional Comments (Optional)</label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this logistics service..."
              rows="4"
            />
          </div>

          <div className="rating-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-star"></i>
                  Submit Rating
                </>
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => alert('Test button clicked!')}
              style={{marginLeft: '10px'}}
            >
              Test Button
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogisticsRating; 