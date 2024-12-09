const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');
const chokidar = require('chokidar');

const app = express();
const config = require('./webpack.config.js');

const compiler = webpack(config);

// dist以下のbundleを監視
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// ホットリロードの有効化
app.use(
  webpackHotMiddleware(compiler, {
    log: console.log,
    heartbeat: 2000,
    reload: true,
  })
);

// 静的ファイルのサーブ
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'views')));

// ファイルの変更を監視
const watcher = chokidar.watch(path.join(__dirname, 'views'), {
  persistent: true,
});

watcher.on('change', (filePath) => {
  console.log(`File changed: ${filePath}`);
  compiler.watch({}, () => {});  // webpackの実行
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
