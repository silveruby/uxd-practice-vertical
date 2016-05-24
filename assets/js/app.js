(function(){

	/**
	 * Initiate AngularJS module
	*/
	var uxdpv = angular.module('uxdpv', ['firebase', 'duScroll']);

	/**
	 * Directives used by module
	*/
	uxdpv.directive('messageBox', function(){
		return {
			restrict: 'E',
			templateUrl: '/templates/messageBox.html'
		};
	});
	/**
	 * Directives used by module
	*/
	uxdpv.directive('practiceVerticals', function(){
		return {
			restrict: 'E',
			templateUrl: '/templates/practiceVerticals.html'
		};
	});	
	/**
	 * Directives used by module
	*/
	uxdpv.directive('learnMore', function(){
		return {
			restrict: 'E',
			templateUrl: '/templates/learnMore.html'
		};
	});	
	/**
	 * Directives used by module
	*/
	uxdpv.directive('contact', function(){
		return {
			restrict: 'E',
			templateUrl: '/templates/contact.html'
		};
	});			

	uxdpv.config( [ '$locationProvider', function( $locationProvider ) {
	   // In order to get the query string from the
	   // $location object, it must be in HTML5 mode.
	   $locationProvider.html5Mode( true );
	}]);

	/** Factory
	 * FireBase APIs using AngularFire 
	*/
	uxdpv.factory('myFireBase', ['$firebaseObject', '$firebaseAuth', 
		function($firebaseObject, $firebaseAuth) {

		var fireBaseProject= 'https://torrid-inferno-2523.firebaseio.com/'
		return {
			auth : function(){
				var myFirebaseRef = new Firebase(fireBaseProject);
				return $firebaseAuth(myFirebaseRef);
			},
			obj  : function(userNormalizedEmail){
				var myFirebaseRef = new Firebase(fireBaseProject + userNormalizedEmail);				
				return $firebaseObject(myFirebaseRef);
			}
		};
	}]);

	/**
	 * Main controller
	*/
	uxdpv.controller('mainController', 
		['$scope', '$location', '$http', 'myFireBase',
		function($scope, $location, $http, myFireBase){

		var vm = $scope;
		vm.current_state = '';
		vm.current_status = '';
		vm.current_link = 'http://www.uxpvd.io/?email='
		vm.selected_count = 0;
		vm.pv1 = [];
		vm.pv2 = [];
		vm.select = [];	
		vm.msgBox = { user: '', 
					email: '', 
					link: '',
					password: '' };


		/** Init
		*/
		vm.init = function(){

			// Detect URL parameter
			vm.loc = $location.path('/').search();

			// Determine data is in FireBase
			if(vm.loc.email != undefined && vm.loc.email != ''){	  	
				  	
				// Normalize Email
			  	vm.msgBox.email = vm.loc.email;
				//console.log(email);

				// Try to get results based on email
				myFireBase.obj(vm.normalizeEmail(vm.msgBox.email)).$loaded()
					.then(function(results){

					if(results.$value === null){

						vm.msgBox.link = vm.current_link + vm.loc.email;

						// Load default selection JSON object 
						vm.loadDefaultSelection('is_error');

						// Go to state 1
						//vm.goToState('s1', 'is_error');
					}
					else{				
						console.log(results);
					    vm.select = results.select;
					    vm.msgBox.user = results.name;
					    vm.msgBox.link = vm.current_link + vm.loc.email;

					    for (pv in vm.select){
							for (a in vm.select[pv]){
								//console.log('a: ' + a);
								//console.log('vm.select[pv[a]: ' + vm.select[pv][a]);
								if(vm.select[pv][a]) vm.selected_count ++;
							}
						}

						// Go to state 4
						vm.goToState('s4', 'is_default');
					}

				}).catch(function(err) {
					// Display error
					vm.msgBox.link = vm.msgBox.link + vm.loc.email;

					// Load default selection JSON object 
					console.log("No record for this userID");
					vm.loadDefaultSelection('is_error');
				});				  	
			} 
			else{	
				// Load default selection JSON object 
				vm.loadDefaultSelection('is_default');	
			} 

			// Populate JSON chart
			vm.populatePV();				
		}; 	

		/** State 1
		 * Set toggle behavior on individual area of interest
		 * This is to be called with ng-click
		*/
		vm.toggleSelected = function(event, practiceVertical, areaOfInterest){

			if(vm.current_state == 's1' || 
				vm.current_state == 's2' || 
				vm.current_state == 's7'){
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
				vm.select[practiceVertical.ClassName][areaOfInterest.ClassName] = 
					vm.select[practiceVertical.ClassName][areaOfInterest.ClassName] ? 
					false : true;
				
				vm.select[practiceVertical.ClassName][areaOfInterest.ClassName] ? 
					vm.selected_count++ : vm.selected_count--;

				if (vm.current_state == 's1' && vm.selected_count > 0){
					// switch state
					vm.goToState('s2', 'is_default');		
				}
			}

		}; // end helper function for toggleSelected

		/** State 2 
		* Sanitize name and email inputs, save data to DB
		*/
		vm.createUserLink = function(){

			// Sanitize name and email
			// This is done via AngularJS Form... TBD
			
			// Update message box variables
			vm.msgBox.password = 'uxdpv'
			vm.msgBox.email = vm.newEmail;
			vm.msgBox.user = vm.newName;
			vm.msgBox.link = vm.current_link + vm.msgBox.email;

			// Step 1: Create user
			auth = myFireBase.auth();
			auth.$createUser({
				email: vm.msgBox.email,
				password: vm.msgBox.password
			}).then(function(userData) { 

				// Step 2: Use userID to save selection
			  	console.log("User " + userData.uid + " created successfully!");

			  	// Normalize email
			  	normalizeEmail = vm.normalizeEmail(vm.msgBox.email);

			  	// Save selection for new user
			  	obj = myFireBase.obj(normalizeEmail);
				userSelectionJSON = vm.select;
				angular.fromJson(angular.toJson(userSelectionJSON));

				// Set value to firebase object
				obj.select = userSelectionJSON;
			  	obj.name = vm.msgBox.user;

				obj.$save().then(function() {
					// switch state
					vm.goToState('s3', 'is_default');	
				}, function(error) {
					// If error saving JSON selection
				  	$('.card-confirmation .error .msg').html("<strong>" + error + "</strong>");
				  	// switch state
					vm.goToState('s3', 'is_error');	
				});
			}).catch(function(error) {
			  	console.log("Error: ", error);
			  	// If error creating user account
			  	$('.card-confirmation .error .msg').html("<strong>" + error + "</strong>");
			  	// switch state
				vm.goToState('s3', 'is_error');			  	
			});			
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
			console.log("User email: " + vm.msgBox.email);	

			myFireBase.auth().$authWithPassword({
				email: vm.msgBox.email,
			  	password: vm.userPassword
			}).then(function(authData) {

			  	// Go to state modify
			  	vm.goToState('s7', 'is_default');

			}).catch(function(error) {				
			  	console.error("Authentication failed:", error);

			  	// PRESENTATION
			  	$('.card-authenticate .error .msg').html("<strong>" + error + "</strong>"); 	
			  	// switch state
				vm.goToState('s5', 'is_error');	
			});
		};
		/** State 6 
		* Reset password
		*/			
		vm.resetUserPassword = function(){
			console.log("User password: " + vm.msgBox.email);	

			myFireBase.auth().$resetPassword({
				email: vm.msgBox.email
			}).then(function(authData) {
			  	// Update with confirmation  message
			  	$('.card-reset .success').show();
			  	$('.card-reset .default').hide();

			}).catch(function(error) {
			  	// Update with confirmation  message
			  	$('.card-reset .error').show();
			  	$('.card-reset .default').hide();			
			});
		};		

		/** State 7
		* Update or cancel changes 
		*/	
		vm.saveChanges = function(){
		  	// Normalize email
		  	normalizeEmail = vm.normalizeEmail(vm.msgBox.email);

		  	// Update selection for new user
		  	obj = myFireBase.obj(normalizeEmail);
			userSelectionJSON = vm.select;
			angular.fromJson(angular.toJson(userSelectionJSON));
			obj.select = userSelectionJSON;
			obj.name = vm.msgBox.user;

			obj.$save().then(function() {
				console.log("updated successfully");
			 	// If error saving JSON selection
				vm.goToState('s8', 'is_default');					
			}, function(error) {
			 	// If error saving JSON selection
				vm.goToState('s8', 'is_error');	
			});
			
		};

		/** HELPER function
		* Populate PV
		*/
		vm.populatePV = function(){
			// Populate JSON chart
			$http.get('/./assets/js/uxd-practice-verticals.json')
			.success(function(results){
				vm.pv1 = results.slice(0,4);
				vm.pv2 = results.slice(4,8);
			})
			.error(function(){
				console.log("Error: cannot get default PVs");
			});	
		};

		/** HELPER function
		* Load default selections
		*/
		vm.loadDefaultSelection = function(status){	

			$http.get('/./assets/js/default-selection.json')
			.success(function(results){
				vm.select = results;
				vm.selected_count = 0; 
				for (pv in vm.select){
					for (a in vm.select[pv]){
						if(vm.select[pv][a]) vm.selected_count++;
					}
				}
				// Display default, no email detected
				vm.goToState('s1', status);
			})	
			.error(function(){
				console.log('error with default selection');

				// Display default, no email detected
				vm.goToState('s1', 'is_error');				
			});			
		};

		/** HELPER function
		* Switch between states
		*/
		vm.goToState = function(state, status){
			
			vm.current_state = state;
			vm.current_status = status;

			console.log("current state: " + vm.current_state);
			console.log("current status: " + vm.current_status);

			$('.fade').removeClass('fadein');

			switch (state){
        		case 's1':
        			$('.card-default').addClass('fadein');
        			break;
        		case 's2':
        			$('.card-save').addClass('fadein');	
        			break;
        		case 's3':
        			$('.card-confirmation').addClass('fadein');	
        			break;	 
        		case 's4':
        			$('.card-user').addClass('fadein');	
        			break;	
        		case 's5':
        			$('.card-authenticate').addClass('fadein');	
        			break;	
        		case 's6':
        			$('.card-reset').addClass('fadein');	
        			break;	        			
        		case 's7':
        			$('.card-modify').addClass('fadein');	
        			break;	 
        		case 's8':
        			$('.card-updated').addClass('fadein');	
        			break;	        			       			        			           	
        	} // end switch state
		};

		/** HELPER function
		* Normalize email by removing special characters
		*/
		vm.normalizeEmail = function (email) {
		    return email.replace(/[^a-zA-Z0-9]/g, '-');
		} 	

		/** HELPER function
		* Generate random password
		*/
		vm.generatePassword = function () {
		    var length = 5,
		        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		        retVal = "";
		    for (var i = 0, n = charset.length; i < length; ++i) {
		        retVal += charset.charAt(Math.floor(Math.random() * n));
		    }
		    return retVal;
		} // end helper function for generatePassword

		angular.element(document).ready(function () {
	        vm.init();
	    });

	}]); // end MainController

})();
