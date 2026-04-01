const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation result handler – returns 400 with errors if validation fails
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

/** MongoId param validation (reusable) */
const mongoIdParam = (paramName = 'id') => [
    param(paramName).isMongoId().withMessage('Invalid ID'),
];

// ----- Auth -----
const registerValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .isIn(['super_admin', 'admin'])
        .withMessage('Invalid role'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

const resetPasswordValidation = [
    param('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// ----- Banner -----
const createBannerValidation = [
    body('title').notEmpty().trim().withMessage('Banner title is required'),
    body('imageUrl').optional().trim(),
    body('buttonText').optional().trim(),
    body('buttonLink').optional().trim().isURL().withMessage('Button link must be a valid URL'),
    body('subtitle').optional().trim(),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
];

const updateBannerValidation = [
    param('id').isMongoId().withMessage('Invalid banner ID'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('imageUrl').optional().trim(),
    body('buttonText').optional().trim(),
    body('buttonLink').optional().trim(),
    body('subtitle').optional().trim(),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
];

// ----- Inquire -----
const createInquireValidation = [
    body('name').notEmpty().trim().withMessage('Name is required'),
    body('mobile').notEmpty().trim().withMessage('Mobile number is required'),
    body('program').isMongoId().withMessage('Valid program ID is required'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
];

const updateInquireValidation = [
    param('id').isMongoId().withMessage('Invalid inquiry ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('mobile').optional().trim().notEmpty().withMessage('Mobile cannot be empty'),
    body('program').optional().isMongoId().withMessage('Valid program ID is required'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
];

// ----- Program -----
const createProgramValidation = [
    body('name').notEmpty().trim().withMessage('Program name is required'),
    body('code').notEmpty().trim().withMessage('Program code is required').toUpperCase(),
    body('description').optional().trim(),
    body('imageUrl').optional().trim().isURL().withMessage('Image URL must be a valid URL'),
    body('duration').notEmpty().trim().withMessage('Duration is required'),
    body('eligibility').optional().trim(),
    body('fee').optional().isFloat({ min: 0 }).withMessage('Fee cannot be negative'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
];

const updateProgramValidation = [
    param('id').isMongoId().withMessage('Invalid program ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('code').optional().trim().toUpperCase(),
    body('description').optional().trim(),
    body('imageUrl').optional().trim().isURL().withMessage('Image URL must be a valid URL'),
    body('duration').optional().trim(),
    body('eligibility').optional().trim(),
    body('fee').optional().isFloat({ min: 0 }).withMessage('Fee cannot be negative'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
];

// ----- Role -----
const createRoleValidation = [
    body('name').notEmpty().trim().withMessage('Role name is required').toLowerCase(),
    body('displayName').notEmpty().trim().withMessage('Display name is required'),
    body('description').optional().trim(),
    body('permissions').optional().isArray().withMessage('Permissions must be an array'),
];

const updateRoleValidation = [
    param('id').isMongoId().withMessage('Invalid role ID'),
    body('displayName').optional().trim().notEmpty().withMessage('Display name cannot be empty'),
    body('description').optional().trim(),
    body('permissions').optional().isArray().withMessage('Permissions must be an array'),
];

// ----- User (admin update) -----
const updateUserValidation = [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').optional().trim().notEmpty().withMessage('Phone cannot be empty'),
    body('profilePicture').optional().trim(),
    body('role')
        .optional()
        .isIn(['super_admin', 'admin'])
        .withMessage('Invalid role'),
    body('isActive').optional().isBoolean().withMessage('isActive must be true or false'),
];

// ----- Notification -----
const createNotificationValidation = [
    body('title').notEmpty().trim().withMessage('Title is required'),
    body('message').notEmpty().trim().withMessage('Message is required'),
    body('type').optional().isIn(['info', 'success', 'warning', 'urgent', 'general']).withMessage('Invalid type'),
    body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
];

const updateNotificationValidation = [
    param('id').isMongoId().withMessage('Invalid notification ID'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('message').optional().trim().notEmpty().withMessage('Message cannot be empty'),
    body('type').optional().isIn(['info', 'success', 'warning', 'urgent', 'general']).withMessage('Invalid type'),
    body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
];

// ----- General Settings -----
const updateSettingValidation = [
    body('settings').isObject().withMessage('Settings must be an object'),
];

// ----- Banner -----
const createServicePatneValidation = [
    body('name').notEmpty().trim().withMessage('Service Patne Name is required'),
    body('imageUrl').optional().trim(),
    body('description').optional().trim(),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
];

const updateServicePatneValidation = [
    param('id').isMongoId().withMessage('Invalid banner ID'),
    body('name').notEmpty().trim().withMessage('Service Patne Name is required'),
    body('imageUrl').optional().trim(),
    body('description').optional().trim(),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
];

module.exports = {
    validate,
    mongoIdParam,
    // Auth
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    // Banner
    createBannerValidation,
    updateBannerValidation,
    // Inquire
    createInquireValidation,
    updateInquireValidation,
    // Program
    createProgramValidation,
    updateProgramValidation,
    // Role
    createRoleValidation,
    updateRoleValidation,
    // User
    updateUserValidation,
    // Notification
    createNotificationValidation,
    updateNotificationValidation,
    // Settings
    updateSettingValidation,
    // service patner
    createServicePatneValidation,
    updateServicePatneValidation
};
