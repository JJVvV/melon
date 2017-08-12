var path = require('path');
var webpack = require('webpack');
console.log('**********webpack started *************');

module.exports = {
  devtool: 'source-map',
    devServer: {
        contentBase: 'examples',
        historyApiFallback: true,
        hot: true,
        inline: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
  entry: {
      // ,
      'App': ['webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:3003', './example/example'],
  },
  output: {
    path: path.join(__dirname, './public/js'), //运行webpack生成的文件存放目录
    filename: '[name].bundle.js',
    publicPath: '/static/',

  },

  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [

      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, 'examples'), path.join(__dirname, 'src'), path.join(__dirname), 'example'],
        query: {
          presets: ['es2015', 'stage-0'],

          plugins: [

            [
              "transform-react-jsx",
              {
                "pragma": "create"
              }
            ]

          ]
        }
      }
    ]
  }

};
