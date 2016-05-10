var gulp = require('gulp');
var pjson = require('./package.json');
var xeditor = require("gulp-xml-editor");
var manifest = 'AndroidManifest.xml';
var target = 'platforms/android';
console.log('Copying '+manifest+' version to ', target);

gulp.src('./' + manifest)
  .pipe(gulp.dest('./' + target));
