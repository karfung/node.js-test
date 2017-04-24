/**
 * 
 */

var webpack = require('webpack');
var path = require("path");


// 第三方插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
//路径
var ROOT_PATH = path.resolve(__dirname);
//Template的文件夹
var TEM_PATH = path.resolve(ROOT_PATH, 'templates');

module.exports = {
 	entry:  
 	{
 		commonCharts: ['./src/main.js'],
    // mobile: path.resolve(APP_PATH, 'mobile.js'),
    //添加要打包在vendors里面的库
    vendors: ['jquery']
 	},
 	output: { 
  		publicPath: "/assets/",
  		path: path.join(__dirname,'/dist'),
      // 文件更新了，但浏览器缓存怎么办？换名字+hash
      // filename: '[name].[hash].js',
    	filename: '[name].js',
    	// chunkFilename: "[id].chunk.js"      
      chunkFilename: "[name].chunk.js"      
  	},
 	devServer:{
      contentBase:'./dist',
      hot: true,
      inline: true,
      //其实很简单的，只要配置这个参数就可以了
      proxy: {
          '/api/*': {
             target: 'http://localhost:5000',
             secure: false
            }
        }
    },
  module: {},
  // 别名系统
  resolve:{},
  // 目标属性选项
  //target:{},
  // 精简代码选项(变相辅助压缩项)
  devtool: false,
  // devtool:'eval-source-map',
  plugins: [
     // 把入口文件里面的数组打包成verdors.js(内置插件)
     // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
     // create a html-template-file with title as title
     new HtmlWebpackPlugin({
      title: '按照模板自动生成的页面',
      template: path.resolve(TEM_PATH, 'index-template.html'),
      filename:'tindex.html',
      // 引用entry的那个入口，可多个
      chunks:['comm`onCharts'],
      // 插入chunks到html的那个标签中
      inject:'head'
      // 其他配置参照官方文档
    }),
     // provide $, jQuery and window.jQuery to every script
     new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ],
	watch: true
}   