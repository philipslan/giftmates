// public/js/ngRoutes.js
angular.module('ngRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		// Home
		.when('/', {
			templateUrl: 'views/home.html',
		});

		// .when('/register', {
		// 	templateUrl: 'views/register.html',
		// })

		// // Create
		// .when('/create', {
		// 	templateUrl: 'views/create.html',
		// 	controller: 'createController',
		// })

		// .when('/history', {
		// 	templateUrl: 'views/history.html',
		// 	controller: 'historyController',
		// })

		// // Calendar
		// .when('/calendar', {
		// 	templateUrl: 'views/calendar.html',
		// 	controller: 'calendarController',
		// })

		// .when('/edit', {
		// 	templateUrl: 'views/edit.html',
		// 	controller: 'editController',
		// })

		// .when('/account', {
		// 	templateUrl: 'views/account.html',
		// 	controller: 'accountController'
		// });

	$locationProvider.html5Mode(true);
}])
