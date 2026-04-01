const mongoose = require('mongoose');

/**
 * Banner Schema - Banner information
 */
const ServicePatnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'ServicePatner Name is required'],
        },
        imageUrl: {
            type: String,
            required: [true, 'ServicePatner image URL is required'],
        },
        description: {
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
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);


// Indexes for faster queries
ServicePatnerSchema.index({ status: 1 });
ServicePatnerSchema.index({ deleted: 1 });

ServicePatnerSchema.virtual('image').get(function () {
    if (!this.imageUrl) return null;
    // Already absolute URL (e.g. seed data / external images)
    if (this.imageUrl.startsWith('http://') || this.imageUrl.startsWith('https://')) {
        return this.imageUrl;
    }
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    return baseUrl + this.imageUrl;
});
module.exports = mongoose.model('ServicePatner', ServicePatnerSchema);
