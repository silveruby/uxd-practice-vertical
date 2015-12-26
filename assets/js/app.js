(function(){

	var uxdpv = angular.module('uxdpv', []);


	uxdpv.directive('practiceVerticals', function(){
		return {
			restrict: 'E',
			templateUrl: 'practiceVerticals.html'
		};
	});
	
	uxdpv.directive('customMessages', function(){
		return{
			restrict: 'E',
			templateUrl: 'customMessages.html'
		};

	});

	/**
	 * Factory to store shared data between controllers
	*/
	uxdpv.service('selectionData', function(){

		var selected_count = 0;

		return{
	    	getSelectedCount: function(){
	            return selected_count;
	        },
	        incrementSelectedCount: function(){
	        	selected_count++;
	        },
	        decrementSelectedCount: function(){
	        	selected_count != 0 ? selected_count-- : selected_count; 
	        },
	        isSelected: function(){
	        	return selected_count > 0 ? true : false;
	        }

	    };
	});

	/**
	 * Controller to set Custom Messages
	*/
	uxdpv.controller('setCustomMessages', ['$rootScope', 'selectionData', function($rootScope, selectionData){
		var vm = this;
		vm.current_state = 'default';

		$rootScope.$on('updateCustomMessages', function(event){

			if (selectionData.isSelected() && vm.current_state == 'default'){

				// switch state
				vm.current_state = 'generate-link';

				// fade in generate link
				$('.s2GenerateLink').addClass('fadein');	

				// destroy emit event 'updateCustomMessages'
				$rootScope.$destroy('updateCustomMessages');		
			}

		});

		vm.generateLink = function(event){

			// switch state
			vm.current_state = 'personal-link';

			// fade in personal link
			$('.s3Personal').addClass('fadein');				
		}

	}]);

	/**
	 * Controller to get Practice Vertical JSON into View
	*/
	uxdpv.controller('getPracticeVertical', ['$rootScope', '$http', 'selectionData', function($rootScope, $http, selectionData){
		
		var vm = this;

		vm.firstHalf = [];
		vm.secondHalf = [];

		// Get JSON object to populate practice vertical
		$http.get('/./assets/js/uxd-practice-verticals.json')
		.success(function(results){
			vm.firstHalf = results.slice(0,4);
			vm.secondHalf = results.slice(4,8);
		})
		.error(function(){
			vm.firstHalf = undefined;
			vm.secondHalf = undefined;
		});

		/**
		 * Set toggle behavior on individual area of interest
		 * This is to be called with ng-click
		*/
		vm.toggleSelected = function(event, areaOfInterest){


			// Generate ripple effect
			var areaBox, x, y, w, h, rect;

			areaBox = document.querySelector("." + areaOfInterest.ClassName);

			rect = areaBox.getBoundingClientRect();
			x = event.clientX - rect.left;
			y = event.clientY - rect.top;

			w = $("." + areaOfInterest.ClassName + " .ripple").width();
			h = $("." + areaOfInterest.ClassName + " .ripple").height();

			x = x - (w/2);
			y = y - (h/2);


			$("." + areaOfInterest.ClassName + " .ripple").css({  top : y + 'px', left : x + 'px' });


			$("." + areaOfInterest.ClassName + " .ripple").removeClass("selected").width();
			$("." + areaOfInterest.ClassName + " .ripple").addClass("selected");

			// Update isSelected and global selected_count
			areaOfInterest.isSelected = !areaOfInterest.isSelected;
			areaOfInterest.isSelected ? selectionData.incrementSelectedCount() : selectionData.decrementSelectedCount()	

			$rootScope.$emit('updateCustomMessages');

		};

	}]);

})();
