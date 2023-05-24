const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');

const getJwtToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

/* const isAuthorized = async (token) => {
  try {
    const data = await jwt.verify(token, JWT_SECRET);
    return !!data;
  } catch (err) {
    return false;
  }
}; */

module.exports = { getJwtToken /* isAuthorized */ };
