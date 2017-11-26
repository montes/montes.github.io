---
layout: post
title: "gulp.js, compiles, minifies and much more"
date: 2014-03-03 17:00:00 +0100
---
Lately I see a lot of comments on twitter about [gulp.js](http://gulpjs.com/), as they say gulp is something like if [Grunt](http://gruntjs.com/) had put on a diet.

Both, gulp.js and Grunt, are a kind of task runners, we can setup them to do a lot of tasks, like minify javascript, compile Sass, concat, lint… all of this thanks to the lot of plugins available for both systems.

gulp.js

Although I knew about Grunt a long time ago, I never used it, it has been now with the new gulp.js when I’ve taken time to test it, starting with Sass compiling. Before gulp.js I was using [Compass](http://compass-style.org/) at command line or [Codekit](https://incident57.com/codekit/) for this task.

## Testing gulp.js

For the first test I’ve setup Gulp to compile every Sass file into the folder where I have all our [Prestashop](http://www.prestashop.com/) Themes. I also use “_gulp.watch_“, so Gulp will remain active waiting for any file modification.

Themes’ folders are specified in the “themesFolders” array, where “compass” task will walk to check every Sass file.

This is my working “_gulpfile.js_“:

{%- highlight javascript -%}
var gulp      = require('gulp'),
    compass   = require('gulp-compass');

var themesFolders = [
    'themes/theme1/',
    'themes/theme2/',
    'themes/theme3/',
    'themes/theme4/',
    'themes/theme5/',
    'themes/theme6/'
    ];

gulp.task('compass', function(){
    themesFolders.forEach(function(folder) {
        gulp.src(folder + 'css/scss/*.scss')
            .pipe(compass({
                style: 'compressed',
                sass: folder + 'css/scss',
                css: folder + 'css'
            }))
            .pipe(gulp.dest(folder + 'css'));
    });
});

gulp.task('watch', function () {
    gulp.watch('themes/**/*.scss', ['compass']);
});

gulp.task('default', ['compass', 'watch']);
{%- endhighlight -%}
