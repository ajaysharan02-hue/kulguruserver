const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getNotifications = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, status, type } = req.query;
    let query = { deleted: false };
    if (status) query.status = status;
    if (type) query.type = type;

    const notifications = await Notification.find(query)
        .populate('publishedBy', 'email')
        .sort({ publishDate: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

    const total = await Notification.countDocuments(query);

    res.status(200).json({
        success: true,
        count: notifications.length,
        total,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        },
        data: notifications,
    });
});

exports.getNotification = asyncHandler(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id).populate('publishedBy', 'email');
    if (!notification || notification.deleted) {
        return next(new ErrorResponse('Notification not found', 404));
    }
    res.status(200).json({ success: true, data: notification });
});

exports.createNotification = asyncHandler(async (req, res, next) => {
    req.body.publishedBy = req.user._id;
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, data: notification });
});

exports.updateNotification = asyncHandler(async (req, res, next) => {
    let notification = await Notification.findById(req.params.id);
    if (!notification || notification.deleted) {
        return next(new ErrorResponse('Notification not found', 404));
    }
    notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: notification });
});

exports.deleteNotification = asyncHandler(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification || notification.deleted) {
        return next(new ErrorResponse('Notification not found', 404));
    }
    await Notification.findByIdAndUpdate(req.params.id, { deleted: true });
    res.status(200).json({ success: true, data: {} });
});

exports.hardDeleteNotification = asyncHandler(async (req, res, next) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return next(new ErrorResponse('Notification not found', 404));
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
});
