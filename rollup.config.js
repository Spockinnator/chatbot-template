import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

// ESM build (React as peer dependency)
const esmConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/astermind-chatbot.esm.js',
    format: 'esm',
    sourcemap: true
  },
  external: ['react', 'react-dom', 'react/jsx-runtime', '@astermind/cybernetic-chatbot-client'],
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist'
    })
  ]
};

// UMD build (React as peer dependency)
const umdConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/astermind-chatbot.umd.js',
    format: 'umd',
    name: 'AsterMindChatbot',
    sourcemap: true,
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react/jsx-runtime': 'React',
      '@astermind/cybernetic-chatbot-client': 'AsterMindCyberneticClient'
    }
  },
  external: ['react', 'react-dom', 'react/jsx-runtime', '@astermind/cybernetic-chatbot-client'],
  plugins: [
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' })
  ]
};

// Standalone UMD build (includes React for vanilla JS)
const standaloneConfig = {
  input: 'src/init.ts',
  output: {
    file: 'dist/astermind-chatbot.min.js',
    format: 'iife',
    name: 'AsterMindChatbot',
    sourcemap: true
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    resolve({
      browser: true
    }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    production && terser()
  ]
};

export default [esmConfig, umdConfig, standaloneConfig];
