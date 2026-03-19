const express = require('express');
const router = express.Router();
const {
    getRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
} = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    validate,
    createRoleValidation,
    updateRoleValidation,
    mongoIdParam,
} = require('../middleware/validator');

router.use(protect);
router.use(authorize('super_admin', 'admin', 'school_admin'));

router.get('/', getRoles);
router.get('/:id', mongoIdParam('id'), validate, getRole);
router.post('/', createRoleValidation, validate, createRole);
router.put('/:id', mongoIdParam('id'), updateRoleValidation, validate, updateRole);
router.delete('/:id', mongoIdParam('id'), validate, deleteRole);

module.exports = router;
