import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', 'LICENSE', '*.tgz'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['bin/**/*.{js,cjs}'],
    rules: {
      'no-process-exit': 'off',
    },
  },
  eslintConfigPrettier,
];
