#!/bin/bash
CORDOVA_VERSION=6.0.0
IONIC_VERSION=1.7.14
#cordova 6.0.x
echo "Installing cordova $CORDOVA_VERSION"
npm install -g cordova@$CORDOVA_VERSION
cordova -v || { echo 'cordova -v command failed' ; exit 1; }

#ionic 1.7.14
echo "Installing ionic $IONIC_VERSION"
npm install -g ionic@$IONIC_VERSION
ionic -v || { echo 'ionic -v command failed' ; exit 1; }

ionic state reset --plugins
npm cache clear

ionic platform add android@5.0.0
ionic platform add ios@4.0.1
