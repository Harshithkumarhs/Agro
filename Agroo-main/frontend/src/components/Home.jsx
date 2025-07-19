import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    // Navigate to the appropriate signin page based on role
    if (role === 'consumer') {
      navigate('/signinConsumer');
    } else if (role === 'logistics') {
      navigate('/signinLogistics');
    } else if (role === 'farmer') {
      navigate('/signinFarmer');
    }
  };

  return (
    <div className="home-container">
      <div className="container text-center">
        <h1 className="main-title animate__animated animate__fadeInDown">
          Welcome to FarmConnect
        </h1>
        
        <div className="quote-section animate__animated animate__fadeIn animate__delay-1s">
          <p className="mb-0">
            "Agriculture is our wisest pursuit, because it will in the end contribute most to real wealth, good morals & happiness."
          </p>
          <small>- Thomas Jefferson</small>
        </div>
        
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card p-4 animate__animated animate__fadeInUp animate__delay-1s">
              <div className="role-description">
                <p>
                  Join our community and be part of the sustainable agriculture movement. Select your role to begin:
                </p>
              </div>
              
              <div className="d-grid gap-3">
                <button 
                  className="btn btn-consumer"
                  onClick={() => handleRoleSelection('consumer')}
                >
                  <i className="fas fa-shopping-cart me-2"></i>Consumer
                </button>
                
                <button 
                  className="btn btn-logistics"
                  onClick={() => handleRoleSelection('logistics')}
                >
                  <i className="fas fa-truck me-2"></i>Logistics Partner
                </button>
                
                <button 
                  className="btn btn-farmer"
                  onClick={() => handleRoleSelection('farmer')}
                >
                  <i className="fas fa-tractor me-2"></i>Farmer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 