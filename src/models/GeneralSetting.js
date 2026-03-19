const mongoose = require('mongoose');

/**
 * General Setting Schema – key-value settings (single document)
 */
const settingSchema = new mongoose.Schema(
    {
        settings: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('GeneralSetting', settingSchema);
