(function(){

	var uxdTable = angular.module('uxdpv', [])
	
	.directive('practiceVerticals', function(){
		return {
			restrict: 'E',
			templateUrl: 'practiceVerticals.html',	
			controller: 'getPracticeVertical', 
			controllerAs: 'pvCtrl'				
		}
	})
	
	.controller('getPracticeVertical', ['$http', function($http){
		var data = this;
		data.firstHalf = [];
		data.secondHalf = [];
		
		$http.get('/./assets/js/uxd-practice-verticals.json')
			.success(function(results){
				data.firstHalf = results.slice(0,4);
				data.secondHalf = results.slice(4,8);
			})
			.error(function(){
				data.firstHalf = undefined;
				data.secondHalf = undefined;
			});
	}]);

})();

