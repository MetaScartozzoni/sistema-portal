import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';

export default {
  input: 'src/index.js',
  output: [
    { file: 'dist/index.mjs', format: 'esm' },
    { file: 'dist/index.js', format: 'cjs', exports: 'named' }
  ],
  external: ['axios', 'zustand'],
  plugins: [
    resolve(),
    commonjs(),
    esbuild({ jsx: 'automatic', target: 'esnext' })
  ]
};
