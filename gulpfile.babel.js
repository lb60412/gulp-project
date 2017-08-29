'use strict';

import del from 'del';
import gulp from 'gulp';
import gulpif from 'gulp-if';
import concat from 'gulp-concat';
import gulpSequence from 'gulp-sequence';

import htmlmin from 'gulp-htmlmin';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import minifyCss from 'gulp-minify-css';
import plumber from 'gulp-plumber';

import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import webpack from 'gulp-webpack';
import * as webpackConfig from './webpack.config.js';

import base64 from 'gulp-base64';
// import sprity from 'sprity';
import rev from 'gulp-rev';
import revCollector from 'gulp-rev-collector';
import browserSync from 'browser-sync';

const reload = browserSync.reload;

const options = {
    isMd5: false,
    path: 'http://localhost:9527/'
}

gulp.task('del', (cb) => {
    return del(['dist', 'src/cache'], cb);
});

gulp.task('del-html', (cb) => {
    return del(['src/cache/*.html', 'dist/*.html'], cb);
});

gulp.task('del-css', (cb) => {
    return del(['src/cache/css', 'dist/css'], cb);
});

gulp.task('del-js', (cb) => {
    return del(['src/cache/js', 'dist/js/*'], cb);
});

gulp.task('del-image', (cb) => {
    return del(['dist/images'], cb);
});

gulp.task('html', () => {
    return gulp.src(['src/*.html'])
        .pipe(htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值
            removeEmptyAttributes: true, //删除所有空格作属性值
            removeScriptTypeAttributes: true, //删除<script>的type='text/javascript'
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type='text/css'
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulpif(options.isMd5, gulp.dest('src/cache/html'), gulp.dest('dist')))
        .pipe(gulpif(!options.isMd5, reload({
            stream: true
        })))
});

gulp.task('css', () => {
    return gulp.src(['src/sass/index.scss', 'src/sass/share.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 9 versions', 'Firefox ESR', 'ios 5', 'android 2.3'],
            cascade: false
        }))
        .pipe(minifyCss())
        // .pipe(base64({
        //     maxImageSize: 8 * 1024
        // }))
        .pipe(gulpif(options.isMd5, gulp.dest('src/cache/css'), gulp.dest('dist/css')))
        .pipe(gulpif(!options.isMd5, reload({
            stream: true
        })))
});

gulp.task('js', () => {
    let config = options.isMd5 ? webpackConfig.publish : webpackConfig.develop;
    return gulp.src(['src/js/*.js'])
        .pipe(plumber())
        // .pipe(babel({
        //     plugins: 'transform-es2015-modules-umd'
        // }))
        .pipe(webpack(config))
        .pipe(gulpif(options.isMd5, gulp.dest('src/cache/js'), gulp.dest('dist/js')))
        .pipe(gulpif(!options.isMd5, reload({
            stream: true
        })))
});

gulp.task('js:lib', () => {
    return gulp.src(['src/js/lib/**/*.js'])
        .pipe(gulpif(options.isMd5, gulp.dest('src/cache/js/lib'), gulp.dest('dist/js/lib')))
        .pipe(gulpif(!options.isMd5, reload({
            stream: true
        })))
});

gulp.task('image', () => {
    return gulp.src(['src/images/**/*'])
        .pipe(gulpif(options.isMd5, rev()))
        .pipe(gulp.dest('dist/images'))
        .pipe(gulpif(options.isMd5, rev.manifest()))
        .pipe(gulpif(options.isMd5, gulp.dest('src/cache/rev/images')))
        .pipe(gulpif(!options.isMd5, reload({
            stream: true
        })))
});

// gulp.task('sprite', () => {
//     return sprity.src({
//             src: 'src/sprite/**/*.{jpg,png}',
//             style: 'icon.scss',
//             name: 'icon',
//             margin: 10,
//             split: true,
//             orientation: 'binary-tree', //vertical|horizontal|binary-tree
//             processor: 'sass'
//         })
//         .pipe(gulpif('*.png', gulp.dest('src/images/'), gulp.dest('src/sass/')))
// });

gulp.task('md5CSS', () => {
    return gulp.src(['src/cache/rev/**/*.json', 'src/cache/css/*.css'])
        .pipe(revCollector({
            replaceReved: false, //是否重复替换
            dirReplacements: {
                '../images/': options.path + 'images'
            }
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/cache/rev/css'))
});

gulp.task('md5JS', () => {
    return gulp.src(['src/cache/rev/**/*.json', 'src/cache/js/**/*.js'])
        .pipe(revCollector({
            replaceReved: false, //是否重复替换
            dirReplacements: {
                '../images/': options.path + 'images'
            }
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('src/cache/rev/js'))
});

gulp.task('md5HTML', () => {
    return gulp.src(['src/cache/rev/**/*.json', 'src/cache/html/*.html'])
        .pipe(revCollector({
            replaceReved: false, //是否重复替换
            dirReplacements: {
                'images': options.path + 'images',
                'js': options.path + 'js',
                'css': options.path + 'css'
            }
        }))
        .pipe(gulp.dest('dist'))
        .pipe(reload({
            stream: true
        }))
});

gulp.task('buildHtml', (cb) => {
    gulpSequence('del-html', 'html', 'md5HTML', cb);
});

gulp.task('buildCss', (cb) => {
    gulpSequence('del-css', 'css', 'md5CSS', 'md5HTML', cb);
});

gulp.task('buildJs', (cb) => {
    gulpSequence('del-js', 'js', 'js:lib', 'md5JS', 'md5HTML', cb);
});

gulp.task('buildImages', (cb) => {
    gulpSequence(['del-html', 'del-css', 'del-image'], ['image', 'css', 'html'], 'md5CSS', 'md5JS', 'md5HTML', cb);
});

gulp.task('watch', () => {
    //http server
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        browser: 'google chrome',
        open: 'external',
        port: 9527
    });

    if (!options.isMd5) {
        gulp.watch('src/images/**/*', ['image']);
        gulp.watch('src/sass/**/*', ['css']);
        gulp.watch('src/js/**/*.js', ['js']);
        gulp.watch('src/*.html', ['html']);
    } else {
        gulp.watch('src/*.html', ['buildHtml']);
        gulp.watch('src/sass/**/*', ['buildCss']);
        gulp.watch('src/js/**/*.js', ['buildJs']);
        gulp.watch('src/images/**/*', ['buildImages']);
    }

    gulp.watch('src/js/lib/**/*.js', ['js:lib']);
    // gulp.watch('src/sprite/**/*', ['sprite']);
});

gulp.task('default', (cb) => {
    options.isMd5 = false;
    gulpSequence('del', 'image', 'css', 'js', 'js:lib', 'html', 'watch', cb);
});

gulp.task('publish', (cb) => {
    options.isMd5 = true;
    gulpSequence('del', ['image', 'css', 'js', 'js:lib', 'html'], 'md5CSS', 'md5JS', 'md5HTML', 'watch', cb);
});