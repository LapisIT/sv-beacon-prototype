'use strict';

angular.module('svBeaconPrototype')
	.factory('MyDetails',
		function ($log, $q, $localStorage, Validations, Users) {
			$log.info('MyDetails...');

			var isDefined = Validations.isDefined,
				isEmpty = Validations.isEmpty,
				storage = $localStorage.$default({
					myDetails: {
						name: 'HG',
						phone: '0123456789',
						email: 'h@sv.com'
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
				find: _find,
        save:Users.save
			};

		});
