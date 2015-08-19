// generated on 2015-08-12 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import {stream as wiredep} from 'wiredep';
import browserify from 'browserify';
import babel from 'babelify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import runSequence from 'run-sequence';

const dest = 'build';

const $ = gulpLoadPlugins();

gulp.task('styles', () => {
  return gulp.src('styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(dest));
});

gulp.task('compilejs', () => {
  return browserify('scripts/index.js')
  .transform(babel)
  .bundle()
  .on('error', (err) => {
    console.log('Errror: ' + err.message);
  })
  .pipe(source('index.js'))
  .pipe(gulp.dest(dest));
});

gulp.task('clean', () => {
  return del([dest]);
});

gulp.task('build', (done) => {
  runSequence(
    ['clean'],
    ['styles', 'compilejs'],
    done
  );
});