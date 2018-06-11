import {resolve} from 'path';

import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import serve from 'rollup-plugin-serve';
import {uglify} from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';

const env = process.env.NODE_ENV;

const config = {
  plugins: [],
};

if (env === 'cjs' || env === 'es') {
  config.input = resolve('src', 'index.js');
  config.output = {format: env};
  config.external = ['sweetalert2'];
  config.plugins.push(postcss(), babel());
}

if (env === 'development' || env === 'production') {
  config.input = resolve('src', 'bundle.js');
  config.output = {
    name: 'microfeedback',
    format: 'umd',
    globals: {sweetalert2: 'swal'},
  };
  config.plugins.push(
    postcss(),
    nodeResolve({
      jsnext: true,
    }),
    babel({
      exclude: ['**/*.json'],
    }),
    json()
  );
}

if (env === 'production') {
  config.plugins.push(uglify());
}

if (process.env.SERVE === 'true') {
  config.plugins.push(serve({contentBase: ['dist', 'examples'], open: true}));
}

config.plugins.push(filesize());
export default config;
