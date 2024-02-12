const Movie = require('../models/movie');


const BadRequest = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');


module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send({ data: movie }))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId  } = req.body;
  const { userId } = req.user;

  Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, link, owner: userId })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Ошибка запроса'));
      } else {
        next(err);
      }
    });
};

module.exports.deliteMovie = (req, res, next) => {
  const { userId } = req.user;

  Movie.findById(req.params.movieId).orFail()
    .then((movie) => {
      if (userId === movie.owner.toString()) {
        return (movie.deleteOne()
          .then(() => res.send({ movie }))
        );
      }
      return (next(new Forbidden('Отказано в удалении карточки.')));
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Карточка с такими данными не найдена'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Ошибка в запросе'));
      } else {
        next(err);
      }
    });
};