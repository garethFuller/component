// generated on 2015-08-12 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
// import {stream as wiredep} from 'wiredep';
import browserify from 'browserify';
import babel from 'babelify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import runSequence from 'run-sequence';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dist/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('compilejs', () => {
  return browserify('app/scripts/main.js')
  .transform(babel)
  .bundle()
  .on('error', (err) => {
    console.log('Errror: ' + err.message);
  })
  .pipe(source('main.js'))
  .pipe(gulp.dest('dist/scripts/'));
});

gulp.task('html', () => {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
  return del(['dist']);
});

gulp.task('components', () => {
  return gulp.src('app/components/**')
    .pipe(gulp.dest('dist'));
});

gulp.task('dev', (done) => {
  runSequence(
    ['clean'],
    ['styles', 'compilejs'],
    ['html'],
    ['components'],
    ['serve', 'watch'],
    done
  );
});

gulp.task('serve', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });
});

gulp.task('watch', () => {
  gulp.watch('app/scripts/**/*.js', ['compilejs', 'reload']);
  gulp.watch('app/*.html', ['html', 'reload']);
  gulp.watch('app/styles/**/*.scss', ['styles', 'reload']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('reload', reload);
