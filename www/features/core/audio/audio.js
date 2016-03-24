/**
 * @author Parham
 * @since 2/02/2016
 */

'use strict';

angular.module('speciesReporting.audio', []).factory('SpeciesReportingAudio', function ($q, $log, $window, $cordovaMedia, $interval, $cordovaNativeAudio, $timeout, Validations, Network) {
	var isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;
	$log.info('Audio init ... ');

	function fileExtension() {
		return '.m4a';
		//var isIOS = ionic.Platform.isIOS(),
		//	isAndroid = ionic.Platform.isAndroid();
		//if (isIOS) {
		//	return '.wav';
		//}
		//if (isAndroid) {
		//	return '.amr'
		//}
		//return '.m4a';
	}

	function _createMedia(config) {
		if (!isDefined(config.src)) {
			throw new Error('config.src must be specified...');
		}
		var hasExtension = config.src.indexOf('.') > -1,
			src = config.src + (hasExtension ? '' : fileExtension());
		//src = 'documents://' + config.src + (hasExtension?'':fileExtension());
		$log.info('_createMedia src:', src);
		return new Media(
			src,
			// success callback
			config.success,
			// error callback
			config.error);
	}

	function _loadRemote(src) {
		$log.info('Audio.loadRemote src: ', src);
		var deferred = $q.defer();
		var sound = new Audio();
		sound.src = src;

		if (Network.isOnline()) {
			sound.load();
			sound.addEventListener("canplaythrough", function () {
				deferred.resolve(sound);
			}, false);
			sound.addEventListener("error", function () {
				deferred.reject(sound);
			}, false);
			$timeout(function(){
				deferred.reject(sound);
			}, 30000);
		} else {
			deferred.reject(sound);
		}

		return deferred.promise;
	}

	function _playRemote(sound) {
		var deferred = $q.defer();

		$log.info('Audio.playRemote duration, src: ', sound);

		sound.addEventListener("ended", function () {
			deferred.resolve(sound);
		}, false);

		sound.volume = 1;
		sound.play();

		return deferred.promise;
	}

	return {
		extension: fileExtension,
		recorder: {
			create: _createMedia
		},
		player: {
			create: _createMedia
		},
		loadRemote: _loadRemote,
		playRemote: _playRemote
	};
});

