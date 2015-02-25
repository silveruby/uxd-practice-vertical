(function(){

	var uxdTable = angular.module('uxdpv', [])
	
	.directive('practiceVerticals', function(){
		return {
			restrict: 'E',
			templateUrl: 'practiceVerticals.html',	
			controller: 'getPracticeVertical', 
			controllerAs: 'pvCtrl'				
		};
	})
	
	.controller('getPracticeVertical', ['$scope', '$http', function($scope, $http){
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
			
		$scope.toggleSelected = function(areaOfInterest){
			areaOfInterest.isSelected = !areaOfInterest.isSelected;
		};
	}]);

})();

