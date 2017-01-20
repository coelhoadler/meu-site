/*

    Gulpfile de exemplo para algumas ações clássicas de otimização.
    
    Para aprender mais sobre Gulp, veja o Curso Online de Gulp do Alura:

        https://www.alura.com.br/curso-online-gulp

 */


var gulp = require('gulp');
var $ = require('gulp-load-plugins')({rename: {'gulp-rev-delete-original':'revdel', 'gulp-if': 'if'}});



/* Tasks base */
gulp.task('copy', function() {
    return gulp.src('*/**/*.*', {base: 'app'})
        .pipe(gulp.dest('public'));
});

gulp.task('clean', function() {
    return gulp.src('public/', {read: false})
        .pipe($.clean());
});



/* Minificação */
gulp.task('minify-js', function() {
  return gulp.src('app/**/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('public/'))
});

gulp.task('minify-css', function() {
  return gulp.src('app/**/*.css')
    .pipe($.cssnano({safe: true}))
    .pipe(gulp.dest('public/'))
});

gulp.task('minify-html', function() {
  return gulp.src('app/**/*.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public/'))
});



/* Concatenação */
gulp.task('useref', function () {
    return gulp.src('app/index.html')
        .pipe($.useref())
        .pipe($.if('*.html', $.inlineSource()))
        .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true,removeComments: true})))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cssnano({safe: true})))
        .pipe(gulp.dest('public'));
});



/* Imagens */
gulp.task('imagemin', function() {
    return gulp.src('app/assets/img/*')
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
gulp.task('minify', ['minify-js', 'minify-css', 'minify-html']);
gulp.task('build', $.sequence(['minify-js', 'minify-css', 'imagemin'], 'useref', 'revreplace'));
gulp.task('default', $.sequence('clean', 'copy', 'build'));


