'use strict';

angular.module('speciesReporting.location', [])
	.factory('Location',
		function ($log, $q, $window, Validations, MapDefaults) {
			$log.info('Locations...');
			var Locations = {},
				geolocation = $window.navigator.geolocation,
				OPTIONS_GEO_LOCATION_DEFAULT = {timeout: 5000, enableHighAccuracy: true},
				OPTIONS_GEO_LOCATION_CHECK = {timeout: 3000, enableHighAccuracy: false},
				isNotEmpty = Validations.isNotEmpty,
				isEmpty = Validations.isEmpty,
				zoomDefault = MapDefaults.zoomDefault,
				centerAu = MapDefaults.au.center,
				markerDefault = {
					focus: true,
					draggable: true,
					lat: centerAu.lat,
					lng: centerAu.lng
				},
				locationDefault = {
					lat: undefined, lng: undefined,
					zoom: undefined, accuracy: undefined, description: '', located: false, address: ''
				};

			function isGeoLocationEnabled() {
				return Locations.findCurrentPosition(OPTIONS_GEO_LOCATION_CHECK);
				//return !$window.navigator.geolocation;
			}

			Locations.isGeoLocationEnabled = isGeoLocationEnabled;

			var hasLatLng = function (location) {
				return isNotEmpty(location) &&
					isNotEmpty(location.lat) &&
					isNotEmpty(location.lng);
			}

			Locations.hasLatLng = hasLatLng;

			function log(caller, location) {
				if (isEmpty) {
					$log.info(caller + ' the location is empty!');
					return;
				}
				$log.info(caller + ': lat=' + location.lat + ' lng=' + location.lng + ' zoom=' + location.zoom);
			}

			Locations.log = log;

			Locations.createMarker = function (location) {
				log('Locations.createMarker', location);
				var m = angular.copy(markerDefault);

				if (hasLatLng(location)) {
					m.lat = location.lat;
					m.lng = location.lng;
					m.focus = true;
					//m.message = "Hey, drag me if you want";
					m.draggable = true
				}

				return m;
			};

			Locations.createCenter = function (location) {
				log('Locations.createCenter located? ', location);
				var center = (location && location.lat ?
					(location.located ?
						angular.copy({lat: location.lat, lng: location.lng, zoom: 5}) :
						angular.copy({lat: location.lat, lng: location.lng, zoom: centerAu.zoom}))
					: angular.copy(centerAu));

				log('Locations.createMarker', center)
				return center;
			};

			Locations.defaultZoom = function () {
				return locationDefault.zoom;
			}

			Locations.defaultLocation = function () {
				return angular.copy(locationDefault);
			}

			Locations.createCentreAndMarkerFromPosition = function (position) {
				var coords = position.coords,
					marker = angular.copy(markerDefault),
					center = angular.copy(centerAu);

				marker.lat = coords.latitude;
				marker.lng = coords.longitude;

				center.lat = coords.latitude;
				center.lng = coords.longitude;
				center.accuracy = coords.accuracy;
				return {center: center, marker: marker};
			}

			var MSGs = MapDefaults.RESULTS_GPS;
			Locations.errorMessages = function () {
				return MSGs;
			}

			Locations.findCurrentPosition = function (options) {
				$log.info('Locations.findCurrentPosition...');
				return $q(function (resolve, reject) {
					if (!navigator.geolocation) {
						return reject('Geo location srevice is not available.');
					}
					if (!options) {
						options = OPTIONS_GEO_LOCATION_DEFAULT;
					}

					navigator.geolocation.getCurrentPosition(function (position) {
						$log.info('position returned... ' + position);
						return resolve({lat: position.coords.latitude, lng: position.coords.longitude});
					}, function (error) {
						$log.info('error returned... ' + error);
						switch (error.code) {
							case error.PERMISSION_DENIED:
								return reject(MSGs.PERMISSION_DENIED);
							case error.POSITION_UNAVAILABLE:
								return reject(MSGs.POSITION_UNAVAILABLE);
							case error.TIMEOUT:
								return reject(MSGs.TIMEOUT);
							case error.UNKNOWN_ERROR:
								return reject(MSGs.UNKNOWN_ERROR);
							default:
								return reject(MSGs.UNKNOWN_ERROR);
						}
					}, options);

				});

			};

			Locations.defaultLocation = function () {
				return angular.copy(locationDefault);
			}

			function _roundTo(originalNumber, fractionDigits) {
				var m = Math.pow(10, fractionDigits);
				return Math.round(originalNumber * m) / m;
			}

			function _convertLatLng(location, from, to) {
				function fromD(val) {
					console.log('fromD val:' + val);

					var loc = {dm: {d: 0, m: 0}, dms: {d: 0, m: 0, s: 0}};

					var fullDD = Math.abs(val);
					var fullDM = Number(((fullDD - Math.floor(fullDD)) * 60).toPrecision(13));
					var fullDMS = Number(((fullDM - Math.floor(fullDM)) * 60).toPrecision(13));

					var ddDegree = _roundTo(fullDD, 7); // Decimals 7
					loc.dm.d = Math.floor(fullDD);
					loc.dm.m = _roundTo(fullDM, 6); // Decimals 6

					loc.dms.d = Math.floor(fullDD);
					loc.dms.m = Math.floor(fullDM);
					loc.dms.s = _roundTo(fullDMS, 4); // Decimals 4
					return loc;
				}

				function toD(val, opt) {
					var decimalDegreeValue = 0;
					console.log('toD d:' + val.d + ' m:' + val.m + ' s: ' + val.s + ' opt: ' + opt);
					if (opt === 'DMS') {
						var seconds = 0;
						seconds = Number(val.s);
						seconds = Number((seconds / 3600).toPrecision(13));
						decimalDegreeValue += seconds;
					}
					var minutes = 0;
					minutes = Number(val.m);
					minutes = Number((minutes / 60).toPrecision(13));
					decimalDegreeValue += minutes;

					var degrees = 0;
					degrees = Number(val.d);
					degrees = degrees;
					decimalDegreeValue += degrees;

					console.log('pre rounding + ' + decimalDegreeValue);
					return _roundTo(decimalDegreeValue, 7);
				}

				switch (from) {
					case 'D':
						console.log('change from D');
						switch (to) {
							case 'DM':
								console.log('change to DM');
								location.dm.lat = fromD(location.d.lat).dm;
								location.dm.lon = fromD(location.d.lon).dm;
								break;
							default://DMS
								console.log('change to DMS');
								location.dms.lat = fromD(location.d.lat).dms;
								location.dms.lon = fromD(location.d.lon).dms;
						}
						break;
					case 'DM':
						console.log('change from DM');
						switch (to) {
							case 'D':
								console.log('change to D');
								location.d.lat = toD(location.dm.lat, 'DM');
								location.d.lon = toD(location.dm.lon, 'DM');
								break;
							default://DMS
								console.log('change to DMS');
								location.dms.lat = fromD(toD(location.dm.lat, 'DM')).dms;
								location.dms.lon = fromD(toD(location.dm.lon, 'DM')).dms;
						}
						break;
					default://DMS
						console.log('change from DMS');
						switch (to) {
							case 'D':
								console.log('change to D');
								location.d.lat = -toD(location.dms.lat, 'DMS');
								location.d.lon = toD(location.dms.lon, 'DMS');
								break;
							default://DM
								console.log('change to DM');
								location.dm.lat = fromD(toD(location.dms.lat, 'DMS')).dm;
								location.dm.lon = fromD(toD(location.dms.lon, 'DMS')).dm;
						}
				}
				return location;
			}

			Locations.toDegree = function (lat, lng) {
				return _convertLatLng({d: {lat: lat, lon: lng}, dms: {}}, 'D', 'DMS')
			};

			Locations.toDecimal = function (lat, lng) {
				return _convertLatLng({dms: {lat: lat, lon: lng}, d: {}}, 'DMS', 'D')
			};

			return Locations;
		});
