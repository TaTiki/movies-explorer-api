module.exports = (err, req, res, next) => {
  if (err.name === 'MovieError') {
    switch (err.code) {
      case 500:
        return res.status(500).send({ message: 'На сервере произошла ошибка' });
      case 404:
        return res.status(404).send({ message: err.message });
      case 401:
        return res.status(401).send({ message: 'Неправильный email или пароль' });
      case 409:
        return res.status(409).send({ message: err.message });
      case 403:
        return res.status(403).send({ message: err.message });
      default:
        return res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
  return res.status(500).send({ message: 'На сервере произошла ошибка' });
};
