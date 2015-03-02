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
			
		$scope.toggleSelected = function(event, areaOfInterest){

			var areaBox, x, y, w, h, rect, after;
			
			areaBox = document.querySelector("." + areaOfInterest.ClassName);
			
			rect = areaBox.getBoundingClientRect();
			x = event.clientX - rect.left;
			y = event.clientY - rect.top;
			
			w = $("." + areaOfInterest.ClassName + " .ripple").width();
			h = $("." + areaOfInterest.ClassName + " .ripple").height();
			
			x = x - (w/2);
			y = y - (h/2);
			
			
			$("." + areaOfInterest.ClassName + " .ripple").css({  top : y + 'px', left : x + 'px' });
			
			areaOfInterest.isSelected = !areaOfInterest.isSelected;
			
			
			$("." + areaOfInterest.ClassName + " .ripple").removeClass("selected").width();
			$("." + areaOfInterest.ClassName + " .ripple").addClass("selected");
			
		};
	}]);

})();

