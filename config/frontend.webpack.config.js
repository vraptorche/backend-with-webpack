var path = require('path');
var webpack = require('webpack');
var frontEndConfig = {
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        './static/js/main.js'
    ],
    output: {
        path: path.join(__dirname, 'static/build'),
        publicPath: 'http://localhost:3000/build',
        filename: 'frontend.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({quiet: true})
    ]
}

module.exports = frontEndConfig;