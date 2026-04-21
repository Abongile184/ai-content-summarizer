const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//had to add this because tailwind was being loaded later
//const CopyWebpackPlugin = require('copy-webpack-plugin'); 

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
    text: "./src/Text-Content/TextUi.js",
    video: "./src/Video-Content/VideoUi.js",
  },
  output: {
    filename: "[name].js",    // dynamic output names: main.js, text.js, video.js
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: "/",
  },
  devtool: process.env.NODE_ENV === "production"
  ? false
  : "eval-source-map",
  devServer: {
    watchFiles: ["./src/**/*.html"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/contentSummarise.html",
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      filename: "Text-Content/TextUi.html",
      template: "./src/Text-Content/TextUi.html",
      chunks: ["text"],
    }),
    new HtmlWebpackPlugin({
      filename: "Video-Content/VideoUi.html",
      template: "./src/Video-Content/VideoUi.html",
      chunks: ["video"],
    }),
    new MiniCssExtractPlugin({//Switched from style-loader to MiniCssExtractPlugin: ✅ 
      filename: 'styles.css',  //Proper way to fix the "slow Tailwind load" issue.
    }), //styles are built into a single styles.css, which is linked early in the HTML and cached by browsers 

    /* removed this as it affects the app from connecting to cloudflare R2 bucket
     new CopyWebpackPlugin({ 
      patterns: [
        {
          from: path.resolve(__dirname, "src/Transformers/Xenova/distilbart-cnn-6-6"),
          to: path.resolve(__dirname, "dist/Transformers/Xenova/distilbart-cnn-6-6"),
        },
      ],
    }),  */
    
  ],
  experiments: {
  asyncWebAssembly: true,
   topLevelAwait: true,  //Transformers.js Support
},
  module: {
  rules: [
    {
      test: /\.js$/i,
       exclude: /node_modules\/(?!(\@xenova\/transformers)\/).*/, 
      use: {
        loader: "babel-loader",
      },
    },
    {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
    },
    {
      test: /\.html$/i,
      loader: "html-loader",
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: "asset/resource",
    },
    {
      test: /\.wasm$/,
      type: "asset/resource",
    },
    {
      test: /\.bin$/,
      type: "asset/resource",
    },
  ],
},
};
