/**
 * Central API Routes
 * Mounts all module routes under /api
 */
const express = require('express');
const router = express.Router();

// Auth & User
router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));

// Core modules: Banner, Inquire, Notification, Programs, Role, Settings
router.use('/banners', require('./bannerRoutes'));
router.use('/inquiries', require('./inquireRoutes'));
router.use('/notifications', require('./notificationRoutes'));
router.use('/programs', require('./programRoutes'));
router.use('/courses', require('./courseRoutes'));
router.use('/servicepatners', require('./servicepatnerRoutes'));
router.use('/roles', require('./roleRoutes'));
router.use('/settings', require('./settingRoutes'));

// Upload (for banners etc.)
router.use('/upload', require('./uploadRoutes'));

module.exports = router;
