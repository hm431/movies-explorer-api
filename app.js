const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { login, createUsers } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { errorMiddlewares } = require('./middlewares/errorMiddlewares');
const NotFound = require('./errors/NotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const mongobd = 'mongodb://localhost:27017/moviesexplorerdb';
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongobd, {
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// auth,
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login); // Логин пользователя

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
  }),
}), createUsers); // Создание пользователя

app.use('/movies', auth, require('./routes/movies'));
app.use('/users', auth, require('./routes/users'));

app.use('/', () => {
  throw new NotFound('Путь не найден');
});
app.use(errorLogger);
app.use(errors());
app.use(errorMiddlewares);
app.listen(PORT);
