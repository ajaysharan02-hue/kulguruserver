const express = require('express');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Upload banner image – protected, admin only
router.post('/banner', protect, authorize('super_admin', 'admin'), upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Return the file path that can be accessed publicly
        const fileUrl = `/uploads/banners/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                filename: req.file.filename,
                url: fileUrl,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }
});

// Upload logo image – protected, admin only
router.post('/logo', protect, authorize('super_admin', 'admin'), (req, res, next) => {
    req.params.kind = 'logo';
    next();
}, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const fileUrl = `/uploads/logos/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Logo uploaded successfully',
            data: {
                filename: req.file.filename,
                url: fileUrl,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }
});

// Upload avatar image – protected (any logged-in user)
router.post('/avatar', protect, (req, res, next) => {
    req.params.kind = 'avatar';
    next();
}, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const fileUrl = `/uploads/avatars/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Avatar uploaded successfully',
            data: {
                filename: req.file.filename,
                url: fileUrl,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'File upload failed',
            error: error.message
        });
    }
});

module.exports = router;