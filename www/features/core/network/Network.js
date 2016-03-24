/**
 * @author Parham
 * @since 4/03/2016
 */


angular.module('speciesReporting.network', [])
	.factory('Network',
		function ($window, $log, $http, $q, $cordovaNetwork, $rootScope) {
			'use strict';

			var Network = {};

			Network.type = function () {
				if ($rootScope.isWeb) {
					return 'WEB';
				}
				return $cordovaNetwork.getNetwork();
			};

			Network.isOnline = function(){
				if ($rootScope.isWeb) {
					return true;
				}
				return $cordovaNetwork.isOnline();
			};

			Network.isOffline = function(){
				if ($rootScope.isWeb) {
					return false;
				}
				return $cordovaNetwork.isOffline();
			}

			return Network;
		});




