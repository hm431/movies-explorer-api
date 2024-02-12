// const StandartError = require('../errors/standartError');
// const standartError = new StandartError('На сервере произошла ошибка')
module.exports.errorMiddlewares = (err, _, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500 ? 'На сервере произошла ошибка.' : err.message;
  res.status(statusCode).send({ message });
  next();
};

// ToDo fix
