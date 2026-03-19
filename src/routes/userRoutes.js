const express = require('express');
const router = express.Router();
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, updateUserValidation, mongoIdParam } = require('../middleware/validator');

router.use(protect);
router.use(authorize('super_admin', 'admin', 'school_admin'));

router.get('/', getUsers);
router.get('/:id', mongoIdParam('id'), validate, getUser);
router.put('/:id', mongoIdParam('id'), updateUserValidation, validate, updateUser);
router.delete('/:id', mongoIdParam('id'), validate, deleteUser);

module.exports = router;
