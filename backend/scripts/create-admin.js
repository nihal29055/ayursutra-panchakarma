const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Practitioner = require('../models/Practitioner');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayursutra');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return existingAdmin;
    }

    // Create admin user
    const adminUser = new User({
      email: 'admin@ayursutra.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      emailVerified: true
    });

    await adminUser.save();
    console.log('Admin user created successfully:', adminUser.email);

    // Create admin practitioner profile
    const adminPractitioner = new Practitioner({
      userId: adminUser._id,
      firstName: 'Admin',
      lastName: 'User',
      title: 'Dr.',
      specializations: ['panchakarma', 'general_consultation'],
      qualifications: [{
        degree: 'BAMS (Bachelor of Ayurvedic Medicine and Surgery)',
        institution: 'All India Institute of Ayurveda',
        year: 2020,
        verified: true
      }],
      experience: {
        years: 5,
        description: 'Experienced Ayurvedic practitioner specializing in Panchakarma therapies'
      },
      contact: {
        phone: '+91-9876543210',
        email: 'admin@ayursutra.com',
        address: {
          street: '123 Ayurveda Street',
          city: 'New Delhi',
          state: 'Delhi',
          zipCode: '110001',
          country: 'India'
        }
      },
      bio: 'Senior Ayurvedic practitioner with extensive experience in Panchakarma therapies and patient management.',
      languages: ['hindi', 'english', 'sanskrit'],
      certifications: [{
        name: 'Panchakarma Specialist',
        issuingAuthority: 'Ministry of AYUSH',
        issueDate: new Date('2020-01-01'),
        certificateNumber: 'PK2020001',
        verified: true
      }],
      status: 'active'
    });

    await adminPractitioner.save();
    console.log('Admin practitioner profile created successfully');

    console.log('\nAdmin Credentials:');
    console.log('Email: admin@ayursutra.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    return adminUser;

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function
if (require.main === module) {
  createAdmin();
}

module.exports = { createAdmin };
