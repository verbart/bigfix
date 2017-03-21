const gulp = require('gulp');
const buffer = require('vinyl-buffer');
const postcss = require('gulp-postcss');
const stylus = require('gulp-stylus');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const del = require('del');
const gutil = require('gulp-util');
const tinypng = require('gulp-tinypng-nokey');
const spritesmith = require('gulp.spritesmith');
const webpack = require('webpack');
const panini = require('panini');
const htmlmin = require('gulp-htmlmin');

const isDevelopment = process.env.NODE_ENV !== 'production';


gulp.task('views', function () {
  panini.refresh();

  return gulp.src('./src/views/pages/**/*.html')
    .pipe(panini({
      root: './src/views/pages',
      layouts: './src/views/layouts',
      partials: './src/views/partials',
      helpers: './src/helpers',
      data: './src/data'
    }))
    .pipe(gulpIf(isDevelopment, htmlmin({collapseWhitespace: false})))
    .pipe(gulp.dest('./public'));
});

gulp.task('styles', function () {
  return gulp.src('./src/styles/app.styl')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(stylus({
      'include css': true
    })
    .on('error', function(error) {
      gutil.log(gutil.colors.red('Error: ' + error.message));
      this.emit('end');
    }))
    .pipe(gulpIf(!isDevelopment, postcss([
      autoprefixer({
        browsers: ['> 5%', 'ff > 14']
      })
    ])))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulpIf(!isDevelopment, cleanCSS()))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./public/css'))
});

gulp.task('scripts', function(done) {
  return webpack(require('./webpack.config.js'), function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);

    gutil.log('[scripts]', stats.toString({
      colors: gutil.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }));

    done();
  });
});

gulp.task('sprite', function() {
  const spriteData = gulp.src('./src/images/sprite/*.*')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'images.styl',
      algorithm: 'binary-tree',
      padding: 2,
      cssTemplate: './src/styles/sprites/sprite-template.mustache'
    }));

  spriteData.img
    .pipe(buffer())
    .pipe(gulpIf(!isDevelopment, tinypng()))
    .pipe(gulp.dest('./public/images'));

  spriteData.css.pipe(gulp.dest('./src/styles/sprites'));

  return spriteData;
});

gulp.task('images', function () {
  return gulp.src(['./src/images/**/*.*', '!./src/images/sprite/*.*'])
    .pipe(gulpIf(!isDevelopment, tinypng()))
    .pipe(gulp.dest('./public/images'));
});

gulp.task('copy', function () {
  return gulp.src('./src/root-files/**/{*.*,.*}')
    .pipe(gulp.dest('./public'));
});

gulp.task('watch', function () {
  gulp.watch(['./src/views/**/*.html', './src/data/**/*.*'], gulp.series('views'));
  gulp.watch('./src/styles/**/*.{css,styl}', gulp.series('styles'));
  gulp.watch('./src/scripts/**/*.js', gulp.series('scripts'));
  gulp.watch('./src/root-files/**/*.*', gulp.series('copy'));
});

gulp.task('serve', function () {
  browserSync.init({
    proxy: 'localhost/bigfix/code/public',
    // files: 'public/**/*.*',
    https: true,
    // server: './public',
    port: 8080
  });

  browserSync.watch('./public/**/*.*').on('change', browserSync.reload);
});

gulp.task('clean', function () {
  return del('./public')
});

gulp.task('build', gulp.series(
  'clean',
  'sprite',
  gulp.parallel(
    'views',
    'styles',
    'scripts',
    'images',
    'copy'
  )));

gulp.task('default', gulp.series(
  'build',
  gulp.parallel(
    'watch',
    'serve'
  )));
