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

const upload = require('../middleware/upload');

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
router.use(authorize('super_admin', 'admin'));

router.post(
    '/',
    (req, res, next) => { req.params.kind = 'programs'; next(); },
    upload.single('image'),
    createProgramValidation,
    validate,
    createProgram
);
router.put('/:id',
    (req, res, next) => { req.params.kind = 'programs'; next(); },
    upload.single('image'),
    mongoIdParam('id'),
    updateProgramValidation,
    validate,
    updateProgram
);
router.delete('/:id', mongoIdParam('id'), validate, deleteProgram);
router.delete('/:id/hard', mongoIdParam('id'), validate, hardDeleteProgram);

module.exports = router;
