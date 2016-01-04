var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var nodeModules = fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    });

var backendConfig = {
    entry: [
        'webpack/hot/signal.js',
        './src/main.js'
    ],
    target: 'node',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'backend.js'
    },
    node: {
        __dirname: true,
        __filename: true
    },
    externals: [
        function (context, request, callback) {
            var pathStart = request.split('/')[0];
            if (nodeModules.indexOf(pathStart) >= 0 && request != 'webpack/hot/signal.js') {
                return callback(null, "commonjs " + request);
            }
            callback();
        }
    ],
    recordsPath: path.join(__dirname, 'build/_records'),
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less)$/),
        new webpack.BannerPlugin('require("source-map-support").install();',
            {raw: true, entryOnly: false}),
        new webpack.HotModuleReplacementPlugin({quiet: true})
    ]
};

module.exports = backendConfig;