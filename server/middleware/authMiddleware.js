import { verifyAccessToken } from '../utils/generateToken';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        message: 'Not authorized, no token' 
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Not authorized, token invalid' 
    });
  }
};
