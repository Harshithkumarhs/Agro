import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginConsumer from './components/LoginConsumer';
import SigninConsumer from './components/SigninConsumer';
import LoginFarmer from './components/LoginFarmer';
import SigninFarmer from './components/SigninFarmer';
import LoginLogistics from './components/LoginLogistics';
import SigninLogistics from './components/SigninLogistics';
import GroceryList from './components/GroceryList';
import TotalGrocery from './components/TotalGrocery';
import LogisticsForm from './components/LogisticsForm';
import FarmerDashboard from './components/FarmerDashboard';
import LogisticsDashboard from './components/LogisticsDashboard';
import ConsumerDashboard from './components/ConsumerDashboard';
import UserProfile from './components/UserProfile';
import OrderTracking from './components/OrderTracking';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SearchFilter from './components/SearchFilter';
import LogisticsRating from './components/LogisticsRating';
import LogisticsRatingDisplay from './components/LogisticsRatingDisplay';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loginConsumer" element={<LoginConsumer />} />
          <Route path="/signinConsumer" element={<SigninConsumer />} />
          <Route path="/loginFarmer" element={<LoginFarmer />} />
          <Route path="/signinFarmer" element={<SigninFarmer />} />
          <Route path="/loginLogistics" element={<LoginLogistics />} />
          <Route path="/signinLogistics" element={<SigninLogistics />} />
          <Route path="/grocery" element={<GroceryList />} />
          <Route path="/total-grocery" element={<TotalGrocery />} />
          <Route path="/logistics-form" element={<LogisticsForm />} />
          <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
          <Route path="/logistics-dashboard" element={<LogisticsDashboard />} />
          <Route path="/consumer-dashboard" element={<ConsumerDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/search" element={<SearchFilter />} />
          <Route path="/rate-logistics" element={<LogisticsRating />} />
          <Route path="/logistics-ratings/:logisticsId" element={<LogisticsRatingDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
