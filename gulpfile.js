// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    react = require('gulp-react'),
    browserify = require('gulp-browserify'),
    htmlreplace = require('gulp-html-replace'),
    babelify = require('babelify');

// create a default task and just log a message
gulp.task('default', function() {
    gulp.src('./client/*.jsx')
        .pipe(browserify({
            extensions: ['.jsx'],
            debug: true,
            transform: ['babelify']
        }))
        .pipe(gulp.dest('dist'))
    /*
     //.pipe(concat('app.min.js'))
     //.pipe(uglify())

     .pipe(concat(path.MINIFIED_OUT))
        .pipe(uglify(path.MINIFIED_OUT))
        .pipe(gulp.dest(path.DEST_BUILD));
        browserify ./client/*.jsx  -t babelify --outfile ./public/js/app.js
    */
});


gulp.task('build', function(){
    gulp.src(path.JS)
        .pipe(react())
        .pipe(concat(path.MINIFIED_OUT))
        .pipe(uglify(path.MINIFIED_OUT))
        .pipe(gulp.dest(path.DEST_BUILD));
});