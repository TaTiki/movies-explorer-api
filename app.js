const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');

const handleError = require('./middleware/handleError');
const { createUser, loginUser } = require('./controllers/user');
const auth = require('./middleware/auth');
const MovieError = require('./models/MovieError');
const { requestLogger, errorLogger } = require('./middleware/logger');

const { DB = 'mongodb://localhost:27017/moviesdb', NODE_ENV } = process.env;

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30)
      .alphanum(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), loginUser);

app.use(auth);

app.use('/users', require('./routes/user'));
app.use('/movies', require('./routes/movie'));

app.use('/', (req) => {
  throw new MovieError(404, `Не можем найти ${req.path} маршрут`);
});

app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(3000, () => {
  console.log(`NODE_ENV: ${NODE_ENV}`);
  console.log(`db: ${DB}`);
  console.log('server http://localhost:3000');
});
