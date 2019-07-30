const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const glob = require("glob");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

let pluginsOptions = [
    new CleanWebpackPlugin(),
    new WebpackMd5Hash(),
    new MiniCssExtractPlugin({
        filename: './css/[name].css',
        chunkFilename: './css/[id].css',
    }),
    new CopyWebpackPlugin([{
        from: './src/fonts',
        to: './fonts'
    },
        {
            from: './src/favicon',
            to: './favicon'
        },
        {
            from: './src/img',
            to: './img'
        },
    ]),
];

let pages = glob.sync(__dirname + '/src/pug/*.pug');
pages.forEach(function (file) {
    let base = path.basename(file, '.pug');
    pluginsOptions.push(
        new HtmlWebpackPlugin({
            filename: './' + base + '.html',
            template: './src/pug/' + base + '.pug',
            inject: true,
        })
    )
});

module.exports = {
    entry: ['./src/js/index.js', './src/scss/main.scss'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: devMode ? '[name].js' : '[name].[hash].js',
        publicPath: "/dist"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.pug$/,
                exclude: ['/node_modules/', '/src/pug/partials'],
                loader: 'pug-loader', 
                query: { 
                    pretty:true
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src/js'),
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ]
    },
    plugins: pluginsOptions
    // ,optimization: {
    //     minimizer: [new TerserPlugin({
    //         test: /\.(js)(\?.*)?$/i,
    //     })],
    // }
};