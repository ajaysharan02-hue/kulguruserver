const Inquire = require('../models/Inquire');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all inquiries
 * @route   GET /api/inquires
 * @access  Private/Admin
 */
exports.getInquires = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, status, program, search } = req.query;

    // Build query
    let query = { deleted: false };

    if (status) {
        query.status = status;
    }

    if (program) {
        query.program = program;
    }

    if (search && search.trim()) {
        const term = search.trim();
        query.$or = [
            { name: { $regex: term, $options: 'i' } },
            { mobile: { $regex: term, $options: 'i' } },
        ];
    }

    // Execute query
    const inquires = await Inquire.find(query)
        .populate('program', 'name code')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

    const total = await Inquire.countDocuments(query);

    const totalPages = Math.ceil(total / limit) || 1;
    res.status(200).json({
        success: true,
        count: inquires.length,
        total,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages,
            pages: totalPages,
            hasNext: page * limit < total,
            hasPrev: page > 1
        },
        data: inquires
    });
});

/**
 * @desc    Get single inquiry
 * @route   GET /api/inquires/:id
 * @access  Private/Admin
 */
exports.getInquire = asyncHandler(async (req, res, next) => {
    const inquire = await Inquire.findById(req.params.id)
        .populate('program', 'name code');

    if (!inquire || inquire.deleted) {
        return next(new ErrorResponse('Inquiry not found', 404));
    }

    res.status(200).json({
        success: true,
        data: inquire
    });
});

/**
 * @desc    Create new inquiry
 * @route   POST /api/inquires
 * @access  Public
 */
exports.createInquire = asyncHandler(async (req, res, next) => {
    const inquire = await Inquire.create(req.body);

    res.status(201).json({
        success: true,
        data: inquire
    });
});

/**
 * @desc    Update inquiry
 * @route   PUT /api/inquires/:id
 * @access  Private/Admin
 */
exports.updateInquire = asyncHandler(async (req, res, next) => {
    let inquire = await Inquire.findById(req.params.id);

    if (!inquire || inquire.deleted) {
        return next(new ErrorResponse('Inquiry not found', 404));
    }

    inquire = await Inquire.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: inquire
    });
});

/**
 * @desc    Delete inquiry (soft delete)
 * @route   DELETE /api/inquires/:id
 * @access  Private/Admin
 */
exports.deleteInquire = asyncHandler(async (req, res, next) => {
    const inquire = await Inquire.findById(req.params.id);

    if (!inquire || inquire.deleted) {
        return next(new ErrorResponse('Inquiry not found', 404));
    }

    await Inquire.findByIdAndUpdate(req.params.id, { deleted: true });

    res.status(200).json({
        success: true,
        data: {}
    });
});

/**
 * @desc    Hard delete inquiry
 * @route   DELETE /api/inquires/:id/hard
 * @access  Private/Admin
 */
exports.hardDeleteInquire = asyncHandler(async (req, res, next) => {
    const inquire = await Inquire.findById(req.params.id);

    if (!inquire) {
        return next(new ErrorResponse('Inquiry not found', 404));
    }

    await Inquire.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});