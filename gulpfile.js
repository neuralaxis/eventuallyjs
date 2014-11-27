var gulp = require('gulp');
var header = require('gulp-header');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

var banner = 
['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
].join('\n');

gulp.task('default', function() {
	return gulp.src('src/angular-eventually.js')
		.pipe(header(banner, {pkg:pkg}))
		.pipe(gulp.dest('build'))
		.pipe(uglify())
		.pipe(header(banner, {pkg:pkg}))
		.pipe(concat('angular-eventually.min.js'))
		.pipe(gulp.dest('build'));
});