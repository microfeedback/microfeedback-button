import path from 'path';

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

const file = path.resolve(isDev || isDocs ? 'docs' : 'dist', `${destBase}${destExtension}.js`);

export default {
  input: path.resolve('src', 'index.js'),
  external: ['html2canvas'],
  globals: { html2canvas: 'html2canvas' },
  output: { file, format: 'umd' },
  name: 'microfeedback',
  plugins: [
    postcss({
      plugins: [
        autoprefixer(),
        isProd && cssnano(),
      ].filter(plugin => !!plugin),
      // extract: path.resolve('dist', `${destBase}${destExtension}.css`),
    }),
    babel({
      presets: ['es2015-rollup'],
      plugins: ['transform-object-assign'],
      exclude: 'node_modules/**',
    }),
    isProd && uglify(),
    isDev && serve({ contentBase: 'docs', open: true }),
    filesize(),
  ].filter(plugin => !!plugin),
};
