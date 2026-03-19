/**
 * Role-Based Access Control Middleware
 * Restricts access based on user roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route`,
            });
        }

        next();
    };
};

/**
 * Permission check for specific operations
 * More granular than role-based access
 */
const Role = require('../models/Role'); // Import Role model

/**
 * Permission check for specific operations
 * More granular than role-based access - Fetches from DB
 */
const checkPermission = (resource, action) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated',
                });
            }

            // 1. Fetch user's role from DB to get latest permissions
            const userRole = await Role.findOne({ name: req.user.role });

            if (!userRole) {
                // Fallback for roles not in DB yet (or error state)
                return res.status(403).json({
                    success: false,
                    message: `Role configuration not found for '${req.user.role}'`,
                });
            }

            // 2. Check for wildcard permission (super admin)
            const hasWildcard = userRole.permissions.some(
                p => p.resource === '*' && p.actions.includes('*')
            );
            if (hasWildcard) return next();

            // 3. Find permission for the specific resource
            const resourcePermission = userRole.permissions.find(
                p => p.resource === resource || p.resource === '*'
            );

            if (!resourcePermission) {
                return res.status(403).json({
                    success: false,
                    message: `You do not have permission to access ${resource}`,
                });
            }

            // 4. Check if action is allowed
            const actionAllowed = resourcePermission.actions.includes('*') ||
                resourcePermission.actions.includes(action);

            if (actionAllowed) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message: `You do not have permission to ${action} ${resource}`,
            });

        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error during permission check',
            });
        }
    };
};

module.exports = { authorize, checkPermission };
