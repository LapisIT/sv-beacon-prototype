angular.module('speciesReporting.photo', [])
	.factory('Photo', function ($document, $q, $localStorage) {
		'use strict';

		var Photos = {},
			canvas = document.createElement('canvas');

		function getImageDimension(image) {
			var dim = {};

			if (image.naturalWidth) {
				dim.width = image.naturalWidth;
				dim.height = image.naturalHeight;
			} else {
				dim.width = image.width;
				dim.height = image.height;
			}
			return dim;
		}

		function isBlob(imageData) {
			return (typeof imageData !== "string");
		}

		function createImage(imageData, callback) {
			var image = new Image();

			image.onload = callback;

			//if(typeof imageData === "string") {
			if (!isBlob(imageData)) {
				image.src = imageData;
				return;
			}

			var url = URL.createObjectURL(imageData);
			image.src = url;
		}

		function drawImageToCanvas(image, scaleRatio) {
			scaleRatio = scaleRatio || 1;

			var imageDim = getImageDimension(image),
				width = imageDim.width * scaleRatio,
				height = imageDim.height * scaleRatio;

			canvas.width = width;
			canvas.height = height;

			var context = canvas.getContext('2d');
			context.drawImage(image, 0, 0, width, height);
		}

		function getScaleRatio(image, maxDim) {
			var ratio,
				dim = getImageDimension(image);
			ratio = (dim.width > dim.height) ? maxDim / dim.width : maxDim / dim.height;

			return (ratio > 1) ? 1 : ratio;
		}

		function createThumbnail(image, maxDim) {
			drawImageToCanvas(image, getScaleRatio(image, maxDim));
			return canvas.toDataURL("image/jpeg");
		}

		function getPreferences() {
			return $localStorage.preferences || {
					thumbnailMaxDim: 400,
					photoMaxDim: 1280,
					photoJpegQuality: 0.7
				};
		}

		Photos.getPreferences = getPreferences;
		// Using https://github.com/blueimp/JavaScript-Load-Image
		Photos.loadImage = function (e) {
			e.preventDefault();
			e = e.originalEvent;
			var target = e.dataTransfer || e.target,
				file = target && target.files && target.files[0],
				pref = getPreferences(),
				deferred = $q.defer(), result = {}, options = {
					maxWidth: pref.photoMaxDim,
					canvas: true
				};

			if (!file) {
				return;
			}

			loadImage.parseMetaData(file, function (data) {
				if (data.exif) {
					options.orientation = data.exif.get('Orientation');
				}
				loadImage(
					file,
					function (image) {
						result.image = image.toDataURL();
						deferred.resolve(result);
						//loadImage(
						//  file,
						//  function (image) {
						//    result.thumbnail = image.toDataURL();
						//    deferred.resolve(result);
						//  },
						//  options
						//)
					},
					options
				);
			});
			return deferred.promise;
		};

		Photos.loadImageFromUrl = function (url) {
			var pref = getPreferences(),
				deferred = $q.defer(), result = {}, options = {
					maxWidth: pref.photoMaxDim,
					canvas: true
				};

			loadImage(
				url,
				function (image) {
					result.image = image.toDataURL();
					loadImage(
						url,
						function (image) {
							result.thumbnail = image.toDataURL();
							deferred.resolve(result);
						},
						options
					)
				},
				options
			);

			return deferred.promise;
		};

		Photos.getPreferences = getPreferences;

		Photos.setPreferences = function (preferences) {
			$localStorage.preferences = preferences;
		};

		Photos.createThumbnail = function (imageData) {
			var pref = getPreferences(),
				deferred = $q.defer();

			createImage(imageData, function (e) {
				deferred.resolve(createThumbnail(e.target, pref.thumbnailMaxDim));
			});
			return deferred.promise;
		};

		Photos.scaleDown = function (imageData) {
			var pref = getPreferences(),
				deferred = $q.defer();

			createImage(imageData, function (e) {
				var image = e.target,
					result = {};

				drawImageToCanvas(image, getScaleRatio(image, pref.photoMaxDim));
				result.image = canvas.toDataURL("image/jpeg", pref.photoJpegQuality);

				result.thumbnail = createThumbnail(image, pref.thumbnailMaxDim);

				deferred.resolve(result);
			});

			return deferred.promise;
		};

		var BASE64_MARKER = ';base64,';

		Photos.dataURItoBlob = function (dataURI, mime) {
			if (isBlob(dataURI)) {
				return dataURI;
			}

			var base64Index = dataURI.indexOf(BASE64_MARKER);
			dataURI = dataURI.substring(base64Index + BASE64_MARKER.length);
			var byteString = window.atob(dataURI);

			var ia = new Uint8Array(byteString.length);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			return new Blob([ia], {type: mime});
		}

		return Photos;
	});




