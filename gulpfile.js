var gulp = require('gulp')
,   $ = require('gulp-load-plugins')({rename: {'gulp-rev-delete-original':'revdel', 'gulp-if': 'if'}})
,   sass = require('gulp-sass')
,   cssmin = require('gulp-cssmin')
,   rename = require('gulp-rename')
,   browserSync = require("browser-sync")

/* Tasks base */
gulp.task('copy', function() {
    return gulp.src('*/**/*.*', {base: 'app'})
        .pipe(gulp.dest('public'));
});

gulp.task('clean', function() {
    return gulp.src('public/', {read: false})
        .pipe($.clean());
});


// Using gulp plugin for sass
gulp.task('sass', function () {
    return gulp.src('app/assets/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/assets/css'));
});

// Using browser-sync for refresh my page at dev developing 
gulp.task('server.dev', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('server.prod', function () {
    browserSync.init({
        server: {
            baseDir: 'public'
        }
    });
});

/* Minificação */
gulp.task('minify-js', function() {
  return gulp.src('public/**/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('public/'))
});

gulp.task('minify-css', function() {
  return gulp.src('public/**/*.css')
    .pipe($.cssnano({safe: true}))
    .pipe(gulp.dest('public/'))
});

gulp.task('minify-html', function() {
  return gulp.src('public/**/*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public/'))
});

/* Concatenação */
gulp.task('useref', function () {
    return gulp.src('public/index.html')
        .pipe($.useref())
        .pipe($.if('*.html', $.inlineSource()))
        .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true,removeComments: true})))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano({safe: true})))
        .pipe(gulp.dest('public'));
});

/* Imagens */
gulp.task('imagemin', function() {
    return gulp.src('public/assets/img/*')
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ]
        }))
        .pipe(gulp.dest('public/assets/img'));
});

/* Revisão de arquivos */
gulp.task('rev', function(){
  return gulp.src(['public/**/*.{css,js,jpg,jpeg,png,svg}'])
    .pipe($.rev())
    .pipe($.revdel())
    .pipe(gulp.dest('public/'))
    .pipe($.rev.manifest())
    .pipe(gulp.dest('public/'))
})

gulp.task('revreplace', ['rev'], function(){
  return gulp.src(['public/index.html', 'public/app.yaml', 'public/**/*.css'])
    .pipe($.revReplace({
        manifest: gulp.src('public/rev-manifest.json'),
        replaceInExtensions: ['.html', '.yaml', '.js', '.css']
    }))
    .pipe(gulp.dest('public/'));
});

/* Alias */
//gulp.task('minify', $.sequence(['minify-js', 'minify-css', 'minify-html'], 'useref', 'revreplace'));
gulp.task('build', $.sequence('useref', 'revreplace'));
gulp.task('default', $.sequence('clean', 'copy', 'build'));

// Events watch
gulp.watch("app/**/*").on('change', function () {
    browserSync.reload();
});

gulp.watch("app/assets/scss/**/*.scss", ["sass"]);