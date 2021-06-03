const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const MovieError = require('../models/MovieError');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      user.set('password', undefined);
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new MovieError(409, 'адрес электронной почты уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new MovieError(401));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new MovieError(401));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.fetchMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new MovieError(404, `Пользователь с id ${_id} не найден!`));
      }
      return res.send(user);
    }).catch(next);
};

module.exports.updateMe = (req, res, next) => {
  const { email, name } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return Promise.reject(new MovieError(404, 'Такого профиля нет в базе данных!'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new MovieError(409, 'адрес электронной почты уже существует'));
      } else {
        next(err);
      }
    });
};
