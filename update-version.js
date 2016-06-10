var gulp = require('gulp');
var pjson = require('./package.json');
var xeditor = require("gulp-xml-editor");

console.log('Updating connfig.xml version to ', pjson.version);


gulp.src("./config.xml")
  .pipe(xeditor(function(xml) {
    var elem = xml.root();
    elem.attr('version').value(pjson.version);
    console.log('version updated to %s', elem.attr('version').value());
    return xml;
  }))
  .pipe(gulp.dest("./"));


gulp.src("./AndroidManifest.xml")
  .pipe(xeditor(function(xml) {
    var elem = xml.root();
    elem.attr('versionName').value(pjson.version);
    console.log('version updated to %s', elem.attr('version').value());
    return xml;
  }))
  .pipe(gulp.dest("./"));

