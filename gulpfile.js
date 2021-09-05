const Gulp = require('gulp');
const GulpSass = require('gulp-sass')(require('sass'));
const GulpTypescript = require('gulp-typescript');
const GulpConcat = require('gulp-concat');

const paths = {
    cssSrc: 'src/**/*.scss',
    cssDist: 'dist/css',
    tsSrc: 'src/**/*.ts',
    tsDist: 'dist/js',
    publicSrc: 'public/**/*',
    publicDist: 'dist'
}

Gulp.task('sass', ( ) => {
    return Gulp.src(paths.cssSrc)
        .pipe(GulpSass({
            outputStyle: 'compressed'
        }).on('error', GulpSass.logError))
        .pipe(GulpConcat('style.css'))
        .pipe(Gulp.dest(paths.cssDist))
});

Gulp.task('typescript', ( ) => {
    return Gulp.src(paths.tsSrc)
        .pipe(GulpTypescript.createProject('./tsconfig.json')())
        .pipe(Gulp.dest(paths.tsDist));
});

Gulp.task('public', ( ) => {
    return Gulp.src(paths.publicSrc)
        .pipe(Gulp.dest(paths.publicDist));
});

Gulp.task('default', Gulp.series('sass', 'typescript', 'public'));
