const { celebrate, Joi } = require('celebrate');
const express = require('express');

const { fetchMe, updateMe } = require('../controllers/user');

const router = express.Router();

router.get('/me', fetchMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateMe);

module.exports = router;
