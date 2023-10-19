// eslint-disable-next-line import/no-commonjs
module.exports = {
  extends: [
    'algolia',
    'algolia/typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/prefer-optional-chain': 'off',
  },
};
