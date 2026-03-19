const express = require('express');
const router = express.Router();
const {
    getPrograms,
    getProgram,
    createProgram,
    updateProgram,
    deleteProgram,
    hardDeleteProgram,
} = require('../controllers/programController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    validate,
    createProgramValidation,
    updateProgramValidation,
    mongoIdParam,
} = require('../middleware/validator');

// Public
router.get('/', getPrograms);
router.get('/:id', mongoIdParam('id'), validate, getProgram);

// Protected – admin only
router.use(protect);
router.use(authorize('super_admin', 'admin', 'school_admin'));

router.post('/', createProgramValidation, validate, createProgram);
router.put('/:id', mongoIdParam('id'), updateProgramValidation, validate, updateProgram);
router.delete('/:id', mongoIdParam('id'), validate, deleteProgram);
router.delete('/:id/hard', mongoIdParam('id'), validate, hardDeleteProgram);

module.exports = router;
