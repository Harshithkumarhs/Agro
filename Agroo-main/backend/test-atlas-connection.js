require('dotenv').config();
const mongoose = require('mongoose');

async function testAtlasConnection() {
  console.log('🔍 Testing MongoDB Atlas connection...');
  console.log('📋 Environment check:');
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in your .env file!');
    console.log('📝 Please create a .env file in the backend directory with:');
    console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.<cluster-id>.mongodb.net/<database-name>?retryWrites=true&w=majority');
    process.exit(1);
  }

  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Connection details:');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Port: ${mongoose.connection.port}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error('   Error:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Possible solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify your MongoDB Atlas cluster is running');
      console.log('   3. Check your connection string format');
    } else if (error.message.includes('Authentication failed')) {
      console.log('💡 Authentication failed. Check:');
      console.log('   1. Username and password in connection string');
      console.log('   2. Database user permissions in Atlas');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 Connection refused. Check:');
      console.log('   1. Network access settings in Atlas');
      console.log('   2. IP whitelist in Atlas');
    }
    
    process.exit(1);
  }
}

// Run the test
testAtlasConnection(); 