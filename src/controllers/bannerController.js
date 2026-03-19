const Banner = require('../models/Banner');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all banners
 * @route   GET /api/banners
 * @access  Public
 */
exports.getBanners = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, status, search } = req.query;

    // Build query
    let query = { deleted: false };

    if (status) {
        query.status = status;
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { subtitle: { $regex: search, $options: 'i' } },
            { buttonText: { $regex: search, $options: 'i' } }
        ];
    }

    // Execute query
    const banners = await Banner.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

    const total = await Banner.countDocuments(query);

    res.status(200).json({
        success: true,
        count: banners.length,
        total,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        },
        data: banners
    });
});

/**
 * @desc    Get single banner
 * @route   GET /api/banners/:id
 * @access  Public
 */
exports.getBanner = asyncHandler(async (req, res, next) => {
    const banner = await Banner.findById(req.params.id);

    if (!banner || banner.deleted) {
        return next(new ErrorResponse('Banner not found', 404));
    }

    res.status(200).json({
        success: true,
        data: banner
    });
});

/**
 * @desc    Create new banner
 * @route   POST /api/banners
 * @access  Private/Admin
 */
exports.createBanner = asyncHandler(async (req, res, next) => {
    if (req.file) {
        req.body.imageUrl = `/uploads/banners/${req.file.filename}`;
    }
    if (!req.body.imageUrl) {
        return next(new ErrorResponse('Banner image is required', 400));
    }
    const banner = await Banner.create(req.body);

    res.status(201).json({
        success: true,
        data: banner
    });
});

/**
 * @desc    Update banner
 * @route   PUT /api/banners/:id
 * @access  Private/Admin
 */
exports.updateBanner = asyncHandler(async (req, res, next) => {

    let banner = await Banner.findById(req.params.id);
    
    if (!banner || banner.deleted) {
        return next(new ErrorResponse('Banner not found', 404));
    }

    if (req.file) {
        req.body.imageUrl = `/uploads/banners/${req.file.filename}`;
    }

    banner = await Banner.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );
    
    res.status(200).json({
        success: true,
        data: banner
    });

});

/**
 * @desc    Delete banner (soft delete)
 * @route   DELETE /api/banners/:id
 * @access  Private/Admin
 */
exports.deleteBanner = asyncHandler(async (req, res, next) => {
    const banner = await Banner.findById(req.params.id);

    if (!banner || banner.deleted) {
        return next(new ErrorResponse('Banner not found', 404));
    }

    await Banner.findByIdAndUpdate(req.params.id, { deleted: true });

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
exports.hardDeleteBanner = asyncHandler(async (req, res, next) => {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
        return next(new ErrorResponse('Banner not found', 404));
    }

    await Banner.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});