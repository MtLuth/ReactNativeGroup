module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'no-console': 'warn',
    'react/prop-types': 'off',
    'no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
  },
};
