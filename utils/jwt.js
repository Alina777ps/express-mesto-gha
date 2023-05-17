const jwt = require('jsonwebtoken');

const JWT_SECRET = '';

const getJwtToken = (id) => jwt.sign({ id }, JWT_SECRET);

const isAuthorized = async (token) => {
  const data = await jwt.verify(token, JWT_SECRET);
  return !!data;
};

module.exports = { getJwtToken, isAuthorized };
