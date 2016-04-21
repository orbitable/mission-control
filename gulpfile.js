var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var shell = require('gulp-shell');

var sourceFiles = [
  'controllers/*.js',
  'definitions/*.js',
  'models/*.js',
  'tests/*.js'
];

gulp.task('clean', ['lint', 'syntax']);

// Starts the develop mode of Totaljs and monitors for JS changes
// restarting when changes are detected.
gulp.task('develop', function() {
  nodemon({script: 'debug.js', ext: 'js'});
});

gulp.task('lint', function() {
  return gulp.src(sourceFiles, {base: './'})
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// Starts TotalJS in release mode
gulp.task('release', shell.task('node release.js'));

gulp.task('syntax', function() {
  return gulp.src(sourceFiles, {base: './'})
    .pipe(jscs({fix: true}))
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'))
    .pipe(gulp.dest('./'));
});

// Starts TotalJS in test mode
gulp.task('test', ['clean'], shell.task('node test.js'));


