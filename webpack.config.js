const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 3000,
    static: [
      {
        directory: path.join(__dirname, 'views'),
      },
      {
        directory: path.join(__dirname, 'assets'),
      }
    ],
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};
