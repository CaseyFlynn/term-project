// grab our gulp packages
var gulp  = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    react = require('gulp-react'),
    reactify = require('reactify'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    rename = require('gulp-rename'),
    buffer = require('vinyl-buffer'),
    glob = require('glob');


// create a default task and just log a message
gulp.task('default', ['app','sentiment']);

// create a default task and just log a message
//gulp.task('app', function() {
//    var jsxFiles = glob.sync('./client/*.jsx');
//    return browserify({entries:jsxFiles, extensions: ['.jsx'], transform: [babelify, reactify]})
//        .bundle()
//        .pipe(source('bundle.js'))
//        .pipe(buffer())
//        .pipe(uglify())
//        .pipe(rename('app.js'))
//        .pipe(gulp.dest('public/js/'))
//});
gulp.task('app', function() {
    return browserify({entries:'./client/tweetStream.jsx', extensions: ['.jsx'], transform: [babelify, reactify]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename('app.js'))
        .pipe(gulp.dest('public/js/'))
});


// create a default task and just log a message
gulp.task('sentiment', function() {
    return browserify({entries:'./client/sentimentAnalysis.jsx', extensions: ['.jsx'], transform: [babelify, reactify]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename('sentiment.js'))
        .pipe(gulp.dest('public/js/'))
});


