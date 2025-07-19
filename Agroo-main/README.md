# Grocery Management System

A comprehensive full-stack web application for managing grocery orders, logistics, and user interactions in a multi-tenant apartment system.

## 🚀 Features

### Core Functionality
- **Multi-User Authentication**: Separate dashboards for Consumers, Farmers, and Logistics partners
- **Grocery Order Management**: Complete order lifecycle from creation to delivery
- **Real-time Order Tracking**: Visual timeline with status updates
- **Logistics Integration**: Partner selection and delivery coordination
- **Rating & Review System**: Consumer feedback for logistics services
- **Analytics Dashboard**: Performance metrics and insights
- **Search & Filter**: Advanced filtering for grocery items
- **Profile Management**: User profile updates and management

### User Roles

#### 👤 Consumer
- Browse and order groceries
- Track order status in real-time
- Rate logistics services after delivery
- View order history and analytics
- Search and filter grocery items

#### 👨‍🌾 Farmer
- Manage grocery inventory
- Confirm and process orders
- View order analytics and performance
- Update product information

#### 🚚 Logistics Partner
- Receive delivery requests
- Update delivery status
- View ratings and reviews
- Manage delivery schedules

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling with gradients and animations
- **Axios** - HTTP client for API communication
- **Font Awesome** - Icon library for UI elements

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database Models
- **TotalGrocery** - Order management and tracking
- **signinConsumer** - Consumer user accounts
- **signinFarmer** - Farmer user accounts
- **signinLogistics** - Logistics partner accounts
- **GroceryList** - Individual grocery items

## 📁 Project Structure

```
Project-3/
├── backend/
│   ├── models/
│   │   ├── GroceryList.js
│   │   ├── signinConsumer.js
│   │   ├── signinFarmer.js
│   │   ├── signinLogistics.js
│   │   └── TotalGrocery.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── ConsumerDashboard.jsx
│   │   │   ├── FarmerDashboard.jsx
│   │   │   ├── GroceryList.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── LogisticsDashboard.jsx
│   │   │   ├── LogisticsForm.jsx
│   │   │   ├── LogisticsRating.jsx
│   │   │   ├── LogisticsRatingDisplay.jsx
│   │   │   ├── LoginConsumer.jsx
│   │   │   ├── LoginFarmer.jsx
│   │   │   ├── LoginLogistics.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrderTracking.jsx
│   │   │   ├── SearchFilter.jsx
│   │   │   ├── SigninConsumer.jsx
│   │   │   ├── SigninFarmer.jsx
│   │   │   ├── SigninLogistics.jsx
│   │   │   └── TotalGrocery.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure MongoDB connection:**
   - Update the MongoDB connection string in `server.js`
   - Default: `mongodb://localhost:27017/grocery-system`

4. **Start the backend server:**
   ```bash
   node server.js
   ```
   - Server runs on `http://localhost:3001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   - Frontend runs on `http://localhost:5173`

## 🔧 API Endpoints

### Authentication
- `POST /api/consumer/signin` - Consumer login
- `POST /api/farmer/signin` - Farmer login
- `POST /api/logistics/signin` - Logistics login
- `POST /api/consumer/signup` - Consumer registration
- `POST /api/farmer/signup` - Farmer registration
- `POST /api/logistics/signup` - Logistics registration

### Order Management
- `GET /api/grocery-items` - Get all grocery items
- `POST /api/grocery-items` - Add new grocery item
- `GET /api/user-orders` - Get user orders for tracking
- `POST /api/submit-order` - Submit new order

### Logistics
- `POST /api/logistics-form` - Submit logistics form
- `GET /api/logistics-partners` - Get available logistics partners
- `POST /api/select-logistics` - Select logistics partner

### Ratings & Reviews
- `POST /api/submit-rating` - Submit logistics rating
- `GET /api/logistics-ratings/:logisticsId` - Get logistics ratings
- `GET /api/all-logistics-ratings` - Get all ratings (admin)

### Analytics & Profile
- `GET /api/analytics` - Get analytics data
- `PUT /api/update-profile` - Update user profile
- `GET /api/user-profile` - Get user profile

## 🎨 UI Components

### Core Components
- **Navbar** - Navigation with role-based links
- **Home** - Landing page with user type selection
- **Login/Signin** - Authentication forms for each user type
- **Dashboard** - Role-specific dashboards with key metrics

### Order Management
- **GroceryList** - Grocery item management
- **TotalGrocery** - Order summary and processing
- **OrderTracking** - Real-time order status with timeline
- **LogisticsForm** - Logistics partner registration

### Advanced Features
- **SearchFilter** - Advanced search and filtering
- **AnalyticsDashboard** - Performance metrics and charts
- **LogisticsRating** - Rating submission form
- **LogisticsRatingDisplay** - Ratings and reviews display

## 🔐 Security Features

- **Password Hashing**: bcrypt encryption for all passwords
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing
- **Error Handling**: Comprehensive error handling and logging

## 📊 Key Features Explained

### Order Tracking System
- Real-time status updates
- Visual timeline with icons
- Delivery confirmation
- Logistics partner integration

### Rating System
- Multi-category ratings (delivery speed, service quality, etc.)
- Star-based rating interface
- Review text submission
- Statistics and analytics

### Analytics Dashboard
- Order growth metrics
- Revenue tracking
- User engagement statistics
- Performance indicators

### Search & Filter
- Advanced filtering options
- Category-based search
- Price range filtering
- Real-time search results

## 🎯 Usage Instructions

### For Consumers
1. Register/Login as a consumer
2. Browse grocery items and add to cart
3. Submit order and select logistics partner
4. Track order status in real-time
5. Rate logistics service after delivery

### For Farmers
1. Register/Login as a farmer
2. Manage grocery inventory
3. Process incoming orders
4. Update order status
5. View analytics and performance

### For Logistics Partners
1. Register/Login as logistics partner
2. Receive delivery requests
3. Update delivery status
4. View ratings and reviews
5. Manage delivery schedules

## 🐛 Troubleshooting

### Common Issues

1. **PowerShell Command Issues**
   - Use separate commands instead of `&&`
   - Example: `cd backend` then `node server.js`

2. **MongoDB Connection**
   - Ensure MongoDB is running
   - Check connection string in server.js

3. **Port Conflicts**
   - Backend: Change port in server.js
   - Frontend: Change port in vite.config.js

4. **Module Not Found Errors**
   - Run `npm install` in both directories
   - Check package.json for missing dependencies

### Debug Features
- Console logging for API calls
- Visual debug indicators in UI
- Error handling with user-friendly messages

## 🔄 Development Workflow

1. **Backend Development**
   - Add new API endpoints in `server.js`
   - Create/update models in `models/` directory
   - Test endpoints with Postman or similar

2. **Frontend Development**
   - Create new components in `src/components/`
   - Add corresponding CSS files
   - Update routing in `App.jsx`

3. **Database Changes**
   - Update Mongoose schemas
   - Handle data migrations
   - Test with sample data

## 📈 Future Enhancements

- **Real-time Notifications**: WebSocket integration
- **Payment Integration**: Stripe/PayPal integration
- **Mobile App**: React Native version
- **Advanced Analytics**: Machine learning insights
- **Inventory Management**: Automated stock tracking
- **Delivery Optimization**: Route optimization algorithms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ using React, Node.js, and MongoDB** 