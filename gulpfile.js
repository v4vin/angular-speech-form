"use strict";

// Configuration
var headerTag;
var siteData;
var config = {
    "basePath": "./node_modules/core",
    "destPath": "./build/assets/",
    "headerJS": {
      "outputFile": "head.js",
      "dest": "js",
      "patterns": [
        [
          "libs/angular.js"
        ]
      ]
    },
    "bodyJS": {
      "outputFile": "body.js",
      "dest": "js",
      "patterns": [
        [
          "app.js",
					"app.states.js",
					"project/project.controller.js",
					"components/speechForm/speechForm.directive.js"
        ]
      ]
    }
};
config.basePath = "./";
config.destPath = "./assets/";

// References
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var gulpHeader = require('gulp-header');
var concat = require('gulp-concat');
var extend = require('node.extend');
var flatten = require('gulp-flatten');
var del = require('del');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var path = require("path");
var fs = require("fs");
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge-stream');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var path = require("path");
var rjs = require('requirejs');
var gulpif = require('gulp-if');
var exec = require('child_process').exec;

// When session starts
gulp.task("default", function(cb) {
  gulpSequence('build', 'browser-sync',cb); //, 'browser-watch'
});

// Browser-sync
gulp.task('browser-sync', function(cb) {
  browserSync({
    server: {
      baseDir: '.'
    }
  });
  gulp.watch('./**/*.js', { interval: 500 },
    ['build-body-js' , browserSync.reload]);
  cb();
});

// Default
gulp.task("build",function(cb){
  gulpSequence(['build-body-js', 'build-head-js'],cb);
});

// Generate head JS
gulp.task('build-head-js', function() {
  var data = config.headerJS;
  var patterns = data.patterns;
  var streams = [];
  for (var d=0;d<patterns.length;d++) {
    streams.push(gulp.src(patterns[d], { cwd: path.resolve(config.basePath) }));
  }
  var d = new Date();
  var headerComment = '/* Generated: ' + d + headerTag + ' */';
  return merge(streams)
    .pipe(concat(data.outputFile))
    .pipe(gulpHeader(headerComment))
    .pipe(gulp.dest(config.destPath + data.dest));
});

// Generate footer js
gulp.task('build-body-js', function(done) {
  var data = config.bodyJS;
  var patterns = data.patterns;
  var streams = [];
  for (var d=0;d<patterns.length;d++) {
    streams.push(gulp.src(patterns[d], { cwd: path.resolve(config.basePath) }));
  }
  var d = new Date();
  var headerComment = '/* Generated: ' + d + headerTag + ' */';
  return merge(streams)
    .pipe(concat(data.outputFile))
    .pipe(gulpHeader(headerComment))
    .pipe(gulp.dest(config.destPath + data.dest));
});