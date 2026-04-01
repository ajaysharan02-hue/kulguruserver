const Banner = require('../models/Banner');
const ServicePatner = require('../models/ServicePatner');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all banners
 * @route   GET /api/banners
 * @access  Public
 */
exports.getServicePatners = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, status, search } = req.query;

    // Build query
    let query = { deleted: false };

    if (status) {
        query.status = status;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    // Execute query
    const result = await ServicePatner.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

    const total = await ServicePatner.countDocuments(query);

    res.status(200).json({
        success: true,
        count: result.length,
        total,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        },
        data: result
    });
});

/**
 * @desc    Get single banner
 * @route   GET /api/banners/:id
 * @access  Public
 */
exports.getServicePatner = asyncHandler(async (req, res, next) => {
    const result = await ServicePatner.findById(req.params.id);

    if (!result || result.deleted) {
        return next(new ErrorResponse('Servuce Patner not found', 404));
    }

    res.status(200).json({
        success: true,
        data: result
    });
});

/**
 * @desc    Create new banner
 * @route   POST /api/banners
 * @access  Private/Admin
 */
exports.createServicePatner = asyncHandler(async (req, res, next) => {
    if (req.file) {
        req.body.imageUrl = `/uploads/servicepatner/${req.file.filename}`;
    }
    if (!req.body.imageUrl) {
        return next(new ErrorResponse('Service Patner image is required', 400));
    }
    const result = await ServicePatner.create(req.body);

    res.status(201).json({
        success: true,
        data: result
    });
});

/**
 * @desc    Update banner
 * @route   PUT /api/banners/:id
 * @access  Private/Admin
 */
exports.updateServicePatner = asyncHandler(async (req, res, next) => {

    let result = await ServicePatner.findById(req.params.id);
    
    if (!result || result.deleted) {
        return next(new ErrorResponse('Service Patner not found', 404));
    }

    if (req.file) {
        req.body.imageUrl = `/uploads/servicepatner/${req.file.filename}`;
    }

    result = await ServicePatner.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );
    
    res.status(200).json({
        success: true,
        data: result
    });

});

/**
 * @desc    Delete banner (soft delete)
 * @route   DELETE /api/banners/:id
 * @access  Private/Admin
 */
exports.deleteServicePatner= asyncHandler(async (req, res, next) => {
    const result = await ServicePatner.findById(req.params.id);

    if (!result || result.deleted) {
        return next(new ErrorResponse('Service Patner not found', 404));
    }

    await ServicePatner.findByIdAndUpdate(req.params.id, { deleted: true });

    res.status(200).json({
        success: true,
        data: {}
    });
});

/**
 * @desc    Hard delete banner
 * @route   DELETE /api/banners/:id/hard
 * @access  Private/Admin
 */
exports.hardDeleteServicePatner = asyncHandler(async (req, res, next) => {
    const result = await ServicePatner.findById(req.params.id);

    if (!result) {
        return next(new ErrorResponse('Banner not found', 404));
    }

    await ServicePatner.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});