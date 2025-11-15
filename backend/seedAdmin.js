const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pms_mobiloitte', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected for seeding...');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin1212@gmail.com' });

    if (adminExists) {
      console.log('Admin user already exists!');
      console.log('Email: admin1212@gmail.com');
      console.log('Password: Admin@1234');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin1212@gmail.com',
      password: 'Admin@1234',
      role: 'admin',
      department: 'Administration',
      isActive: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('==================================');
    console.log('Email: admin1212@gmail.com');
    console.log('Password: Admin@1234');
    console.log('Role: admin');
    console.log('==================================');
    console.log('You can now login with these credentials!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
