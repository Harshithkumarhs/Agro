require('dotenv').config();
const mongoose = require('mongoose');

// Test MongoDB Atlas connection
async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set in your .env file');
      console.log('📝 Please create a .env file with your MongoDB Atlas connection string');
      console.log('📖 See MONGODB_ATLAS_SETUP.md for detailed instructions');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });

    console.log('✅ MongoDB Atlas connection successful!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port);

    // Test creating a collection
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Write test successful!');

    // Clean up test data
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Read/Delete test successful!');

    await mongoose.disconnect();
    console.log('✅ All tests passed! MongoDB Atlas is ready to use.');

  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your MONGODB_URI in .env file');
    console.log('2. Verify your username and password');
    console.log('3. Ensure your IP is whitelisted in Atlas');
    console.log('4. Check if your cluster is running');
    console.log('5. Verify network connectivity');
  }
}

// Run the test
testConnection(); 