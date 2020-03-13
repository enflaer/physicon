const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const pluginsOptions = [
  new CleanWebpackPlugin(),
  new WebpackMd5Hash(),
  new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: ['You application is running here http://localhost:9006'],
      notes: ['Some additionnal notes to be displayed unpon successful compilation'],
    },
    clearConsole: true,
  }),

  new CopyWebpackPlugin([
    {
      from: './src/img',
      to: './assets/img',
    },
    {
      from: './src/send.php',
      to: './',
    },
  ]),
];

const pages = glob.sync(__dirname + '/src/*.pug');
pages.forEach(function (file) {
  const base = path.basename(file, '.pug');
  pluginsOptions.push(
    new HtmlWebpackPlugin({
      filename: './' + base + '.html',
      template: './src/' + base + '.pug',
      inject: true,
    })
  );
});

module.exports = (env, argv) => ({
  entry: ['./src/js/index.js', './src/scss/main.scss'],
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: argv.mode === 'development' ? 'assets/js/[name].js' : 'assets/js/[name].[contenthash].js',
    publicPath: '/',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: [/node_modules/, /node_modules\/(?!(dom7|swiper)\/).*/],
        loader: 'eslint-loader',
        options: {
          fix: true,
        },
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/, /node_modules\/(?!(dom7|swiper)\/).*/],
        loader: 'babel-loader',
        options: {
          configFile: path.resolve(__dirname, 'babel.config.js')
        },
        include: path.resolve(__dirname, 'src/js'),
      },
      {
        test: /\.pug$/,
        exclude: ['/node_modules/', '/src/pug/partials'],
        use: [
          "html-loader",
          "pug-html-loader"
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              sourceMap: argv.mode === 'development',
              hmr: argv.mode === 'development',
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: argv.mode === 'development',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: argv.mode === 'development',
              plugins: () => [require('autoprefixer')()],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: argv.mode === 'development',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: './assets/fonts/[name].[contenthash].[ext]',
        },
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        // Specify enforce: 'pre' to apply the loader
        // before url-loader/svg-url-loader
        // and not duplicate it in rules with them
        enforce: 'pre',
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 10 * 1024,
        },
      },

    ],
  },
  plugins: [
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      disable: argv.mode === 'development',
      pngquant: {
        quality: '80-90'
      }
    }),
    new MiniCssExtractPlugin({
      filename: argv.mode === 'development' ? 'assets/css/[name].css' : "assets/css/[name].[contenthash].css",
      chunkFilename: argv.mode === 'development' ? 'assets/css/[id].css' : 'assets/css/[id].[contenthash].css',
    }),
  ].concat(pluginsOptions),
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== 'my-excluded-chunk';
      },
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
        styles: {
          test: /\.css$/,
          name: 'styles',
          chunks: 'all',
          enforce: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        sourceMap: argv.mode === 'development',
        cache: argv.mode !== 'development',
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: argv.mode !== 'development',
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
      }),
    ],

  },
  stats: {
    colors: true,
    hash: true,
    version: true,
    timings: true,
    assets: false,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: false,
    publicPath: false,
  },
  devServer: {
    quiet: true,
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    publicPath: '/',
    inline: true,
    overlay: true,
    contentBase: 'dist',
    watchContentBase: true,
    host: 'localhost',
    port: 9006,
  },
});
