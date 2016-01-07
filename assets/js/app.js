(function(){

	/**
	 * Initiate AngularJS module
	*/
	var uxdpv = angular.module('uxdpv', []);


	/**
	 * Directives used by module
	*/
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
	 * Service to store shared data between controllers
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
	        },
	        setSelectedCount: function(count){
	        	selected_count = count;
	        }

	    };
	});

	/**
	 * Controller to set Custom Messages
	*/
	uxdpv.controller('setCustomMessages', ['$rootScope', 'selectionData', function($rootScope, selectionData){
		var vm = this;
		vm.current_state = 'default';

		$rootScope.$on('updateCustomMessages', function(){

			if (selectionData.isSelected() && vm.current_state == 'default'){

				// switch state
				vm.current_state = 'generate-link';

				// fade in generate link
				$('.s2GenerateLink').addClass('fadein');	

				// destroy emit event 'updateCustomMessages'
				$rootScope.$destroy('updateCustomMessages');		
			}

		});

		vm.generateLink = function(){

			// switch state
			vm.current_state = 'personal-link';

			// fade in personal link
			$('.s3Personal').addClass('fadein');	

			$rootScope.$emit('getUserPV');			
		};

	}]);

	/**
	 * Controller to get Practice Vertical JSON into View
	*/
	uxdpv.controller('getPracticeVertical', ['$rootScope', '$http', 'selectionData', function($rootScope, $http, selectionData){
		
		var vm = this;

		vm.pv1 = [];
		vm.pv2 = [];
		vm.select = [];

		/**
		 * Get JSON object to populate practice vertical
		*/
		$http.get('/./assets/js/uxd-practice-verticals.json')
		.success(function(results){
			vm.pv1 = results.slice(0,4);
			vm.pv2 = results.slice(4,8);
		})
		.error(function(){
			vm.pv1 = undefined;
			vm.pv2 = undefined;
		});

		/**
		 * Get JSON object of default selection
		*/
		$http.get('/./assets/js/default-selection.json')
		.success(function(results){
			
			var count = 0;

			vm.select = results;

			for (pv in vm.select){
				for (a in vm.select[pv]){
					count = vm.select[pv][a] ? count++ : count;
				}
			}

			selectionData.setSelectedCount(count);
		})
		.error(function(){
			vm.select = undefined;
		});

		/**
		 * Set toggle behavior on individual area of interest
		 * This is to be called with ng-click
		*/
		vm.toggleSelected = function(event, practiceVertical, areaOfInterest){


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
			// areaOfInterest.isSelected = !areaOfInterest.isSelected;
			// areaOfInterest.isSelected ? selectionData.incrementSelectedCount() : selectionData.decrementSelectedCount()	
			vm.select[practiceVertical.Name][areaOfInterest.Name] = vm.select[practiceVertical.Name][areaOfInterest.Name] ? false : true;
			vm.select[practiceVertical.Name][areaOfInterest.Name] ? selectionData.incrementSelectedCount() : selectionData.decrementSelectedCount()	

			$rootScope.$emit('updateCustomMessages');

		};


		$rootScope.$on('getUserPV', function(){
			console.log(vm.select);
		});

	}]);

})();
