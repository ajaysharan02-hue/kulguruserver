const mongoose = require('mongoose');

/**
 * Program Schema - Academic programs offered by the institution
 */
const ProgramSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Program name is required'],   
        },
        code: {
            type: String,
            required: [true, 'Program code is required'],
            unique: true,
            uppercase: true,    
        },
        description: {
            type: String,
        },    
        duration: {
            type: String,
            required: [true, 'Program duration is required'],
        }, 
        eligibility: {
            type: String,
        },
        fee: {
            type: Number,
            min: [0, 'Fee cannot be negative'],
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
ProgramSchema.index({ name: 1, code: 1 });
ProgramSchema.index({ status: 1 });
ProgramSchema.index({ deleted: 1 });


// Ensure virtuals are included in JSON
ProgramSchema.set('toJSON', { virtuals: true });
ProgramSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Program', ProgramSchema);
