module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb'],
  rules: {
    'no-console': 'off',
  },
  env: {
    node: true,
    mocha: true,
  },
  overrides: [
    {
      files: ['*-test.js'],
      rules: {
        'no-unused-expressions': 'off',
        'import/no-unresolved': 'off',
      },
    },
  ],
  // workaround for non-react apps eslint warning: https://github.com/DRD4-7R/eslint-config-7r-building/issues/1
  settings: {
    react: {
      version: '999.999.999',
    },
  },
};
