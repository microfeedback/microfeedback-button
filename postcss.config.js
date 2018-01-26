const cssnano = require('cssnano');

const PROD = process.env.NODE_ENV === 'production';

module.exports = {
  plugins: [
    require('autoprefixer'),
    PROD && cssnano(),
  ],
};
