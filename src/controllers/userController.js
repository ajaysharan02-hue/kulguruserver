const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getUsers = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, role, isActive, search } = req.query;
    let query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
        query.$or = [{ email: { $regex: search, $options: 'i' } }];
    }

    const users = await User.find(query)
        .select('-password -refreshToken -passwordResetToken -passwordResetExpires')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

    const total = await User.countDocuments(query);

    res.status(200).json({
        success: true,
        count: users.length,
        total,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        },
        data: users,
    });
});

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
        .select('-password -refreshToken -passwordResetToken -passwordResetExpires');
    if (!user) return next(new ErrorResponse('User not found', 404));
    res.status(200).json({ success: true, data: user });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
    const { name, email, phone, profilePicture, role, isActive } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    if (role !== undefined) updates.role = role;
    if (isActive !== undefined) updates.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    }).select('-password -refreshToken -passwordResetToken -passwordResetExpires');

    if (!user) return next(new ErrorResponse('User not found', 404));
    res.status(200).json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorResponse('User not found', 404));
    if (req.user._id.toString() === user._id.toString()) {
        return next(new ErrorResponse('You cannot delete your own account', 400));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
});
