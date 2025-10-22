import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
    issuer: 'scory-api',
    audience: 'scory-client',
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
    issuer: 'scory-api',
    audience: 'scory-client',
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
      issuer: 'scory-api',
      audience: 'scory-client',
    });
  } catch (error) {
    throw new Error(`Invalid access token: ${error.message}`);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'scory-api',
      audience: 'scory-client',
    });
  } catch (error) {
    throw new Error(`Invalid refresh token: ${error.message}`);
  }
};
