require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
const { clean } = require('xss-clean/lib/xss');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(
    helmet({
        // Allow images/files from this API to be embedded on other origins (admin/website)
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        // Keep COEP off unless you explicitly need it (avoids blocking embeds)
        crossOriginEmbedderPolicy: false,
    })
); // Set security headers
app.use(cookieParser()); // Parse cookies early
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:5173','http://127.0.0.1:5173','http://localhost:3000','http://localhost:5177','https://kulguruadmin-production.up.railway.app','https://kulguruweb-production.up.railway.app'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parser middleware - Required before sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom sanitization for Express 5 (req.query is read-only)
app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize.sanitize(req.body);
    if (req.params) req.params = mongoSanitize.sanitize(req.params);
    if (req.query) {
        const sanitized = mongoSanitize.sanitize(req.query);
        for (const key in req.query) {
            delete req.query[key];
        }
        Object.assign(req.query, sanitized);
    }
    next();
});

app.use((req, res, next) => {
    if (req.body) req.body = clean(req.body);
    if (req.params) req.params = clean(req.params);
    if (req.query) {
        const sanitized = clean(req.query);
        for (const key in req.query) {
            delete req.query[key];
        }
        Object.assign(req.query, sanitized);
    }
    next();
});

app.use(hpp()); // Prevent HTTP parameter pollution

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Serve static files from uploads directory
app.use('/uploads', cors({
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:5173','http://127.0.0.1:5173','http://localhost:3000','http://localhost:5177'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}), express.static(path.join(__dirname, 'uploads')));

// API Routes (central mount)
app.use('/api', require('./routes'));



// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Programs Management System API is running',
        timestamp: new Date().toISOString(),
    });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Programs Management System API',
        version: '1.0.0',
        documentation: '/api/docs',
    });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎓 Programs Management System API                        ║
║                                                           ║
║   Server running in ${process.env.NODE_ENV || 'development'} mode                          ║
║   Port: ${PORT}                                              ║
║   URL: http://localhost:${PORT}                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error(`❌ Uncaught Exception: ${err.message}`);
    process.exit(1);
});

module.exports = app;
