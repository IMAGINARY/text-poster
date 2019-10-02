const config = require('./package.json');
const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const paths = {
  scripts: {
    src: './src/*.js',
    dest: './dist',
  },
};

const bundleName = 'text-poster';
const globalName = 'TextPoster';
const externalDependencies = Object.keys(config.dependencies);

function scripts() {
  return browserify({
    extensions: ['.js'],
    entries: './src/main.js',
    standalone: globalName,
  })
    .external(externalDependencies)
    .transform('babelify', { presets: ['@babel/env'] })
    .on('error', (msg) => {
      console.error(msg);
    })
    .bundle()
    .pipe(source(`${bundleName}.js`))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(uglify())
    .pipe(rename(`${bundleName}.min.js`))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
}

const build = gulp.parallel(scripts);

exports.scripts = scripts;
exports.watch = watch;

exports.build = build;
exports.default = build;
