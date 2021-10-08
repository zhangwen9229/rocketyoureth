module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    'prefer-promise-reject-errors': 0,
    'require-await': 0,
    'no-unused-vars': 0,
    'no-console': 0,
    eqeqeq: 0
  }
}
