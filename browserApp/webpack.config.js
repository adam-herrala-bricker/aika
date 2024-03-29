const path = require('path');
const webpack = require('webpack');

const config = (env, argv) => {
  const backend_url = argv.mode === 'production'
    ? 'https://nastytoboggan.fi'
    // : 'http://localhost:3001';
    : 'http://192.168.178.24:3001';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url) // makes BACKEND_URL a global var
      })
    ]
  };
};

module.exports = config;
