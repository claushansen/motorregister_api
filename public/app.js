(function(){
	angular.module("VehicleLookup",[])
	.controller("LookupController",lookupcontroller);
	
	function lookupcontroller($scope,$http){
		$scope.welcome = "Hello from lookupcontroller";
		$http.get("http://localhost:3000/api/vehicle/brands")
  .success(
  function(response) {
	  $scope.brands = response;
	  });
	}
	
	
	})();