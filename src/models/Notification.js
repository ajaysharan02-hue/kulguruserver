const mongoose = require('mongoose');

/**
 * Notification Schema – in-app / broadcast notifications
 */
const notificationSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
        },
        type: {
            type: String,
            enum: ['info', 'success', 'warning', 'urgent', 'general'],
            default: 'general',
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'published',
        },
        publishedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        publishDate: {
            type: Date,
            default: Date.now,
        },
        expiryDate: Date,
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

notificationSchema.index({ status: 1 });
notificationSchema.index({ deleted: 1 });
notificationSchema.index({ publishDate: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
