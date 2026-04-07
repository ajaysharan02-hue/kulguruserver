const Course = require('../models/Course');
const Program = require('../models/Program');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getCourses = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status, program, search } = req.query;

    const query = { deleted: false };
    if (status) query.status = status;
    if (program) query.program = program;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    const courses = await Course.find(query)
        .populate('program', 'name code')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

    const total = await Course.countDocuments(query);

    res.status(200).json({
        success: true,
        count: courses.length,
        total,
        pagination: {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        },
        data: courses,
    });
});

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate('program', 'name code');
    if (!course || course.deleted) {
        return next(new ErrorResponse('Course not found', 404));
    }
    res.status(200).json({ success: true, data: course });
});

exports.createCourse = asyncHandler(async (req, res, next) => {
    const program = await Program.findById(req.body.program);
    if (!program || program.deleted) {
        return next(new ErrorResponse('Program not found', 404));
    }

    if (req.file) {
        req.body.imageUrl = `/uploads/courses/${req.file.filename}`;
    }

    const course = await Course.create(req.body);
    const populated = await Course.findById(course._id).populate('program', 'name code');
    res.status(201).json({ success: true, data: populated });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);
    if (!course || course.deleted) {
        return next(new ErrorResponse('Course not found', 404));
    }

    if (req.body.program) {
        const program = await Program.findById(req.body.program);
        if (!program || program.deleted) {
            return next(new ErrorResponse('Program not found', 404));
        }
    }

    if (req.file) {
        req.body.imageUrl = `/uploads/courses/${req.file.filename}`;
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }).populate('program', 'name code');

    res.status(200).json({ success: true, data: course });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course || course.deleted) {
        return next(new ErrorResponse('Course not found', 404));
    }
    await Course.findByIdAndUpdate(req.params.id, { deleted: true });
    res.status(200).json({ success: true, data: {} });
});

exports.hardDeleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse('Course not found', 404));
    }
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
});
