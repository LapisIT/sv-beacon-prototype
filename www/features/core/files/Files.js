angular.module('speciesReporting.files', [])
	.factory('Files',
		function ($http, $q, $log, $cordovaFile,
		          Validations) {
			var Files = {}, isDefined = Validations.isDefined, isEmpty = Validations.isEmpty;

			Files.path = function () {
				var isIOS = ionic.Platform.isIOS(),
					isAndroid = ionic.Platform.isAndroid();
				if (isIOS) {
					return cordova.file.tempDirectory;
				}
				if (isAndroid) {
					return cordova.file.externalRootDirectory;
				}
			};

			Files.checkFile = function (file) {
				if (isEmpty(file)) {
					return;
				}
				$log.info('Files.checkFile checking for: ', Files.path() + file);
				return $cordovaFile.checkFile(Files.path(), file);
			};

			Files.readAsDataURL = function (file) {
				if (isEmpty(file)) {
					return;
				}
				$log.info('Files.readAsDataURL: ', Files.path() + file);
				return $cordovaFile.readAsDataURL(Files.path(), file);
			};

			Files.readAsBinaryString = function (file) {
				if (isEmpty(file)) {
					return;
				}
				$log.info('Files.readAsBinaryString: ', Files.path() + file);
				return $cordovaFile.readAsBinaryString(Files.path(), file);
			};

			Files.removeFile = function (file) {
				if (isEmpty(file)) {
					return;
				}
				$log.info('Files.removeFile: ', Files.path() + file);
				return $cordovaFile.removeFile(Files.path(), file);
			};

			return Files;

		});
