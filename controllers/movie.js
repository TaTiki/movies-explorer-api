const Movie = require('../models/movie');
const MovieError = require('../models/MovieError');

module.exports.createMovie = (req, res, next) => {
  const { movieId } = req.body;
  const { _id } = req.user;

  Movie.findOne({ owner: _id, movieId })
    .then((movie) => {
      if (movie) {
        return Promise.reject(new MovieError(409, 'movie already exists for that user'));
      }
      return movie;
    })
    .then(() => Movie.create({ ...req.body, owner: req.user._id }))
    .then((movie) => res.status(201).send(movie))
    .catch(next);
};

module.exports.fetchMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.deleteOne({ _id: req.params.movieId, owner: req.user._id })
    .then((data) => {
      if (data.ok !== 1) {
        return Promise.reject(new MovieError());
      }
      if (data.deletedCount === 1) {
        return res.send({ message: 'Фильм успешно удален' });
      }
      return Movie.findById(req.params.movieId)
        .then((movie) => {
          if (movie) {
            return Promise.reject(new MovieError(403, 'вы не можете удалить записи, которые вам не принадлежат'));
          }
          return Promise.reject(new MovieError(404, 'нет фильма с данным id'));
        });
    }).catch(next);
};
