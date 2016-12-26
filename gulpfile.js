/**
 * gulp配置文件
 * 注意事项：各项目的task的任务名称不要相同，以免冲突执行，如加上项目前缀 base_jsmin
 * */

/**
 * gulp插件引入
 * */
var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


// 检查脚本
gulp.task('js_lint', function() {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


//压缩js
gulp.task('js_minify', ['js_lint'], function() {
    return gulp.src('src/*.js')
        .pipe(uglify())    //压缩
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(gulp.dest('dest'));  //输出
});

// 默认任务
gulp.task('default', ['js_minify']);