const GeneralSetting = require('../models/GeneralSetting');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Get general settings (single document)
 */
exports.getSettings = asyncHandler(async (req, res, next) => {
    let doc = await GeneralSetting.findOne();
    if (!doc) {
        doc = await GeneralSetting.create({ settings: {} });
    }
    const settings = doc.settings && typeof doc.settings === 'object' ? doc.settings : {};
    res.status(200).json({ success: true, data: settings });
});

/**
 * Update general settings. Send full settings object; keys not included are removed.
 */
exports.updateSettings = asyncHandler(async (req, res, next) => {
    const { settings } = req.body;
    const incoming = settings && typeof settings === 'object' ? { ...settings } : {};
    let doc = await GeneralSetting.findOne();
    if (!doc) {
        doc = await GeneralSetting.create({ settings: incoming, updatedBy: req.user._id });
    } else {
        doc.settings = incoming;
        doc.updatedBy = req.user._id;
        await doc.save();
    }
    res.status(200).json({ success: true, data: doc.settings });
});
