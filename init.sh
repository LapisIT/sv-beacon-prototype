#!/bin/bash

#Generate icons
ionic resources

#add android platforms
#ionic platform rm android
ionic platform add android@5.0.0
ionic state reset --plugins
#cordova plugin add https://github.com/SpatialVision/sv-plugin-indooratlas.git

cp AndroidManifest.xml platforms/android/
