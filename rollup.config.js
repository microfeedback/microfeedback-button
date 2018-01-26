import {resolve} from 'path';

import nodeResolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';

const env = process.env.NODE_ENV;

const config = {
  input: resolve('src', 'index.js'),
  plugins: [],
};

if (env === 'development' || env === 'production') {
  config.output = {
    name: 'microfeedback',
    format: 'umd',
    globals: {sweetalert2: 'swal'},
  };
  config.plugins.push(
    postcss(),
    babel({
      exclude: 'node_modules/**',
    }),
    nodeResolve({
      jsnext: true,
    })
  );
}

if (env === 'production') {
  config.plugins.push(
    uglify()
  );
}

if (process.env.SERVE === 'true') {
  config.plugins.push(
    serve({contentBase: ['dist', 'examples'], open: true})
  );
}

config.plugins.push(filesize());
export default config;
