const mongoose = require('mongoose');
const { urlDBValidator } = require('../validators/validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: urlDBValidator,
      message: (props) => `${props.value} ссылка недействительна`,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: urlDBValidator,
      message: (props) => `${props.value} ссылка недействительна`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: urlDBValidator,
      message: (props) => `${props.value} ссылка недействительна`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
