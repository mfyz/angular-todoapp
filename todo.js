todoApp = angular.module('TodoApp', ['LocalStorageModule', 'ngDebounce']);

todoApp.controller('TodoController', ['$scope', '$http', 'localStorageService', '$debounce', function($scope, $http, $localStorage, $debounce){
	$scope.online_status_string = '...checking...';
	$scope.setOnlineStatus = function(online){
		$scope.online = online;
		$scope.online_status_string = online ? 'online' : 'offline';
	}

	$http({
		url: "ping.js",
		method: "GET"
	}).success(function(data, status, headers, config) {
		$scope.setOnlineStatus(true);
	}).error(function(data, status, headers, config) {
		$scope.setOnlineStatus(false);
	});

	storedList = $localStorage.get('todoList');

	if (storedList instanceof Array) {
		$scope.todos = storedList;
	}
	else {
		$scope.todos = [];
	}

	$scope.addTodo = function(){
		$scope.todos.push({
			text: $scope.formTodoText,
			done: false
		});

		$scope.formTodoText = '';
	}

	$scope.clearAll = function(){
		$scope.todos = [];
	}

	$scope.clearCompleted = function(){
		cleanedTodos = $scope.todos.filter(function(item){
			return !item.done;
		});

		$scope.todos = cleanedTodos;
	}

	$scope.saveUpdates = function(newVal, oldVal){
		if (JSON.stringify(newVal) != JSON.stringify(oldVal)) {
			$localStorage.add('todoList', $scope.todos);
		}
	}

	$scope.$watch('todos', $debounce($scope.saveUpdates, 5000), true);
}]);