require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const seedUsers = async () => {
    try {
        await connectDB();

        console.log('Clearing existing users...');
        // Optional: clear existing users if you want a clean slate
        // await User.deleteMany({}); 

        const adminUser = {
            email: 'admin@school.com',
            password: 'admin123', // Will be hashed by pre-save hook
            role: 'admin',
            phone: '1234567890',
            name: 'Admin',
            isActive: true,
            // Add other required fields if any, based on schema defaults
        };

        const userExists = await User.findOne({ email: adminUser.email });

        if (userExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const user = await User.create(adminUser);
        console.log(`Admin user created: ${user.email} / admin123`);

        process.exit();
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
