import jwt from 'jsonwebtoken';

const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyAccessToken = (token) => {
  try {
    
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch(error) {
    throw new Error('Invalid or expired access token');
  }
};

const verifyRefreshToken = (token) => {
  try {
    
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired refresh token')
  }
};

export {
  generateAccessToken, 
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
