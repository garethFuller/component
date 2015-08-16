// generated on 2015-08-12 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';
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

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}

const testLintOptions = {
  env: {
    mocha: true
  }
};

gulp.task('lint', lint('app/scripts/**/*.js'));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('html', () => {
  return gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
  return del(['dist']);
});

gulp.task('dev', (done) => {
  runSequence(
    ['clean'],
    ['styles', 'compilejs'],
    ['html'],
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


gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
