var defaultConfig = {
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loaders: ['monkey-hot', 'babel']},
        ]
    }
};

module.exports = defaultConfig;