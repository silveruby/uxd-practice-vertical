(function(){

	var uxdTable = angular.module('uxd.table', [])

	// .directive('businessContextAnalysis', function(){
	// 	return{
	// 		restrict: 'E',
	// 		templateUrl: 'businessContextAnalysis.html',
	// 		controller: function(){},
	// 		controllerAs: 'test'
	// 	}
	// })
	// 
	// .directive('usabilityEngineering', function(){
	// 
	// });	
	// 
	// .directive('user-experience-planning', function(){
	// 
	// });
	
	.controller('getPracticeVertical', ['$scope', '$http', function($scope, $http){
		var data = this;
		data = {};
		
		$http.get('/./assets/js/uxd-practice-verticals.json')
			.success(function(d){
				data = this.d; 
			})
			.error(function(){
				console.log('fail');
			});
	}]);

})();

