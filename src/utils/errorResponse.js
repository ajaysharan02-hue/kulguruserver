/**
 * Custom Error Response Class
 * Extends Error to include statusCode for consistent error handling
 */
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorResponse;