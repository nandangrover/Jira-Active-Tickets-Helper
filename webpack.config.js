const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const SRC = path.resolve(__dirname, 'src/images');
const isDevEnv = process.env.NODE_ENV === 'development';
module.exports = {
    mode: process.env.NODE_ENV,
    entry: "./src/js/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        chunkFilename: '[name].bundle.js',
        filename: "index.bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(jpe?g|png|gif|mp3)$/i,
                include: SRC,
                loaders: ['file-loader']
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 8192
                    }
                  }
                ]
            },
        ]
    },
    "devtool": isDevEnv ? "source-map" : "",
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([
        {
          from: 'src/chrome/**/*',
          to: path.resolve(__dirname, 'dist'), flatten: true,
        },
        {
            from: 'src/webfonts/*',
            to: path.resolve(__dirname, 'dist/webfonts'), flatten: true,
        },
        ], {
            debug: true
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'scoped.css'
        }),
    ]
};
