const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    main: [
      'webpack-hot-middleware/client?reload=true',
      './src/entrypoint.js'
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  devServer: {
    hot: true,
    open: ['/home'],
    host: '0.0.0.0',
    port: 3000,
    watchFiles: {
      paths: ['views/**/*'],
      options: {
        usePolling: true,
        poll: 500,
      },
    },
    static: [
      {
        directory: path.join(__dirname, 'views'),
      },
      {
        directory: path.join(__dirname, 'assets'),
        publicPath: "/assets"
      }
    ],
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:9000'
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};
