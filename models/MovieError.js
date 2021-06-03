module.exports = class MovieError extends Error {
  constructor(code = 500, ...params) {
    super(...params);
    this.name = 'MovieError';
    this.code = code;
  }
};
