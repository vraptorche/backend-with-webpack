var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var DeepMerge = require('deep-merge');
var nodemon = require('nodemon');
var WebpackDevServer = require('webpack-dev-server');

var deepmerge = DeepMerge(function (target, source, key) {
    if (target instanceof Array) {
        return [].concat(target, source);
    }
    return source;
});

// generic

var defaultConfig = require('./config/default.webpack.config');

if (process.env.NODE_ENV !== 'production') {
    //defaultConfig.devtool = '#eval-source-map';
    defaultConfig.devtool = 'source-map';
    defaultConfig.debug = true;
}

function config(overrides) {
    return deepmerge(defaultConfig, overrides || {});
}

// frontend

var frontendConfig = config(require('./config/frontend.webpack.config'));

// backend


var backendConfig = config(require('./config/backend.webpack.config'));

// tasks

function onBuild(done) {
    return function (err, stats) {
        if (err) {
            console.log('Error', err);
        }
        else {
            console.log(stats.toString());
        }

        if (done) {
            done();
        }
    }
}

gulp.task('frontend-build', function (done) {
    webpack(frontendConfig).run(onBuild(done));
});

gulp.task('frontend-watch', function () {
    //webpack(frontendConfig).watch(100, onBuild());

    new WebpackDevServer(webpack(frontendConfig), {
        publicPath: frontendConfig.output.publicPath,
        hot: true
    }).listen(3000, 'localhost', function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log('webpack dev server listening at localhost:3000');
            }
        });

});

gulp.task('backend-build', function (done) {
    webpack(backendConfig).run(onBuild(done));
});

gulp.task('backend-watch', function (done) {
    var firedDone = false;
    webpack(backendConfig).watch(100, function (err, stats) {
        if (!firedDone) {
            firedDone = true;
            done();
        }

        nodemon.restart();
    });
});

gulp.task('build', ['frontend-build', 'backend-build']);
gulp.task('watch', ['frontend-watch', 'backend-watch']);

gulp.task('run', ['backend-watch', 'frontend-watch'], function () {
    nodemon({
        execMap: {
            js: 'node'
        },
        script: path.join(__dirname, 'build/backend'),
        ignore: ['*'],
        watch: ['foo/'],
        ext: 'noop'
    }).on('restart', function () {
        console.log('Patched!');
    });
});
