const gulp        = require('gulp')
const browserSync = require('browser-sync')
const reload      = browserSync.reload
const nodemon     = require('gulp-nodemon')


gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000", // port of node server
    });
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch(["./views/*.jade"], reload);
});

gulp.task('nodemon', function (cb) {
    var callbackCalled = false;
    return nodemon({script: './app.js'}).on('start', function () {
        if (!callbackCalled) {
            callbackCalled = true;
            cb();
        }
    });
});