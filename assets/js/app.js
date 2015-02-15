(function(){

	var uxdTable = angular.module('uxdpv', [])

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
	
	.controller('getPracticeVertical', ['$http', function($http){
		var data = this;
		data.pv = [];
		
		$http.get('/./assets/js/uxd-practice-verticals.json')
			.success(function(results){
				data.pv = results; 
			})
			.error(function(){
				console.log('fail');
			});
	}]);

})();

