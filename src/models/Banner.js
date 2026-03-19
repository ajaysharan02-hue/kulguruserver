const mongoose = require('mongoose');

/**
 * Banner Schema - Banner information
 */
const BannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Banner title is required'],
        },
        imageUrl: {
            type: String,
            required: [true, 'Banner image URL is required'],
        },
        buttonText: {
            type: String,
        },
        buttonLink: {
            type: String,
        },
        subtitle: {
            type: String,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


// Indexes for faster queries
BannerSchema.index({ status: 1 });
BannerSchema.index({ deleted: 1 });


// Ensure virtuals are included in JSON
BannerSchema.set('toJSON', { virtuals: true });
BannerSchema.set('toObject', { virtuals: true });

BannerSchema.virtual('image').get(function () {
    if (!this.imageUrl) return null;
    // Already absolute URL (e.g. seed data / external images)
    if (this.imageUrl.startsWith('http://') || this.imageUrl.startsWith('https://')) {
        return this.imageUrl;
    }
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    return baseUrl + this.imageUrl;
});
module.exports = mongoose.model('Banner', BannerSchema);
