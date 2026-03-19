const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, updateSettingValidation } = require('../middleware/validator');

router.get('/', getSettings);

router.use(protect);
router.use(authorize('super_admin', 'admin', 'school_admin'));
router.put('/', updateSettingValidation, validate, updateSettings);

module.exports = router;
