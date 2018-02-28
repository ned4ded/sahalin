const fs = require('fs');
const gulp = require('gulp');
// JS plugins
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

// CSS plugins
const sass = require('gulp-sass');
// Minify CSS
const cleanCss = require('gulp-clean-css');
// Replace url(..path/) in CSS
const urlAdjust = require('gulp-css-url-adjuster');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

// Common plugins
const concat = require('gulp-concat');
const rename = require('gulp-rename');

// Webserver plugins
const browserSync = require('browser-sync').create();

gulp.task('webserver', ['styles', 'html', 'scripts'], function() {
  browserSync.init({
    open: false,
    ui: false,
    server: './www',
    files: './www/index.html',
    host: '192.168.1.130',
    port: 3001,
    reloadOnRestart: true,
    logConnections: true,
    ghostMode: false,
  });

  gulp.watch('./src/styles/**/*.scss', ['styles']);
  gulp.watch('./src/scripts/**/*.js', ['scripts']);
  gulp.watch('./src/pages/*.html', ['html']);
});

gulp.task('styles', function() {
  return gulp.src(__dirname + '/src/styles/base.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
        browsers: [
          'last 2 versions'
        ]
      })
    ]))
    .pipe(rename('main.css'))
    .pipe(gulp.dest('./www/css'));
});

gulp.task('scripts', function() {
  return gulp.src(__dirname + '/src/scripts/**/*.js')
          .pipe(babel({
            presets: ['env']
          }))
          .pipe(concat('main.js'))
          .pipe(gulp.dest('www/js'))
          .pipe(browserSync.stream());
})

gulp.task('html', function() {
  return gulp.src(__dirname + '/src/pages/*.html')
          .pipe(gulp.dest('www/'))
          .pipe(browserSync.stream());
});

gulp.task('default', ['webserver']);
