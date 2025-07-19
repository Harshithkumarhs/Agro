import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchFilter.css';

const SearchFilter = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    'all',
    'vegetables',
    'fruits',
    'dairy',
    'bakery',
    'meat',
    'poultry',
    'seafood',
    'grains',
    'beverages',
    'snacks',
    'condiments'
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, selectedCategory, priceRange, sortBy]);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/grocery-items');
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = [...items];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item =>
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price range filter
    filtered = filtered.filter(item => {
      const cost = parseFloat(item.cost) || 0;
      return cost >= priceRange.min && cost <= priceRange.max;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.item.localeCompare(b.item);
        case 'price-low':
          return (parseFloat(a.cost) || 0) - (parseFloat(b.cost) || 0);
        case 'price-high':
          return (parseFloat(b.cost) || 0) - (parseFloat(a.cost) || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  };

  const handleAddToCart = (item) => {
    // Add to cart functionality
    console.log('Added to cart:', item);
  };

  const handleQuickView = (item) => {
    // Quick view functionality
    console.log('Quick view:', item);
  };

  if (loading) {
    return (
      <div className="search-filter-container">
        <div className="loading">Loading items...</div>
      </div>
    );
  }

  return (
    <div className="search-filter-container">
      <div className="container">
        <div className="header-section">
          <h1>Search & Filter</h1>
          <p>Find the perfect groceries for your needs</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="controls-section">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range:</label>
              <div className="price-range">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: parseFloat(e.target.value) || 0 })}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseFloat(e.target.value) || 100 })}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="category">Category</option>
              </select>
            </div>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>Showing {filteredItems.length} of {items.length} items</p>
          {searchTerm && (
            <span className="search-term">for "{searchTerm}"</span>
          )}
        </div>

        {/* Items Grid/List */}
        <div className={`items-container ${viewMode}`}>
          {filteredItems.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No items found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div key={index} className="item-card">
                <div className="item-image">
                  <i className="fas fa-shopping-basket"></i>
                </div>
                <div className="item-content">
                  <h3>{item.item}</h3>
                  <p className="category">{item.category}</p>
                  <p className="description">
                    Fresh {item.category} available for delivery
                  </p>
                  <div className="item-meta">
                    <span className="price">${item.cost || 0}</span>
                    <span className="quantity">Available: {item.quantity || 0}</span>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(item)}
                    >
                      <i className="fas fa-cart-plus"></i>
                      Add to Cart
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleQuickView(item)}
                    >
                      <i className="fas fa-eye"></i>
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredItems.length > 12 && (
          <div className="pagination">
            <button className="page-btn">
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="page-info">Page 1 of 1</span>
            <button className="page-btn">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter; 