// const { isAuthorized } = require('../utils/jwt');

const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');

const UnauthorizedError = require('../errors/UnauthorizedError');

const handleAuthError = (res) => {
  throw new UnauthorizedError('Необходима авторизация');
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    // payload = await isAuthorized(token);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
