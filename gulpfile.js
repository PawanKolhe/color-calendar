const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const env = require('postcss-preset-env');

gulp.task('clean', () => {
  return del([
    'dist/css/',
  ]);
});

gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('postcss', function () {
  var plugins = [
    env(),
    autoprefixer()
  ];
  return gulp.src('dist/css/*.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('default', gulp.series(['clean', 'sass', 'postcss']));

gulp.task('watch', function () {
  return gulp.watch('src/sass/*.scss', { ignoreInitial: false }, gulp.series(['clean', 'sass', 'postcss']));
});
