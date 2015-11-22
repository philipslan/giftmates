// js/controllers/mainCtrl.js
// Global Controller- contains functions needed for multiple views

var app = angular.module('mainController', []);

app.controller('mainController', function($scope, $http){
	console.log("loaded controller");
	$scope.registerData = {};
	$scope.loginData = {};

	if (localStorage.attempt) {
		$scope.attempt = JSON.parse(localStorage.attempt);
	}

	$scope.test = function(){
		console.log($scope.user);
	};

	$scope.login = function(){
		console.log('hello world');
		$http.post('/login', $scope.loginData)
			.success(function(data){
				localStorage.attempt = true;
				window.location.reload(true);
			})
			.error(function(data, status, headers, config){
				//console.log(status);
			});
	};

	$scope.logout = function(){
		$http.get('/logout')
			.success(function(data){
				window.location.href = "/";
			})
			.error(function(data, status, headers, config){
			});
	};

	$scope.register = function(){
		if ($scope.registerData.password != $scope.registerData.password2){
			alert("The passwords do not match!");
			return;
		}

		$http.post('/signup', $scope.registerData)
			.success(function(data){
				window.location.href = "/";
				//console.log(data);
			})
			.error(function(data, status, headers, config){
				//console.log(status);
			});
	};

});