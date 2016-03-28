/**
 * @author Parham
 * @since 3/03/2016
 */

angular.module('svBeaconPrototype.router', [])
	.factory('Router', function ($log, $rootScope, $state, $stateParams, $ionicViewSwitcher) {
		var Router = {}, originalSoftBack = $rootScope.$ionicGoBack,
			hardBackRoutes = {
				'app.species-list': 'app.home',
				'app.my-reports-edit-species': 'app.my-reports-edit-photo',
				'app.my-reports-edit-photo': 'app.home'
			};

		Router.go = function (state, params) {
			$log.info('Router.go ', state, angular.toJson(params));
			$state.go(state, params);
		};

		Router.init = function ($rootScope) {
			$log.info('Router init()');

			$rootScope.go = Router.go;

			$rootScope.$ionicGoBack = function () {
				if (hardBackRoutes[$state.current.name]) {
					$log.info('Router doing a hard back for ', $state.current.name);
					$ionicViewSwitcher.nextDirection('back');
					$rootScope.go(hardBackRoutes[$state.current.name], $stateParams);
				} else {
					originalSoftBack();
				}
			};

			$rootScope.$on('$ionicView.beforeEnter',
				function(event, view){
					$log.info('$ionicView.beforeEnter', view);
					$rootScope.theme = '';
					if(view && view.stateParams && view.stateParams.category){
						$rootScope.theme = view.stateParams.category.toLowerCase();
					}
				});

		}

		return Router;

	});
