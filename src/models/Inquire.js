const mongoose = require('mongoose');

/**
 * Inquire Schema - Inquiry/lead information
 */
const InquireSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],   
        },
        mobile: {
            type: String,
            required: [true, 'Mobile number is required'],    
        },
        message: {
            type: String,
            default: '',
        },
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Program',
            required: [true, 'Program is required'],
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
// admissionNumber index is already created by unique: true
InquireSchema.index({ name: 1 });
InquireSchema.index({ status: 1 });
InquireSchema.index({ deleted: 1 });


// Ensure virtuals are included in JSON
InquireSchema.set('toJSON', { virtuals: true });
InquireSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Inquire', InquireSchema);
