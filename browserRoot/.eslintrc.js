module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
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
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
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
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    'react/no-unknown-property': 0,
    'react-hooks/exhaustive-deps': 0,
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 'never'
    ],
    'arrow-spacing': [
      'error', {'before': true, 'after': true}
    ],
    'spaced-comment': ['error', 'always'],
    'no-unused-vars': [
      'error', {
        'varsIgnorePattern': 'React'
      }
    ]
  },
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
};
