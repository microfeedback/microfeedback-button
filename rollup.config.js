import path from 'path';

import commonjs from 'rollup-plugin-commonjs';
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
const isDocs = process.env.NODE_ENV === 'docs';

const destBase = 'microfeedback-button';
const destExtension = `${isProd ? '.min' : ''}`;

const file = path.resolve(
  isDev || isDocs ? 'docs' : 'dist',
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
    commonjs(),
    // TODO: only include this in .all.js build
    resolve(),
    isProd && uglify(),
    isDev && serve({contentBase: 'docs', open: true}),
    filesize(),
  ].filter(plugin => Boolean(plugin)),
};
