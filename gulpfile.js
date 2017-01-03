// credit: https://css-tricks.com/gulp-for-beginners/
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var imageResize = require('gulp-image-resize');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var del = require('del');
var runSequence = require('run-sequence');

var critical = require('critical');

//build
gulp.task('default', function(){
  runSequence(['clean:dist', 'htmlmin', 'cssmin', 'js', 'img', 'resize']);
});

gulp.task('criticalcss', function (cb) {
  critical.generate({
    inline: true,
    base: 'dist/',
    src: 'index.html',
    dest: 'index.html',
    minify: true,
    width: 1300,
    height: 900
  });
});

//Minify HTML
gulp.task('htmlmin', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

//minify images
gulp.task('img', function(){
  gulp.src('src/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
    optimizationLevel: 7,
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest('dist/'));
});

//resize images
//Need to install GraphicsMagick or ImageMagick
gulp.task('resize', function () {
  gulp.src('src/**/*.+(png|jpg|gif|svg)')
    .pipe(imageResize({
      width : 400,
      // height : 100,
      // crop : true,
      upscale : false
    }))
    .pipe(imagemin())
    .pipe(gulp.dest('dist/'));
});

//minify css
gulp.task('cssmin', function() {
    return gulp.src('src/**/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/'));
});

//uglify js
gulp.task('js', function(){
   gulp.src('src/**/*.js')
  //  .pipe(concat('script.js'))
   .pipe(uglify())
   .pipe(gulp.dest('dist/'));
});

// Cleaning up generated files automatically
gulp.task('clean:dist', function() {
  return del.sync('dist');
});
