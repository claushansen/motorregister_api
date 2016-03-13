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

		$scope.getModels = function() {
			$scope.models = null;
			$http.get("http://localhost:3000/api/vehicle/models/"+$scope.brand_sel).success(function(response) {$scope.models = response;});

		}
	}


})();