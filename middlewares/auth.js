const { isAuthorized } = require('../utils/jwt');

const {
  UNAUTHORIZED,
} = require('../errors/errors');

const handleAuthError = (res) => {
  res
    .status(UNAUTHORIZED)
    .send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = isAuthorized(token);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  return next();
};
