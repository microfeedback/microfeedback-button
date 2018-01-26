import path from 'path';

import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

const destBase = 'microfeedback-button';
const destExtension = `${isProd ? '.min' : ''}`;

const file = path.resolve(
   'dist',
  `${destBase}${destExtension}.js`
);

export default {
  input: path.resolve('src', 'index.js'),
  output: {
    file,
    name: 'microfeedback',
    format: 'umd',
    globals: {sweetalert2: 'swal'},
  },
  plugins: [
    postcss({
      plugins: [autoprefixer(), isProd && cssnano()].filter(plugin => Boolean(plugin)),
      // extract: path.resolve('dist', `${destBase}${destExtension}.css`),
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    // TODO: only include this in .all.js build
    resolve({
      jsnext: true,
    }),
    isProd && uglify(),
    isDev && serve({contentBase: ['dist', 'examples'], open: true}),
    filesize(),
  ].filter(plugin => Boolean(plugin)),
};
