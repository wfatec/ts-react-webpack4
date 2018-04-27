const path = require('path')
const webpack = require('webpack')

const config = require('./config')
const constants = require('./constants')
const styleLoaders = require('./style-loaders')
const plugins = require('./plugins')
const { assetsPath, resolve } = require('./utils')
const optimization = require('./optimization')

module.exports = {
    entry: {
        app: ['babel-polyfill', './src/index.tsx']
    },
    output: {
        path: config.assetsRoot,
        filename:
            constants.APP_ENV === 'dev'
                ? '[name].js'
                : assetsPath('js/[name].[chunkhash].js'),
        chunkFilename:
            constants.APP_ENV === 'dev'
                ? '[name].js'
                : assetsPath('js/[name].[id].[chunkhash].js'),
        publicPath: config.assetsPublicPath
    },
    devServer:{//配置此静态文件服务器，可以用来预览打包后项目
        contentBase:path.resolve(__dirname,'dist'),//开发服务运行时的文件根目录
        host:'localhost',//主机地址
        port:9090,//端口号
        compress:true//开发服务器是否启动gzip等压缩
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        modules: [resolve('src'), resolve('node_modules')],
        alias: {
            '@utils': resolve('src/utils'),
            '@assets': resolve('src/assets'),
            '@components': resolve('src/components'),
            '@css-modules': resolve('src/styles/css-modules')
        }
    },
    module: {
        rules: [
            ...styleLoaders,
            {
                test: /\.(ts(x?)|js(x?))$/,
                include: [resolve('src')],
                exclude: /node_modules/,
                use: [
                    'cache-loader',
                    'thread-loader',
                    'babel-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            // IMPORTANT! use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
                            happyPackMode: true,
                            transpileOnly: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins,
    optimization,
    devtool: config.sourceMap ? '#source-map' : false
}
