import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

/**
 * @type {import("rollup").RollupOptions}
 */
export default {
  input: 'src/frontend/index.js',
  output: {
    file: 'public/bundle.js',
    format: 'umd'
  },
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
      preventAssignment: true
    }),
    commonjs({include: /node_modules/}),
    resolve({browser: true}),
    babel({ exclude: "node_modules/**", babelHelpers: 'bundled' })
  ]

}