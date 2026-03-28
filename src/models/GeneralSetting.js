const mongoose = require('mongoose');

/**
 * General Setting Schema – fixed keys (single document)
 */
const settingSchema = new mongoose.Schema(
    {
        // Branding
        brandName: { type: String, default: '' },
        instituteName: { type: String, default: '' },
        logoUrl: { type: String, default: '' },

        // Contact
        phone: { type: String, default: '' },
        contactPhone: { type: String, default: '' },
        email: { type: String, default: '' },
        contactEmail: { type: String, default: '' },
        address: { type: String, default: '' },

        // WhatsApp
        whatsapp: { type: String, default: '' },     // accepts +91...
        whatsappUrl: { type: String, default: '' },  // explicit link if any
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        youtube: { type: String, default: '' },
        telegram: { type: String, default: '' },
        // UI/UX
        theme: { type: String, enum: ['light', 'dark'], default: 'light' },
        language: { type: String, default: 'en' },
        timezone: { type: String, default: 'Asia/Kolkata' },

        // SMTP
        smtpHost: { type: String, default: '' },
        smtpPort: { type: Number, default: 587 },
        smtpUser: { type: String, default: '' },
        smtpPass: { type: String, default: '' },
        smtpSecure: { type: Boolean, default: false },
        smtpFromName: { type: String, default: '' },
        smtpFromEmail: { type: String, default: '' },

        // Audit
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
settingSchema.virtual('logo').get(function () {
    if (!this.logoUrl) return null;
    // Already absolute URL (e.g. seed data / external images)
    if (this.logoUrl.startsWith('http://') || this.logoUrl.startsWith('https://')) {
        return this.logoUrl;
    }
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    return baseUrl + this.logoUrl;
});
module.exports = mongoose.model('GeneralSetting', settingSchema);
