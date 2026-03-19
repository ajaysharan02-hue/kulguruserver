const mongoose = require('mongoose');
const Role = require('../models/Role');
const connectDB = require('../config/database');

const dotenv = require('dotenv');

dotenv.config();


const roles = [
    {
        name: 'super_admin',
        displayName: 'Super Admin',
        description: 'Full access to all system resources',
        isSystem: true,
        permissions: [{ resource: '*', actions: ['*'] }]
    },
    {
        name: 'admin', // Alias for school_admin for backward compatibility
        displayName: 'Admin',
        description: 'Standard admin role',
        isSystem: true,
        permissions: [
            { resource: 'user', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'banner', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'inquire', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'program', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'notification', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'setting', actions: ['read', 'update'] },
        ]
    },
];

const seedRoles = async () => {
    try { 
        await connectDB();
        await Role.deleteMany(); // Clear existing roles
        console.log('Roles cleared');

        await Role.insertMany(roles);
        console.log('Roles seeded successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding roles:', error);
        process.exit(1);
    }
};

seedRoles();
