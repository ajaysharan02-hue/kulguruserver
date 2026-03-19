const express = require('express');
const router = express.Router();
const {
    getInquires,
    getInquire,
    createInquire,
    updateInquire,
    deleteInquire,
    hardDeleteInquire,
} = require('../controllers/inquireController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    validate,
    createInquireValidation,
    updateInquireValidation,
    mongoIdParam,
} = require('../middleware/validator');

// Public: submit inquiry
router.post('/', createInquireValidation, validate, createInquire);

// Protected – admin only
router.use(protect);
router.use(authorize('super_admin', 'admin', 'school_admin'));

router.get('/', getInquires);
router.get('/:id', mongoIdParam('id'), validate, getInquire);
router.put('/:id', mongoIdParam('id'), updateInquireValidation, validate, updateInquire);
router.delete('/:id', mongoIdParam('id'), validate, deleteInquire);
router.delete('/:id/hard', mongoIdParam('id'), validate, hardDeleteInquire);

module.exports = router;
