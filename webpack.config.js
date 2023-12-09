const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
  mode,
  target,
  devtool,
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: 'images/[name][ext]',
  },
  plugins: [
    new HtmlBundlerPlugin({
      entry: 'src/',
      css: {
        outputPath: path.join(__dirname, 'dist/css/'),
      },
      js: {
        outputPath: path.join(__dirname, 'dist/js/'),
      },
      preprocessor: 'nunjucks',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(c|sa|sc)ss$/i,
        use: ['css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    open: true,
    compress: true,

    static: {
      directory: path.join(__dirname, './dist'),
    },

    watchFiles: {
      paths: ['src/**/*.*'],
      options: {
        usePolling: true,
      },
    },
  },
};
