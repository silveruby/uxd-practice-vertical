(function(){

	/**
	 * Initiate AngularJS module
	*/
	var uxdpv = angular.module('uxdpv', ['firebase']);

	/**
	 * Directives used by module
	*/
	uxdpv.directive('practiceVerticals', function(){
		return {
			restrict: 'E',
			templateUrl: 'practiceVerticals.html'
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
			obj  : function(userID){
				var myFirebaseRef = new Firebase(fireBaseProject + userID);				
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
		vm.selected_count = 0;
		vm.pv1 = [];
		vm.pv2 = [];
		vm.select = [];	

		/** Init
		*/
		vm.init = function(){

			// Detect URL parameter
			vm.loc = $location.path('/').search();

			console.log(vm.loc.email);

			// Populate JSON chart
			vm.populatePV();	

			// Determine data is in FireBase
			if(vm.loc.email != undefined){

				// check if Email is valid
				myFireBase.auth().$authWithPassword({
					email: vm.loc.email,
				  	password: 'nopassword'
				}).then(function(authData) {
				  	console.log("Logged in as:", authData.uid);
				  	
					// Try to get results based on user id
					myFireBase.obj(authData.uid).$loaded()
						.then(function(results){

						if(results.$value === null){
							// Load default selection JSON object 
							vm.loadDefaultSelection();
						}
						else{				
						    vm.select = results;

						    for (pv in vm.select){
								//console.log('pv: ' + pv);
								for (a in vm.select[pv]){
									//console.log('a: ' + a);
									//console.log('vm.select[pv[a]: ' + vm.select[pv][a]);
									if(vm.select[pv][a]) vm.selected_count ++;
								}
							}
							vm.goToState('s4');
						}

					}).catch(function(err) {
						// Load default selection JSON object 
						console.log("User does not exist");
						vm.loadDefaultSelection();
					});				  	

				}).catch(function(error) {				
				  	// Load default selection JSON object 
					console.log("UserID Select Object does not exist");
					vm.loadDefaultSelection();	
				});
			} // end if
			else{
				// Load default selection JSON object 
				vm.loadDefaultSelection();
			} 
		}; 	

		/** State 1
		 * Set toggle behavior on individual area of interest
		 * This is to be called with ng-click
		*/
		vm.toggleSelected = function(event, practiceVertical, areaOfInterest){

			if(vm.current_state == 's1' || vm.current_state == 's2' || vm.current_state == 's6'){
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

				if (vm.current_state = 's1' && vm.selected_count > 0){
					// switch state
					vm.goToState('s2');		
				}
			}

		}; // end helper function for toggleSelected

		/** State 2 
		* Sanitize name and email inputs, save data to DB
		*/
		vm.createUserLink = function(){

			// Sanitize name and email
			// This is done via AngularJS Form... TBD
			
			// Generate random password
			// var password = generatePassword();

			// Step 1: Create user
			auth = myFireBase.auth();
			auth.$createUser({
				email: vm.newEmail,
				password: "nopassword"
			}).then(function(userData) { 

				// Step 2: Use userID to save selection
			  	console.log("User " + userData.uid + " created successfully!");
			  	
			  	// Save selection for new user
			  	obj = myFireBase.obj(userData.uid);
				userSelectionJSON = vm.select;
				angular.fromJson(angular.toJson(userSelectionJSON));

				console.log(obj);

				obj.$ref().set(userSelectionJSON, function(error) {
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
				});

			}).catch(function(error) { // oh no!
			  	console.log("Error: ", error);
			  	// Presentation
			  	$('.card-confirmation .error .msg').html("<strong>" + error + "</strong>");
			  	$('.card-confirmation .success').hide();
			  	$('.card-confirmation .error').show();			  	
			});

			// switch state
			vm.goToState('s3');				
		};

		/** State 3
		* Provide confirmation and new link to user's chart
		*/		

		/** State 4
		* Show user's link and share and edit options
		*/		
		vm.modifyChart = function(){

		};		

		/** State 5
		* Authenticate email and password 
		*/			
		vm.authenticateUser = function(){
			console.log("User email: " + vm.userEmail);	

			auth = myFireBase.auth();

			auth.$authWithPassword({
				email: vm.userEmail,
			  	password: 'nopassword'
			}).then(function(authData) {
			  	console.log("Logged in as:", authData.uid);

			  	// Go to state modify
			  	vm.goToState('s6');

			}).catch(function(error) {				
			  	console.error("Authentication failed:", error);

			  	// PRESENTATION
			  	$('.card-authenticate .error .msg').html("<strong>" + error + "</strong>"); 	
			  	$('.card-authenticate .form').hide();			  	
			  	$('.card-authenticate .error').show();
			});
		};
		/** State 5 
		* Reset password
		*/			
		vm.resetUserPassword = function(){
			console.log("User email: " + vm.userEmail);
			console.log("User password: " + vm.userPassword);	

			auth = myFireBase.auth();

			auth.$authWithPassword({
				email: vm.userEmail,
			  	password: vm.userPassword
			}).then(function(authData) {
			  	console.log("Logged in as:", authData.uid);

			  	// Go to state modify
			  	vm.goToState('s6');

			}).catch(function(error) {
				
			  	// Go to state modify
			  	vm.goToState('s6');				
			  	console.error("Authentication failed:", error);
			});
		};		

		/** State 6
		* Save or cancel changes 
		*/	
		vm.saveChanges = function(){

		};

		/** HELPER function
		* Populate PV
		*/
		vm.populatePV = function(){
			// Populate JSON chart
			$http.get('/./assets/js/uxd-practice-verticals.json')
			.success(function(results){
				console.log('success');
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
		vm.loadDefaultSelection = function(){

			vm.goToState('s1');	

			$http.get('/./assets/js/default-selection.json')
			.success(function(results){
				vm.select = results;
				vm.selected_count = 0; 
				for (pv in vm.select){
					for (a in vm.select[pv]){
						if(vm.select[pv][a]) vm.selected_count++;
					}
				}
				console.log('using default selection');
			})	
			.error(function(){
				console.log('error with default selection');
			});			
		};

		/** HELPER function
		* Switch between states
		*/
		vm.goToState = function(state){
			
			vm.current_state = state;
			console.log("current state: " + vm.current_state);

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
        			console.log("state 4");
        			$('.messageBox .card-user').addClass('fadein');	
        			break;	
        		case 's5':
        			$('.card-authenticate').addClass('fadein');	
        			break;	
        		case 's6':
        			$('.card-modify').addClass('fadein');	
        			break;	        			        			           	
        	} // end switch state
		};

		/** HELPER function
		* Generate random password
		*/
		vm.generatePassword = function () {
		    var length = 8,
		        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		        retVal = "";
		    for (var i = 0, n = charset.length; i < length; ++i) {
		        retVal += charset.charAt(Math.floor(Math.random() * n));
		    }
		    return retVal;
		} // end helper function for generatePassword

		vm.init();

	}]); // end MainController

})();
