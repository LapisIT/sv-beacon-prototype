'use strict';

angular.module('svBeaconPrototype')
	.factory('MyDetails',
		function ($log, $q, $localStorage, Validations) {
			$log.info('MyDetails...');

			var isDefined = Validations.isDefined,
				isEmpty = Validations.isEmpty,
				storage = $localStorage.$default({
					myDetails: {
						name: '',
						mobile: '',
						email: ''
					}
				});

			function _find() {
				var deferred = $q.defer();

				if (isEmpty(storage.myDetails)) {
					deferred.reject();
				} else {
					deferred.resolve(storage.myDetails);
				}

				return deferred.promise;
			}

			return {
				find: _find
			};

		});
