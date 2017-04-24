/**
 * 生产环境配置
 * 
 * "deploy":"webpack  --config webpack.deploy.config.js -p  -d --colors --profile  --display-modules --display-error-details"
 */
var webpack = require('webpack');
var path = require("path");

// 第三方插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
//路径
var ROOT_PATH = path.resolve(__dirname);

var mode_modules_path  =  path.resolve(ROOT_PATH,'node_modules');

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
      // 配置文件只要配置这个参数就可以了
      proxy: {
          '/api/*': {
             target: 'http://localhost:5000',
             secure: false
            }
        }
    },
  // 别名系统
  resolve:{
      alias:{
          echarts: path.resolve(ROOT_PATH,'node_modules/echarts/dist/echarts.min.js'),
          jquery: path.resolve(ROOT_PATH,'node_modules/jquery/dist/jquert.min.js')
      }
  },
  module: {
      loaders:[{ 
        // 图片策略：超过10k的文件从build中获取
        test: /\.(png|jpg)$/,
        // include,exclude 文件夹数组列表
        // 装载原则
        loader: 'url-loader?limit=10000&name=build/[name].[ext]'
      }],
      // 不再解析文件中的依赖，直接打包到目标。(填写文件名称,可以不带后缀)
      noParse:['/jquery.min/']
  },
  externals: {
      // 使用CDN方式加载
      echarts: true,
      // 不用resolve 和 module 中忽略配置了，这里一项就可以默认配置了
      jquery:true
  },
  // 目标属性选项
  //target:{},
  // 精简代码选项(变相辅助压缩项)
  devtool: false,
  // devtool:'eval-source-map',
  plugins: [
      // Compress js files
      new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,  // remove all comments
      },
      compress: {
        warnings: false
      },
      // 压到最小
      minimize: true
    }),
     // 把入口文件里面的数组打包成verdors.js(内置插件)
     new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
     // create a html-template-file with title as title
     new HtmlWebpackPlugin({
      title: '按照模板自动生成的页面',
      template: path.resolve(TEM_PATH, 'index-template.html'),
      filename:'tindex.html',
      // 引用entry的那个入口，可多个
      chunks:['vendors','commonCharts'],
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