const Role = require('../models/Role');

/**
 * @desc    Get all roles
 * @route   GET /api/roles
 * @access  Private (Admin/Super Admin)
 */
const getRoles = async (req, res, next) => {
    try {
        const roles = await Role.find().sort({ createdAt: 1 });
        res.status(200).json({
            success: true,
            data: roles,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single role
 * @route   GET /api/roles/:id
 * @access  Private (Admin/Super Admin)
 */
const getRole = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found',
            });
        }
        res.status(200).json({
            success: true,
            data: role,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new role
 * @route   POST /api/roles
 * @access  Private (Super Admin)
 */
const createRole = async (req, res, next) => {
    try {
        const { name, displayName, description, permissions } = req.body;

        const roleExists = await Role.findOne({ name });
        if (roleExists) {
            return res.status(400).json({
                success: false,
                message: 'Role already exists',
            });
        }

        const role = await Role.create({
            name,
            displayName,
            description,
            permissions,
            isSystem: false,
        });

        res.status(201).json({
            success: true,
            data: role,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update role permissions
 * @route   PUT /api/roles/:id
 * @access  Private (Super Admin)
 */
const updateRole = async (req, res, next) => {
    try {
        const { displayName, description, permissions } = req.body;
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found',
            });
        }

        // System roles might be restricted from name changes or deletion, 
        // but updating permissions is the main goal here.

        role.displayName = displayName || role.displayName;
        role.description = description || role.description;
        role.permissions = permissions || role.permissions;

        await role.save();

        res.status(200).json({
            success: true,
            data: role,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete role
 * @route   DELETE /api/roles/:id
 * @access  Private (Super Admin)
 */
const deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found',
            });
        }

        if (role.isSystem) {
            return res.status(400).json({
                success: false,
                message: 'System roles cannot be deleted',
            });
        }

        await role.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Role deleted',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,
};
