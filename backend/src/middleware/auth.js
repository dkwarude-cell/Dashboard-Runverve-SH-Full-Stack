import { verifyFirebaseToken } from '../config/firebase.js';
import { db } from '../config/db.js';

/**
 * Middleware: Verify Firebase JWT token
 * Extracts token from Authorization header and verifies using Firebase Admin SDK
 * Attaches decoded user info to request
 */
export const verifyFirebaseJWT = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid Authorization header',
        data: null,
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Development mode: Allow test tokens
    if (process.env.NODE_ENV === 'development' && token === 'mock-token-dev') {
      try {
        // Get admin user for dev mode
        const user = await db('users')
          .where('role', 'admin')
          .first();

        if (user) {
          req.user = user;
          req.decodedToken = { uid: user.firebase_uid };
          return next();
        }
      } catch (devErr) {
        console.log('Dev mode fallback failed:', devErr.message);
      }
    }

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(token);

    // Fetch user from database
    const user = await db('users')
      .where('firebase_uid', decodedToken.uid)
      .first();

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'User not found in system',
        data: null,
      });
    }

    // Attach user and decoded token to request
    req.user = user;
    req.decodedToken = decodedToken;

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      data: null,
    });
  }
};

export default verifyFirebaseJWT;
