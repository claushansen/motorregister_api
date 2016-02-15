(function(){
	angular.module("VehicleLookup",[])
	.controller("LookupController",lookupcontroller);
	
	function lookupcontroller($scope){
		$scope.welcome = "Hello from lookupcontroller";
	}
	
	
	})();