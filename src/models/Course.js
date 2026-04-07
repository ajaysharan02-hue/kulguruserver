const mongoose = require('mongoose');

/**
 * Course Schema - Specializations under a program
 */
const CourseSchema = new mongoose.Schema(
    {
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Program',
            required: [true, 'Program is required'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Course name is required'],
            trim: true,
        },
        code: {
            type: String,
            trim: true,
            uppercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        imageUrl: {
            type: String,
            trim: true,
        },
        duration: {
            type: String,
            trim: true,
        },
        eligibility: {
            type: String,
            trim: true,
        },
        fee: {
            type: Number,
            min: [0, 'Fee cannot be negative'],
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
            index: true,
        },
        deleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

CourseSchema.index(
    { program: 1, name: 1 },
    { unique: true, partialFilterExpression: { deleted: false } }
);
CourseSchema.index({ name: 1, code: 1 });

CourseSchema.set('toJSON', { virtuals: true });
CourseSchema.set('toObject', { virtuals: true });

CourseSchema.virtual('image').get(function () {
    if (!this.imageUrl) return null;
    if (this.imageUrl.startsWith('http://') || this.imageUrl.startsWith('https://')) {
        return this.imageUrl;
    }
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    return baseUrl + this.imageUrl;
});

module.exports = mongoose.model('Course', CourseSchema);
