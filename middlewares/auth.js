const jwt = require('jsonwebtoken');
const { SUPERSTRONGSECRET } = require('../utils/constants');
const UnauthorizedError = require('../errors/UnauthorizedError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима  авторизаци.'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, SUPERSTRONGSECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима  авторизаци.'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
