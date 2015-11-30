'use strict';

// Hugo Giraudel's: http://www.sitepoint.com/simple-gulpy-workflow-sass/
// Jordan Bowman's siteleaf=specific effort: https://github.com/jrdnbwmn/my-siteleaf
// See also: https://markgoodyear.com/2014/01/getting-started-with-gulp/
// UnCSS: https://github.com/ben-eb/gulp-uncss (see ignoring selectors)
// cssnano: https://github.com/ben-eb/gulp-cssnano
// sprites: https://www.liquidlight.co.uk/blog/article/creating-svg-sprites-using-gulp-and-sass/
// svg sprites:
//   * https://github.com/jkphl/gulp-svg-sprite
//   * https://www.liquidlight.co.uk/blog/article/working-with-svgs-in-sprites/
//   * https://www.liquidlight.co.uk/blog/article/creating-svg-sprites-using-gulp-and-sass/

// ***or*** use http://www.grumpicon.com/ for svg management

// RELEARN: https://css-tricks.com/gulp-for-beginners/


// -----------------------------------------------------------------------------
// To do
// -----------------------------------------------------------------------------
// * automate $ siteleaf push theme: https://www.npmjs.com/package/gulp-exec
// * load all glugins: https://github.com/jackfranklin/gulp-load-plugins


// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

var gulp = require('gulp'),
    fileinclude = require("gulp-file-include"),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    uncss = require('gulp-uncss'),
    sassdoc = require('sassdoc'),
    minifyCss = require('gulp-minify-css'),
    svgSprite = require('gulp-svg-sprite'),
    livereload = require('gulp-livereload');


// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

var input = {
    sass: './assets/source/**/*.scss',
    svg : './assets/source/img/**/*.svg'
};
var output = {
    html: '',
    sass: './assets/build',
    svg : './assets/build/img'
};
var sassOptions = { outputStyle: 'expanded' };
var autoprefixerOptions = { browsers: ['last 2 versions', '> 5%', 'Firefox ESR'] };


// -----------------------------------------------------------------------------
// Sass compilation
// -----------------------------------------------------------------------------

gulp.task('sass', function () {
    return gulp
        .src(input.sass)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        // .pipe(sourcemaps.write()) // -------------------------------- https://github.com/dlmanning/gulp-sass/issues/394
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(uncss({
            ignore: [
                
            ],
            html: [
                '_layouts/*.html',
                '_partials/*.html',
                'default.html',
                'thanks.html'
            ]
        }))
        .pipe(gulp.dest(output.sass));
});


// -----------------------------------------------------------------------------
// Watchers
// To watch w/ LiveReload: https://markgoodyear.com/2014/01/getting-started-with-gulp/
// -----------------------------------------------------------------------------

gulp.task('watch', function() {
    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(input.sass, ['sass']).on('change', livereload.changed);
    // gulp.watch(input.html, ['html']).on('change', livereload.changed);
    // gulp.watch(input, ['build/**']).on('change', livereload.changed);

    // When there is a change, log a message in the console
    gulp.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

});


// -----------------------------------------------------------------------------
// Production build
// THIS AIN'T WORKING. FIX IT.
// -----------------------------------------------------------------------------

// Clean
gulp.task('clean', function(cb) {
    del(output.sass, cb)
});

// Minify css
gulp.task('minify-css', function() {
    return gulp
        .src(output.sass)
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'));
});

// gulp.task('prod', ['html', 'sass', 'sassdoc'], function () {
//   return gulp
//     .src(output.sass)
//     .pipe(nano())
//     .pipe(gulp.dest('./assets'));
// });

gulp.task('prod', ['clean', 'html', 'sass', 'minify-css']);


// -----------------------------------------------------------------------------
// Tasks
// -----------------------------------------------------------------------------

// gulp.task('default', ['html', 'sass', 'watch' /*, possible other tasks... */]);
gulp.task('default', ['sass', 'watch']);
