import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ userType }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const getDashboardLink = () => {
    switch (userType) {
      case 'consumer':
        return <Link to="/consumer-dashboard">Consumer Dashboard</Link>;
      case 'farmer':
        return <Link to="/farmer-dashboard">Farmer Dashboard</Link>;
      case 'logistics':
        return <Link to="/logistics-dashboard">Logistics Dashboard</Link>;
      default:
        return <Link to="/">Home</Link>;
    }
  };

  const getAdditionalLinks = () => {
    switch (userType) {
      case 'consumer':
        return (
          <>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/order-tracking">Order Tracking</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </>
        );
      case 'farmer':
        return (
          <>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/analytics">Analytics</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </>
        );
      case 'logistics':
        return (
          <>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/analytics">Analytics</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Farm2Table</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li>{getDashboardLink()}</li>
        {getAdditionalLinks()}
        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar; 