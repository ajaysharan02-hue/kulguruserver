const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    hardDeleteCourse,
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');
const {
    validate,
    createCourseValidation,
    updateCourseValidation,
    mongoIdParam,
} = require('../middleware/validator');

// Public
router.get('/', getCourses);
router.get('/:id', mongoIdParam('id'), validate, getCourse);

// Protected – admin only
router.use(protect);
router.use(authorize('super_admin', 'admin'));

router.post(
    '/',
    (req, res, next) => { req.params.kind = 'courses'; next(); },
    upload.single('image'),
    createCourseValidation,
    validate,
    createCourse
);

router.put(
    '/:id',
    (req, res, next) => { req.params.kind = 'courses'; next(); },
    upload.single('image'),
    mongoIdParam('id'),
    updateCourseValidation,
    validate,
    updateCourse
);

router.delete('/:id', mongoIdParam('id'), validate, deleteCourse);
router.delete('/:id/hard', mongoIdParam('id'), validate, hardDeleteCourse);

module.exports = router;
