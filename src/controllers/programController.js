const Program = require('../models/Program');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc    Get all programs
 * @route   GET /api/programs
 * @access  Public
 */
exports.getPrograms = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, status, search } = req.query;
    console.log("req.query",req.query);   
    // Build query
    let query = { deleted: false };
   
    if (status) {
        query.status = status;
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    // Execute query
    const programs = await Program.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');
        
    const total = await Program.countDocuments(query);

    res.status(200).json({
        success: true,
        count: programs.length,
        total,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        },
        data: programs
    });
});

/**
 * @desc    Get single program
 * @route   GET /api/programs/:id
 * @access  Public
 */
exports.getProgram = asyncHandler(async (req, res, next) => {
    const program = await Program.findById(req.params.id);

    if (!program || program.deleted) {
        return next(new ErrorResponse('Program not found', 404));
    }

    res.status(200).json({
        success: true,
        data: program
    });
});

/**
 * @desc    Create new program
 * @route   POST /api/programs
 * @access  Private/Admin
 */
exports.createProgram = asyncHandler(async (req, res) => {
    if (req.file) {
        req.body.imageUrl = `/uploads/programs/${req.file.filename}`;
    }

    const program = await Program.create(req.body);
    
    res.status(201).json({
        success: true,
        data: program
    });
});

/**
 * @desc    Update program
 * @route   PUT /api/programs/:id
 * @access  Private/Admin
 */
exports.updateProgram = asyncHandler(async (req, res, next) => {
    let program = await Program.findById(req.params.id);

    if (!program || program.deleted) {
        return next(new ErrorResponse('Program not found', 404));
    }

    if (req.file) {
        req.body.imageUrl = `/uploads/programs/${req.file.filename}`;
    }

    program = await Program.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: program
    });
});

/**
 * @desc    Delete program (soft delete)
 * @route   DELETE /api/programs/:id
 * @access  Private/Admin
 */
exports.deleteProgram = asyncHandler(async (req, res, next) => {
    const program = await Program.findById(req.params.id);

    if (!program || program.deleted) {
        return next(new ErrorResponse('Program not found', 404));
    }

    await Program.findByIdAndUpdate(req.params.id, { deleted: true });

    res.status(200).json({
        success: true,
        data: {}
    });
});

/**
 * @desc    Hard delete program
 * @route   DELETE /api/programs/:id/hard
 * @access  Private/Admin
 */
exports.hardDeleteProgram = asyncHandler(async (req, res, next) => {
    const program = await Program.findById(req.params.id);

    if (!program) {
        return next(new ErrorResponse('Program not found', 404));
    }

    await Program.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});