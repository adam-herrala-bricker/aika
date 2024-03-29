module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'es2021': true,
    'jest/globals': true,
  },
  'extends': ['eslint:recommended'],
  'plugins': ['jest'],
  'overrides': [
    {
      'env': {
        'node': true
      },
      'files': [
        '.eslintrc.{js,cjs}'
      ],
      'parserOptions': {
        'sourceType': 'script'
      }
    }
  ],
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'never'
    ],
    'arrow-spacing': [
      'error', {'before': true, 'after': true}
    ],
    'spaced-comment': ['error', 'always']
  },
};
