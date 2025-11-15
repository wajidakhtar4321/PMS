const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Note: useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pms_mobiloitte');

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📍 Database Host: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('\n🔍 Troubleshooting Steps:');
    console.error('1. Check if MongoDB is running: mongod --version');
    console.error('2. Start MongoDB: brew services start mongodb-community');
    console.error('3. Or start manually: mongod --config /usr/local/etc/mongod.conf');
    console.error('4. Verify connection string in .env file\n');
    process.exit(1);
  }
};

module.exports = { connectDB };
