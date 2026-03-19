const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * Handles connection with retry logic and error handling
 */
const connectDB = async () => {
  try {
    // On Windows, `localhost` may resolve to IPv6 (`::1`) and fail if MongoDB isn't listening on IPv6.
    // Default to 127.0.0.1 for a more reliable local dev experience.
    let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kulguruDb';

    // If the env var uses localhost, Windows may resolve it to IPv6 (::1) and fail if Mongo isn't bound on IPv6.
    // Normalize localhost to 127.0.0.1 to avoid ECONNREFUSED ::1:27017.
    uri = uri.replace(/^mongodb:\/\/localhost(?=[:/]|$)/i, 'mongodb://127.0.0.1');
    if (typeof uri !== 'string' || !uri.trim()) {
      throw new Error('MONGODB_URI is missing or invalid (expected a non-empty string)');
    }

    const conn = await mongoose.connect(uri, {
      // Mongoose 6+ no longer needs these options
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
