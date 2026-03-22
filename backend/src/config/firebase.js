import admin from 'firebase-admin';

let firebaseApp;

/**
 * Initialize Firebase Admin SDK
 * Requires FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL
 */
export const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    });

    console.log('✓ Firebase Admin SDK initialized');
    return firebaseApp;
  } catch (error) {
    console.error('✗ Firebase initialization failed:', error.message);
    throw error;
  }
};

/**
 * Verify Firebase ID Token
 * @param {string} token - Firebase ID token
 * @returns {Promise<Object>} - Decoded token with user info
 */
export const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error(`Firebase token verification failed: ${error.message}`);
  }
};

/**
 * Get user by Firebase UID
 * @param {string} uid - Firebase UID
 * @returns {Promise<Object>} - User info from Firebase
 */
export const getFirebaseUser = async (uid) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    throw new Error(`Failed to get Firebase user: ${error.message}`);
  }
};

export default {
  initializeFirebase,
  verifyFirebaseToken,
  getFirebaseUser,
};
