const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  entry: "./src/main",
  output: {
    // 出口文件夹必须是绝对路径
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  // 配置 webpack-dev-server，只有在运行 webpack-dev-server 命令时以下配置才会生效
  devServer: {
    // 配置启动服务的根路径，一般是打包目录
    contentBase: "/dist",
    // 自动打开浏览器
    open: true,
  },

  // webpack允许 import 语句中省略文件后缀名(比如 import a from './a')，默认先匹配js文件，然后是json，若没有则会报错，如果要匹配ts文件，就需要配置 resolve
  resolve: {
    // 先匹配前面的后缀名
    extensions: [".ts", ".js", ".json"],
  },

  module: {
    rules: [
      {
        // 匹配后缀为.css的文件
        test: /\.css$/,
        // loader 的执行顺序是从后往前
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        exclude: [path.resolve(__dirname, "src/components")],
      },
      {
        // 匹配后缀为.css的文件
        test: /\.css$/,
        // loader 的执行顺序是从后往前
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            // 组件的css样式打包成单独模块，这样不会污染全局样式
            options: {
              modules: {
                localIdentName: "[path][name]__[local]--[hash:base64:5]",
              },
            },
          },
        ],
        include: [path.resolve(__dirname, "src/components")],
      },
      {
        // 匹配后缀为 eot|woff2|woff|ttf|svg 的文件
        test: /\.(eot|woff2|woff|ttf|svg)$/,
        use: [
          {
            // 生产环境下将字体图标打包到单独文件夹
            loader: "file-loader",
            options: {
              outputPath: "iconfont",
            },
          },
        ],
      },
      {
        // 匹配后缀为 .ts 的文件
        test: /\.ts$/,
        use: ["ts-loader"],
        // 将 node_modules 下的 ts 文件排除在外
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // 指定html模板,运行build后会在打包目录(比如dist)生成引入了打包后的js文件(比如main.js)的html文件
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    // 运行build后会清理(删除)打包文件夹(比如dist)
    new CleanWebpackPlugin(),
    // 将css提取成单独文件
    new MiniCssExtractPlugin(),
  ],
  // 设置当前环境为生产环境
  mode: "production",
};
