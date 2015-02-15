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
		data.firstHalf = [];
		data.secondHalf = [];
		
		$http.get('/./assets/js/uxd-practice-verticals.json')
			.success(function(results){
				data.firstHalf = results.slice(0,4);
				data.secondHalf = results.slice(4,8);
				console.log(data.firstHalf);
			})
			.error(function(){
				console.log('fail');
			});
	}]);

})();

