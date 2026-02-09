const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const verify = promisify(jwt.verify);

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });

  const [, token] = header.split(' ');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // id + role
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};