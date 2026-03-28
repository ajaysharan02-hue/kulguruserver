const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Create banners subdirectory
const bannersDir = path.join(uploadDir, 'banners');
if (!fs.existsSync(bannersDir)) {
    fs.mkdirSync(bannersDir, { recursive: true });
}

// Create avatars subdirectory
const avatarsDir = path.join(uploadDir, 'avatars');
if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
}

// Create programs subdirectory
const programsDir = path.join(uploadDir, 'programs');
if (!fs.existsSync(programsDir)) {
    fs.mkdirSync(programsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const kind = req?.params?.kind || req?.body?.kind || 'banners';
        if (kind === 'avatar' || kind === 'avatars') return cb(null, avatarsDir);
        if (kind === 'program' || kind === 'programs') return cb(null, programsDir);
        return cb(null, bannersDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extension).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, ""); // remove weird chars;
        cb(null, `${basename}-${uniqueSuffix}${extension}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

module.exports = upload;