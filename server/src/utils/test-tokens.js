// Create: src/utils/test-tokens.js
import 'dotenv/config';
import { generateAccessToken, verifyAccessToken } from './generateToken.js';

const userId = '507f1f77bcf86cd799439011'; // Test MongoDB ObjectId
const token = generateAccessToken(userId);
console.log('✅ Generated token:', token);

const decoded = verifyAccessToken(token);
console.log('✅ Decoded token:', decoded);
