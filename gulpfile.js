// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    react = require('gulp-react'),
    reactify = require('reactify'),
    browserify = require('browserify'),
    htmlreplace = require('gulp-html-replace'),
    babelify = require('babelify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');
var buffer = require('vinyl-buffer');


// create a default task and just log a message
gulp.task('default', function() {
    return browserify({entries: './client/tweetStream.jsx', extensions: ['.jsx'], transform: [babelify, reactify]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename('app.js'))
        .pipe(gulp.dest('public/js/'))
});

