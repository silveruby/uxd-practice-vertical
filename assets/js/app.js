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
		vm.current_state = 's1';

		/** State 1 
		* Listen to user selection on the chart
		*/
		$rootScope.$on('updateCustomMessages', function(){

			if (selectionData.isSelected() && vm.current_state == 's1'){

				// switch state
				vm.current_state = 's2';

				// fade in generate link
				$('.card-save').addClass('fadein');	

				// destroy emit event 'updateCustomMessages'
				$rootScope.$destroy('updateCustomMessages');		
			}

		});

		/** State 2 
		* Sanitize name and email inputs, save data to DB
		*/
		vm.generateLink = function(){

			// BEHAVIOR

			// Sanitize name and email
			
			// Create Firebase Reference
			var myFirebaseRef = new Firebase("https://torrid-inferno-2523.firebaseio.com/");
			
			// Generate random password

			// Create user
			myFirebaseRef.createUser({
			  email    : "bobtony@firebase.com",
			  password : "correcthorsebatterystaple"
			}, function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			  }
			});		

			// Save selection for user	

			// PRESENTTION

			// switch state
			vm.current_state = 's3';

			// fade in personal link
			$('.card-confirmation').addClass('fadein');	

			$rootScope.$emit('getUserPV');			
		};

		/** State 3
		* Provide confirmation and new link to user's chart
		*/

		/** State 4
		* Show user's link and share and edit options
		*/		

		/** State 5
		* Authenticate email and password 
		*/			

		/** State 6
		* Save or cancel changes 
		*/	

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
				if(pv != "Owner"){
					for (a in vm.select[pv]){
						if(vm.select[pv][a]) count++;
					}
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
			vm.select[practiceVertical.ClassName][areaOfInterest.ClassName] = vm.select[practiceVertical.ClassName][areaOfInterest.ClassName] ? false : true;
			vm.select[practiceVertical.ClassName][areaOfInterest.ClassName] ? selectionData.incrementSelectedCount() : selectionData.decrementSelectedCount()	

			$rootScope.$emit('updateCustomMessages');

		};

		/**
		 * Debugging on console
		*/
		// $rootScope.$on('getUserPV', function(){
		// 	console.log(vm.select);
		// });

	}]);

})();
