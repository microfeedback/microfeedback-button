import path from 'path';

import serve from 'rollup-plugin-serve';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

const destBase = 'wishes-button';
const destExtension = `${isProd ? '.min' : ''}`;

export default {
  entry: path.resolve('src', 'index.js'),
  format: 'umd',
  moduleName: 'wishes',
  dest: path.resolve('dist', `${destBase}${destExtension}.js`),
  plugins: [
    postcss({
      plugins: [
        autoprefixer(),
        isProd && cssnano(),
      ].filter(plugin => !!plugin),
      extract: path.resolve('dist', `${destBase}${destExtension}.css`),
    }),
    babel({
      presets: ['es2015-rollup'],
      exclude: 'node_modules/**',
    }),
    isProd && uglify(),
    isDev && serve({ contentBase: ['dist', 'examples'], open: true }),
  ].filter(plugin => !!plugin),
};
