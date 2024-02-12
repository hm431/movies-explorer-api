const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SUPERSTRONGSECRET } = require('../utils/constants');
const Conflict = require('../errors/Conflict');
const BadRequest = require('../errors/NotFound');
const NotFound = require('../errors/NotFound');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const { userId } = req.user;

  User.findById({ _id: userId }).orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.getIdUsers = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId).orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Пользователь с таким id не найден'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Ошибка в запросе'));
      } else {
        next(err);
      }
    });
};

module.exports.createUsers = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      password: hash,
      email: req.body.email,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => {
      res.status(201).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,

      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Неверные данные'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Ошибка в запросе'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAbout = (req, res, next) => {
  const { name, about } = req.body;
  const { userId } = req.user;
  User.findByIdAndUpdate({ _id: userId }, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Ошибка в запросе'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { userId } = req.user;
  User.findByIdAndUpdate({ _id: userId }, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Ошибка в запросе'));
      } else {
        next(err);
      }
    });//
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      res.send({
        token: jwt.sign({ userId }, SUPERSTRONGSECRET, { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      next(err);
    });
};
