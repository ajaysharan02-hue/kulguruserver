const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    getServicePatners,
    getServicePatner,
    createServicePatner,
    updateServicePatner,
    deleteServicePatner,
    hardDeleteServicePatner,
} = require('../controllers/servicePatnerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    validate,
    createServicePatneValidation,
    updateServicePatneValidation,
    mongoIdParam,
} = require('../middleware/validator');

// Public
router.get('/', getServicePatners);
router.get('/:id', mongoIdParam('id'), validate, getServicePatner);

// Protected – admin only
router.use(protect);
router.use(authorize('super_admin', 'admin'));

router.post('/', upload.single('image'), createServicePatneValidation, validate, createServicePatner);
router.put('/:id', upload.single('image'), mongoIdParam('id'), updateServicePatneValidation, validate, updateServicePatner);
router.delete('/:id', mongoIdParam('id'), validate, deleteServicePatner);
router.delete('/:id/hard', mongoIdParam('id'), validate, hardDeleteServicePatner);

module.exports = router;
