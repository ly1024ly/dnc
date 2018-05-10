var path = require("path");
require("babel-polyfill");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
console.log(NODE_ENV)
const setPath = function(folderName) {
  return path.join(__dirname, folderName);
}

module.exports = {
  optimization:{
    runtimeChunk:false,
    splitChunks:{
      chunks:"all"
    }
  },
  
  
  resolveLoader:{
     modules: [setPath('node_modules')]
  },
  mode:NODE_ENV === 'development' ? "development" : "production",
  devServer:{//配置此静态文件服务器，可以用来预览打包后项目
      contentBase:path.resolve(__dirname,'dist'),//开发服务运行时的文件根目录
      host:'localhost',//主机地址
      port:9090,//端口号
      compress:true//开发服务器是否启动gzip等压缩
  },
  plugins:[
    new MiniCssExtractPlugin({
      filename:"style/style.[hash].css",
      chunkFilename:'[id].css'
    }),
    //new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env':{
        NODE_ENV:NODE_ENV === 'development' ? "development" : "production"
      }
    }),
    new HtmlWebpackPlugin({
      favicon:'./src/img/favicon.ico',
      filename:"./view/home.html",
      template:path.resolve(__dirname,"./home.html"),
      hash:true,
      inject:true,
      minify:{
        removeAttributeQuotes:true,
        collapseWhitespace:true,
        minifycss:true,
        removeComments:true,
        removeEmptyAttributes:true
      },
      environment:process.env.NODE_ENV,
      isLocalBuild:NODE_ENV === 'development',
      imgPath:(!NODE_ENV === 'development') ? "assets" : "src/assets"
    })
  ],
  module:{
    rules:[
      {
        test:/\.vue$/,
        loader:'vue-loader',
        options:{
          loaders:{
            js:'babel-loader'
          }
        }
      },
      {
        test:/\.js$/,
        exclude:/node_modules/,
        use:[{
          loader:"babel-loader",
          options:{ presets:["env"]}
        }]
      },
      {
        test:/\.css$/,
        use:[
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },
      {
        test:/\.scss$/,
        use:!NODE_ENV === 'development' ? 
        [
          MiniCssExtractPlugin.loader,
          'css-loader','sass-loader'
        ] : [
          {loader:'css-loader'},
          {loader:'style-loader'},
          {loader:'sass-loader'}
        ]
      },{
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
  }
}