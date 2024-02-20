const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_REG } = require('../utils/constants');
// TODo Добавить функции контроллеров
const { getMovie, createMovie, deliteMovie } = require('../controllers/movies');

router.get('/', getMovie); // возвращает все сохранённые текущим пользователем фильмы

router.post( // создаёт фильм
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(URL_REG),
      trailer: Joi.string().required().pattern(URL_REG),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      thumbnail: Joi.string().required().pattern(URL_REG),
      movieId: Joi.number().required(),
    }),
  }),
  createMovie,
);

router.delete('/:movieId', celebrate({ // удаляет сохранённый фильм по id
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deliteMovie);

module.exports = router;
