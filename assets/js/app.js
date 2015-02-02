(function(){

	// setting up JSON objects for individual UXD practice verticals
	var practice_vertical = {
	
	"Business Context Analysis" : [ 
	"Context Map",
	"Performance Measures",
	"Product / Service Definitions",
	"Business Intent",
	"Mission / Vision",
	"Business Model"],

	"Usability Engineer" : ["Synthesis", 
	"Primary Research",
	"Testing",
	"Logistics",
	"Research Design",
	"Analytics"], 
	
	"User Experience Planning" : [ 
	"UX Brief",
	"Personas",
	"Engagement Definitions",
	"UX Management",
	"UX Strategy",
	"Research"],
	
	"Content Publishing" : [ 
	"Content",
	"Editing",
	"Governance",
	"Content Management",
	"Content Strategy",
	"Research / Analytics"],
	
	"Information Architecture" : [ 
	"Navigation",
	"Information Organization",
	"Information Relationship",
	"IA Management",
	"IA Strategy",
	"Research / Analytics"], 
	
	"Interaction Design" : [ 
	"Wireframe",
	"Interaction",
	"Patterns",
	"Conventions",
	"Device Strategy",
	"Research / Analytics"],
	
	"Visual & Information Design" : [ 
	"Graphics",
	"Layout",
	"Style Guide",
	"Art Direction",
	"Creative Strategy",
	"Research / Analytics"],
	
	"Computer Science" : [ 
	"Front-end Code",
	"Database Design",
	"Server Code",
	"Infrastructure",
	"System Architecture",
	"Research / Analytics"]
	
	} // end pratice vertical object


	var uxdTable = angular.module('uxd.table', [])

	.directive('businessContextAnalysis', function(){
		return{
			restrict: 'E',
			templateUrl: 'businessContextAnalysis.html',
			controller: function(){},
			controllerAs: 'test'
		}
	})

	.directive('usabilityEngineering', function(){

	});	
	
	.directive('user-experience-planning', function(){

	});

	})();
