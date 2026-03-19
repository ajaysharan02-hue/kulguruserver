const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Role name is required'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    displayName: {
        type: String,
        required: [true, 'Display name is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    permissions: [{
        resource: {
            type: String,
            required: true,
        },
        actions: [{
            type: String, // 'create', 'read', 'update', 'delete', 'all'
            required: true,
        }]
    }],
    isSystem: {
        type: Boolean,
        default: false, // System roles cannot be deleted
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Role', roleSchema);
