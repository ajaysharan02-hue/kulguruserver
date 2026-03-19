const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getNotification,
    createNotification,
    updateNotification,
    deleteNotification,
    hardDeleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    validate,
    createNotificationValidation,
    updateNotificationValidation,
    mongoIdParam,
} = require('../middleware/validator');

// Public: list published only (optional – can make all protected)
router.get('/', getNotifications);
router.get('/:id', mongoIdParam('id'), validate, getNotification);

// Protected – admin only
router.use(protect);
router.use(authorize('super_admin', 'admin', 'school_admin'));

router.post('/', createNotificationValidation, validate, createNotification);
router.put('/:id', mongoIdParam('id'), updateNotificationValidation, validate, updateNotification);
router.delete('/:id', mongoIdParam('id'), validate, deleteNotification);
router.delete('/:id/hard', mongoIdParam('id'), validate, hardDeleteNotification);

module.exports = router;
