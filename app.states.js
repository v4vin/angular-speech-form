angular.module('appStates', ['ui.router', 'ui.router.stateHelper'])
.config(function(stateHelperProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/', ['$state', function($state) {
		$state.go('speechForm.home');
	}]);
});