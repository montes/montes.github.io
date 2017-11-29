---
layout: post
title: "Prestashop 1.6 Theme Sass Compiling"
date: 2015-02-24 17:00:00 +0100
thumbnail: "2015-02-24-prestashop-theme-sass-compiling.jpg"
categories:
    - prestashop
    - frontend
---
From version 1.6 the Prestashop default theme is developed using Sass, this means that the CSS of the theme is not written directly, is obtained after compiling the Sass files.

Sass files in Prestashop are written using “scss” syntax that is very similar to regular CSS but with a lot more features, this is an example from Prestashop 1.6:

{% highlight scss %}
@charset "UTF-8";

@import "compass";
@import "compass/reset";
@import "theme_variables";
@import "bootstrap";
@import "font-awesome/font-awesome";
@import "icons";
@import "warehousefont";

body {
    min-width: 320px;
    height: 100%;
    line-height: 18px;
    font-size: 13px;
    color: $base-body-color;
    &.content_only {
        background: none;
    }
}
{% endhighlight %}

You can see it uses many things that regular CSS doesn’t have like variables or indenting levels.

This means you cannot upload the files directly, you must compile .scss to .css before uploading to server, there are several programs that do this for Windows, Mac and Linux ([Koala](http://koala-app.com/), [Prepros](https://prepros.io/), [Scout](http://mhs.github.io/scout-app/), [Hammer](http://hammerformac.com/), [Compass.app](http://compass.kkbox.com/)…) but I prefer to automate the process using [Gulp](http://gulpjs.com/) (more on gulp: Gulp compiles, minifies and much more).

With gulp you can automate compilation to run each time you save a .scss file, I also use gulp to upload .css to server just after compiled and auto reload my browser.

I normally use a gulp module for Sass compilation, but in this case I call “compass watch” to avoid recompile and upload all .scss source files each time.

Installing gulp
---------------

To install gulp you first need to instal “Node Package Manager”: [nodejs](http://nodejs.org/)

After installing Node Package Manager, now install gulp itself following gulp getting started doc: [https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

And it’s done! you now have gulp on your system, now go to any of your prestashop projects folder (command line) and run “gulp”:

![Gulp]({{ "/assets/images/prestashop-theme-sass-compiling-1.png" | absolute_url }})

oh! before we need to install gulp locally in this project, run “_npm install gulp_” and re-run “_gulp_“:

![Gulp]({{ "/assets/images/prestashop-theme-sass-compiling-2.png" | absolute_url }})

This is better, now we need to create this file: “gulpfile.js”, where we must write gulp configuration using javascript. You have lots of recipes in gulpjs github: [https://github.com/gulpjs/gulp/tree/master/docs/recipes](https://github.com/gulpjs/gulp/tree/master/docs/recipes).

Gulp dependencies for our Prestashop setup
------------------------------------------

To use our Prestashop specific gulpjs.file we need install several gulp plugins before, run “_npm install node-notifier gulp-sftp gulp-livereload gulp-exec gulp-cached run-sequence_” that will install all dependencies:

![npm install gulp]({{ "/assets/images/prestashop-theme-sass-compiling-3.png" | absolute_url }})

Our specific “gulpfile.js” for Prestashop
-----------------------------------------

The sequence we want is:

1. “compass watch” compiles .scss to .css each time we save any .scss file compiling only necessary files
2. gulp-sftp watch for .css changes and uploads new or updated .css to server
3. livereload reloads my browser to see changes

All of these with the appropiate gulpfile.js will be done by gulp without our intervention.

This is the gulpfile we currently use at Incubalia:

{% highlight javascript %}
// Required modules
var gulp            = require('gulp'),
    sftp            = require('gulp-sftp'),
    notifier        = require('node-notifier'),
    livereload      = require('gulp-livereload'),
    exec            = require('gulp-exec'),
    cache           = require('gulp-cached'),
    runSequence     = require('run-sequence'),

    // Relative path to the prestashop theme
    themeFolder     = 'themes/my-theme/',

    // Sftp config to upload files to server
    sftpRemotePath  = '/home/myweb.com/themes/my-theme/css',
    sftpPort        = 22,
    sftpHost        = 'myweb.com',
    sftpUsername    = 'username',
    sftpPassword    = 'password';


// Upload files to server. We use gulp-cached to upload only changed files.
gulp.task('upload-css', function() {
    return gulp.src(themeFolder + 'css/**/*.css')
        .pipe(cache('css-files'))
        .pipe(sftp({
            host: sftpHost,
            port: sftpPort,
            user: sftpUsername,
            pass: sftpPassword,
            remotePath: sftpRemotePath
        }));
});

// Upload source maps to server, source maps are used to see css rules corresponding scss files with line numbers
gulp.task('upload-source-maps', function() {
    return gulp.src(themeFolder + 'css/**/*.css.map')
        .pipe(cache('source-map-files'))
        .pipe(sftp({
            host: sftpHost,
            port: sftpPort,
            user: sftpUsername,
            pass: sftpPassword,
            remotePath: sftpRemotePath
        }));
});

// Reload browser when everything is uploaded to server
gulp.task('livereload', function() {
    livereload.reload();
});

// Notify us when everything is done
gulp.task('notify', function() {
    notifier.notify({title: 'gulp', message: 'Sass compiled & uploaded & page reloaded.'});
});

// Start! watch for .scss changes
gulp.task('watch', function() {

    livereload.listen();

    gulp.src('./**/**')
        .pipe(exec('compass watch --sourcemap'))
        .pipe(exec.reporter());

    gulp.watch(themeFolder + 'css/**/*.css', function() {
        runSequence('upload-css', 'upload-source-maps', 'livereload', 'notify');
    });
});

// Set watch as default gulp task
gulp.task('default', ['watch']);
{% endhighlight %}

And you, what do you use to compile your prestashop Sass?
