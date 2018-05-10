const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const NODE_ENV = process.env.NODE_ENV;
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
var autoprefixer = require('autoprefixer');


const setPath = function(folderName) {
  return path.join(__dirname, folderName);
}

const buildingForLocal = () => {
  return (NODE_ENV === 'development');
};


const extractHTML = new HtmlWebpackPlugin({
  favicon:'./src/img/favicon.ico',
  title: 'History Search',
  filename: 'home.html',
  inject: true,
  template: path.resolve(__dirname,"./home.html"),
  minify: {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    html5: true,
    minifyCSS: true,
    removeComments: true,
    removeEmptyAttributes: true
  },
  environment: process.env.NODE_ENV,
  isLocalBuild: buildingForLocal(),
  imgPath: (!buildingForLocal()) ? 'assets' : 'src/assets'
});


const config = {
  /**
   * You can use these too for bigger projects. For now it is 0 conf mode for me!
   */
  // entry: {
  //   build: path.join(setPath('src'), 'main.js'),
  //   vendor: path.join('setPath('src'), 'vendor.js')
  // },
  // output: {
  //   path: buildingForLocal() ? path.resolve(__dirname) : setPath('dist'), //this one sets the path to serve
  //   publicPath: setPublicPath(),
  //   filename: buildingForLocal() ? 'js/[name].js' : 'js/[name].[hash].js'
  // },
  
  optimization:{
    runtimeChunk: false,
    splitChunks: {
      chunks: "all", //Taken from https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
    }
  },
  resolveLoader: {
    modules: [setPath('node_modules')]
  },
  mode: buildingForLocal() ? 'development' : 'production',
  devServer:{//配置此静态文件服务器，可以用来预览打包后项目
      contentBase:path.resolve(__dirname,'dist'),//开发服务运行时的文件根目录
      host:'localhost',//主机地址
      port:9090,//端口号
      compress:true//开发服务器是否启动gzip等压缩
  },
  resolve: {
    alias: {
        vue: 'vue/dist/vue.js',
    }
  },
  plugins: [
    extractHTML,
    require('autoprefixer'),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "style/styles.[hash].css",
      chunkFilename: "[id].css"
    }),
    new webpack.DefinePlugin({
      'process.env': {
        isStaging: (NODE_ENV === 'development' || NODE_ENV === 'staging'),
        NODE_ENV: '"'+NODE_ENV+'"'
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // postcss: [require('postcss-cssnext')()],
          // options: {
          //     extractCSS: true
          // },
          loaders: {
            js: 'babel-loader'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: "babel-loader",
          options: { presets: ['babel-preset-env'],plugins: ["transform-vue-jsx"] }
        }]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader","postcss-loader"
        ]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.scss$/,
        use: !buildingForLocal() ?
            [
              MiniCssExtractPlugin.loader,
              "css-loader", 'sass-loader'
            ] :
            [{
                loader: "style-loader" // creates style nodes from JS strings
              }, {
                loader: "css-loader" // translates CSS into CommonJS
              }, {
                loader: "sass-loader" // compiles Sass to CSS
              }]
      },
      {
        test:/\.(png|jpg|gif)$/,
        loader:"file-loader",
        query:{
          name:'./img/[name].[ext]?[hash]',
        }
      },

      {//字体文件
          test:/\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
          loader:'file-loader',
          query:{
            name:'./font/[name].[ext]?[hash]',
          }
      }   
    ]
  },
};
module.exports = config; 