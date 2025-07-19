# Grocery App Backend

This is the backend server for the Grocery Management Application, configured to work with MongoDB Atlas.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up MongoDB Atlas
1. Follow the instructions in `MONGODB_ATLAS_SETUP.md`
2. Create a `.env` file with your MongoDB Atlas connection string

### 3. Test Connection
```bash
npm run test:connection
```

### 4. Start the Server
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## 📁 Project Structure

```
backend/
├── models/                 # MongoDB schemas
│   ├── GroceryList.js     # Grocery list schema
│   ├── TotalGrocery.js    # Aggregated grocery data
│   ├── signinConsumer.js  # Consumer user schema
│   ├── signinFarmer.js    # Farmer user schema
│   └── signinLogistics.js # Logistics user schema
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── setup-mongodb-atlas.js # Connection test script
├── MONGODB_ATLAS_SETUP.md # Atlas setup guide
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables (.env file)
```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Twilio Configuration (optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 📊 Database Models

### Consumer
- `name`: String (required)
- `phone`: String (required, unique)
- `apartment`: String (required)
- `password`: String (required, hashed)

### Farmer
- `name`: String (required)
- `password`: String (required, hashed)

### Logistics
- `name`: String (required)
- `phone`: String (required)
- `location`: String (required)
- `password`: String (required, hashed)
- `vehicleType`: String (optional)
- `capacity`: Number (optional)
- `isAvailable`: Boolean (default: true)

### GroceryList
- `apartmentId`: String
- `houseId`: String
- `groceryItems`: Array of items with quantity and cost
- `status`: String (default: 'Pending')

### TotalGrocery
- `apartmentId`: String
- `totalItems`: Array of aggregated items
- `status`: String (default: 'Pending')
- `farmerCost`: Number
- `logisticsCharges`: Array of logistics options
- `selectedLogistics`: Object with selected logistics info

## 🔌 API Endpoints

### Authentication
- `POST /signinConsumer` - Consumer registration
- `POST /loginConsumer` - Consumer login
- `POST /signinFarmer` - Farmer registration
- `POST /loginFarmer` - Farmer login
- `POST /signinLogistics` - Logistics registration
- `POST /loginLogistics` - Logistics login

### Grocery Management
- `POST /submit-grocery` - Submit grocery list
- `GET /generate-total-grocery` - Generate aggregated grocery list
- `POST /confirm-farmer/:apartmentId` - Farmer confirmation

### React Frontend APIs
- `GET /api/consumer-orders` - Get consumer orders
- `GET /api/farmer-orders` - Get farmer orders
- `GET /api/logistics-orders` - Get logistics orders
- `GET /api/analytics` - Get analytics data
- `POST /api/submit-rating` - Submit logistics rating
- `GET /api/logistics-ratings/:logisticsId` - Get logistics ratings

## 🛠️ Troubleshooting

### Connection Issues
1. **Check .env file**: Ensure MONGODB_URI is set correctly
2. **Test connection**: Run `npm run test:connection`
3. **Verify Atlas settings**: Check network access and database user permissions
4. **Check credentials**: Verify username and password in connection string

### Common Errors
- **MongoServerError: Authentication failed**: Check username/password
- **MongoServerError: Network timeout**: Check network access in Atlas
- **MongoParseError: Invalid connection string**: Verify connection string format

## 🔒 Security Features

- Password hashing with bcrypt
- Input validation
- CORS enabled for frontend
- Environment variable configuration
- Error handling and logging

## 📱 Frontend Integration

The backend is configured to work with the React frontend. Make sure the frontend is making requests to the correct backend URL (default: `http://localhost:3001`).

## 🚀 Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use a production MongoDB Atlas cluster
3. Configure proper CORS settings
4. Set up environment variables securely
5. Use a process manager like PM2

## 📝 License

This project is licensed under the ISC License. 