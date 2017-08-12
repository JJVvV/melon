var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var port = 3003;
var globalPath = '127.0.0.1';
var localhost = 'localhost';
new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(port, globalPath, function (err, result) {
      if (err) {
        console.log(err);
      }

      console.log('Listening at localhost:' + port);
    });
