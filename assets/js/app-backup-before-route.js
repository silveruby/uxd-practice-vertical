(function(){

	/**
	 * Initiate AngularJS module
	*/
	var uxdpv = angular.module('uxdpv', ['ngRoute']);

	/**
	 * Directives used by module
	*/
	uxdpv.directive('practiceVerticals', function(){
		return {
			restrict: 'E',
			templateUrl: 'practiceVerticals.html'
		};
	});
	
	uxdpv.directive('newUserBox', function(){
		return{
			restrict: 'E',
			templateUrl: 'newUserBox.html'
		};
	});
	uxdpv.directive('custUserBox', function(){
		return{
			restrict: 'E',
			templateUrl: 'custUserBox.html'
		};
	});	

	/**
	 * Service to store shared data between controllers
	*/
	uxdpv.service('selectionData', function(){

		var selected_count = 0;
		var selectedData = null;

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
	        },
	        getSelectedData: function(){
	        	return selectedData;
	        },
	        setSelectedData: function(data){
	        	selectedData = data;
	        }

	    };
	});

	/**
	 * Service to store current user state between controllers
	*/
	uxdpv.service('userState', function(){

		var current_state = "s1";

		return{
	    	getCurrentState: function(){
	            return current_state;
	        },
	        setStateTo: function(state){
	        	current_state = state;
	        	switch (state){
	        		case 's1':
	        			$('.card-default').addClass('fadein');	
	        			break;
	        		case 's2':
	        			$('.card-default').removeClass('fadein');
	        			$('.card-save').addClass('fadein');	
	        			break;
	        		case 's3':
	        			$('.card-save').removeClass('fadein');
	        			$('.card-confirmation').addClass('fadein');	
	        			break;	 
	        		case 's4':
	        			$('.card-confirmation').removeClass('fadein');
	        			$('.card-user').addClass('fadein');	
	        			break;	
	        		case 's5':
	        			$('.card-user').removeClass('fadein');
	        			$('.card-authenticate').addClass('fadein');	
	        			break;	
	        		case 's6':
	        			$('.card-authenticate').removeClass('fadein');
	        			$('.card-modify').addClass('fadein');	
	        			break;	        			        			        			       				        		
	        	} // end switch state
	        }
	    };
	});	

	/**
	* General Helper functions
	*/
	generatePassword = function () {
	    var length = 8,
	        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
	        retVal = "";
	    for (var i = 0, n = charset.length; i < length; ++i) {
	        retVal += charset.charAt(Math.floor(Math.random() * n));
	    }
	    return retVal;
	}

	/**
	 * Controller to set Custom Messages
	*/
	uxdpv.controller('setCustomMessages', ['$rootScope', 'selectionData', 'userState', function($rootScope, selectionData, userState){
		var vm = this;
		vm.current_state = 's2';
		userState.setStateTo(vm.current_state);

		/** State 1 
		* Listen to user selection on the chart
		*/
		$rootScope.$on('updateCustomMessages', function(){

			if (selectionData.isSelected() && vm.current_state == 's1'){

				// switch state
				vm.goToState('s2');

				// destroy emit event 'updateCustomMessages'
				$rootScope.$destroy('updateCustomMessages');		
			}

		});

		// Switch between states
		vm.goToState = function(state){
			vm.current_state = state;
			userState.setStateTo(state);
		};

		/** State 2 
		* Sanitize name and email inputs, save data to DB
		*/
		vm.createUserLink = function(){

			// Sanitize name and email
			// This is done via AngularJS Form... TBD

			// Create Firebase Reference
			var myFirebaseRef = new Firebase("https://torrid-inferno-2523.firebaseio.com/");
			
			// Generate random password
			// var password = generatePassword();

			// Create user
			myFirebaseRef.createUser({
			  // email    : vm.email,
			  email: 'zhengsan@gmail.com',
			  password : 'helloworld'
			}, function(error, userData) {
			  if (error) {
			  	// Presentation
			  	$('.card-confirmation .error .msg').html("<strong>" + error + "</strong>");
			  	$('.card-confirmation .success').hide();
			  	$('.card-confirmation .error').show();
			  } else {
			  	// Save selection for new user
				var userSelectionJSON = selectionData.getSelectedData();
				angular.fromJson(angular.toJson(userSelectionJSON));
				//console.log(userSelectionJSON);

				myFirebaseRef.child(userData.uid).set(
				  userSelectionJSON, function(error){
					  if (error) {
					    // Presentation
					  	$('.card-confirmation .error .msg').html("<strong>" + error + "</strong>");
					  	$('.card-confirmation .success').hide();
					  	$('.card-confirmation .error').show();
					  } else {
					    // Presentation
					  	$('.card-confirmation .success').show();
					  	$('.card-confirmation .error').hide();
					  }
				});	// End Create child			

			  	// Display results
			    //console.log("Successfully created user account with uid:", userData.uid);

			  	// Sent password reset
			  	myFirebaseRef.resetPassword({
				  email : "zhengsan@gmail.com"
				}, function(error) {
				  if (error === null) {
				    console.log("Password reset email sent successfully");
				  } else {
				    console.log("Error sending password reset email:", error);
				  }
				}); // end password reset
			  }
			}); // end create user

			// switch state
			vm.goToState('s3');				
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
		vm.authenticateUser = function(){
			// Create Firebase Reference
			var myFirebaseRef = new Firebase("https://torrid-inferno-2523.firebaseio.com/");
			
			ref.authWithPassword({
			  email    : "bobtony@firebase.com",
			  password : "correcthorsebatterystaple"
			}, function(error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			  } else {
			    console.log("Authenticated successfully with payload:", authData);
			  }
			});	
		};

		/** State 6
		* Save or cancel changes 
		*/	

	}]);

	/**
	 * Controller to get Practice Vertical JSON into View
	*/
	uxdpv.controller('getPracticeVertical', ['$rootScope', '$http', 'selectionData', 'userState', function($rootScope, $http, selectionData, userState){
		
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
			vm.select[practiceVertical.ClassName][areaOfInterest.ClassName] ? selectionData.incrementSelectedCount() : selectionData.decrementSelectedCount();

			selectionData.setSelectedData(vm.select);

			$rootScope.$emit('updateCustomMessages');

		};

	}]);

})();
