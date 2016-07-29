'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const rigger = require('gulp-rigger');
const rimraf = require('rimraf');
const browserSync = require("browser-sync");
const autoprefixer = require("gulp-autoprefixer");
const reload = browserSync.reload;

var path = {
	build: {
		html: '.',
		css: 'css/',
		js: 'js/'
	},
	src: {
		html: 'src/html/[^_]*.html',
		style: 'src/sass/*.scss',
		js: 'src/js/**/*.js'
	},
	watch: {
		html: 'src/html/**/*.html',
		style: 'src/sass/**/*.scss',
		js: 'src/js/**/*.js'
	}
};

var config = {
	server: {
		baseDir: "."
	},
	tunnel: false,
	host: 'localhost',
	port: 9009,
	reloadDelay: 1000,
	logPrefix: "Zzz"
};

gulp.task('webserver', function () {
	browserSync(config);
	browserSync.watch(path.watch.html).on('change',browserSync.reload);
	browserSync.watch(path.watch.style).on('change',browserSync.reload);
	browserSync.watch(path.watch.js).on('change',browserSync.reload);
});

gulp.task('clean', function (cb) {
	rimraf('./*.html', cb);
	rimraf('./css/', cb);
});

gulp.task('html:build', function () {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
});

gulp.task('style:build', function () {
	return gulp.src(path.src.style)
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(sass({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(autoprefixer())
		.pipe(gulp.dest(path.build.css))
});

gulp.task('js:build', function () {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(gulp.dest(path.build.js))
});

gulp.task('build', gulp.series(
	'html:build',
	'style:build',
	'js:build'
));


gulp.task('watch', function(){
	gulp.watch(path.watch.html, gulp.series('html:build'));
	gulp.watch(path.watch.style, gulp.series('style:build'));
	gulp.watch(path.watch.js, gulp.series('js:build'));
});


gulp.task('run', gulp.parallel('webserver', 'watch'));