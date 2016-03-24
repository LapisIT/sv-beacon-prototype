angular.module('speciesReporting.species')
	.factory('Audios',
		function ($http, $q, $log, $interval, Audio, Validations) {
			var Audios = {}, isDefined = Validations.isDefined,
				isEmpty = Validations.isEmpty, isFunction = Validations.isFunction;

			var player, playIntervalId;

			Audios.create = function (src) {
				var deferred = $q.defer();

				$log.info('Audios.create src: ', src);

				var playerConfig = {
					src: src,
					success: function () {
						$log.info("play stop Success");
						player.release();
					},
					error: function (error) {
						$log.error("play Error", angular.toJson(error));
					}
				};

				player = Audio.player.create(playerConfig);
				deferred.resolve(player);

				return deferred.promise;
			};

			Audios.play = function (player, duration) {
				var deferred = $q.defer();
				duration = (isDefined(duration) ? duration : 10000);

				$log.info('Audios.play duration, player: ', duration, player);

				if (playIntervalId) {
					$interval.cancel(playIntervalId);
				}

				player.play();
				playIntervalId = $interval(function () {
					Audios.stop(player);
					deferred.resolve(player);
				}, duration);

				return deferred.promise;
			};

			Audios.stop = function (player) {
				var deferred = $q.defer();
				$log.info('Audios.stop player: ', player);

				if (playIntervalId) {
					$interval.cancel(playIntervalId);
				}

				player.stop();
				deferred.resolve(player);

				return deferred.promise;
			};

			return Audios;


		})
