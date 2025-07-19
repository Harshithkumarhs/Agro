# MongoDB Atlas Setup Guide

## 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient for development)

## 2. Configure Database Access
1. In your Atlas dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Create a username and password (save these securely)
4. Set privileges to "Read and write to any database"

## 3. Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific IP addresses

## 4. Get Connection String
1. Go to "Clusters" in your dashboard
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string

## 5. Create .env File
Create a `.env` file in the backend directory with the following content:

```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database_name?retryWrites=true&w=majority

# Twilio Configuration (if using SMS features)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 6. Replace Placeholders
- Replace `your_username` with your MongoDB Atlas username
- Replace `your_password` with your MongoDB Atlas password
- Replace `your_cluster` with your actual cluster name
- Replace `your_database_name` with your desired database name

## 7. Install Dependencies
```bash
cd backend
npm install
```

## 8. Start the Server
```bash
npm start
```

## Connection String Format
Your MongoDB Atlas connection string should look like this:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database_name?retryWrites=true&w=majority
```

## Troubleshooting
1. **Connection Error**: Check your username, password, and cluster name
2. **Network Access**: Ensure your IP is whitelisted in Atlas
3. **Database User**: Verify the database user has proper permissions
4. **Connection String**: Make sure the connection string is properly formatted 