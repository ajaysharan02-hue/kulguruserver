const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    getBanners,
    getBanner,
    createBanner,
    updateBanner,
    deleteBanner,
    hardDeleteBanner,
} = require('../controllers/bannerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    validate,
    createBannerValidation,
    updateBannerValidation,
    mongoIdParam,
} = require('../middleware/validator');

// Public
router.get('/', getBanners);
router.get('/:id', mongoIdParam('id'), validate, getBanner);

// Protected – admin only
router.use(protect);
router.use(authorize('super_admin', 'admin'));

router.post('/', upload.single('image'), createBannerValidation, validate, createBanner);
router.put('/:id', upload.single('image'), mongoIdParam('id'), updateBannerValidation, validate, updateBanner);
router.delete('/:id', mongoIdParam('id'), validate, deleteBanner);
router.delete('/:id/hard', mongoIdParam('id'), validate, hardDeleteBanner);

module.exports = router;
