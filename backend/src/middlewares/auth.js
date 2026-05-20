const { verifyToken } = require('../utils/jwt');
const { AuthenticationError } = require('../utils/errors');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError('Token manquant');
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    const decoded = verifyToken(token);

    if (!decoded) {
      throw new AuthenticationError('Token invalide ou expiré');
    }

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    const statusCode = error.statusCode || 401;
    const code = error.code || 'UNAUTHORIZED';
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Non autorisé',
      code,
    });
  }
};

module.exports = authMiddleware;
