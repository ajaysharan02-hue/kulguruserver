require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

/**
 * Production-Level Super Admin Seeder
 * Creates a super admin user with full system access
 * 
 * Usage:
 * node src/seed/createSuperAdmin.js
 * 
 * IMPORTANT: Change the default password after first login!
 */

const createSuperAdmin = async () => {
    try {
        await connectDB();

        console.log('🔧 Starting Super Admin Creation...\n');

        // Super Admin credentials
        const superAdminData = {
            email: 'superadmin@school.com',
            password: 'SuperAdmin@123', // CHANGE THIS AFTER FIRST LOGIN!
            role: 'super_admin',
            isActive: true,
            phone: '9876543210',
            name: 'Super Admin'
        };

        // Check if super admin already exists
        const existingUser = await User.findOne({ email: superAdminData.email });

        if (existingUser) {
            console.log('⚠️  Super Admin already exists!');
            console.log(`   Email: ${existingUser.email}`);
            console.log(`   Role: ${existingUser.role}`);
            console.log(`   Active: ${existingUser.isActive}`);
            console.log('\n✅ No action needed.\n');
            process.exit(0);
        }

        // Create super admin
        const superAdmin = await User.create(superAdminData);

        console.log('✅ Super Admin Created Successfully!\n');
        console.log('═══════════════════════════════════════');
        console.log('📧 Email:    ', superAdmin.email);
        console.log('🔑 Password: ', 'SuperAdmin@123');
        console.log('👤 Role:     ', superAdmin.role);
        console.log('✓  Active:   ', superAdmin.isActive);
        console.log('═══════════════════════════════════════\n');
        console.log('⚠️  IMPORTANT SECURITY NOTICE:');
        console.log('   1. Login with these credentials');
        console.log('   2. IMMEDIATELY change the password');
        console.log('   3. Never share these credentials');
        console.log('   4. Delete this seeder file in production\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating Super Admin:', error.message);
        process.exit(1);
    }
};

// Run the seeder
createSuperAdmin();
