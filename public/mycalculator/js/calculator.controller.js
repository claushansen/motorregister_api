(function(){
    angular
        .module("mycalculator")
        .controller("CalculatorController",CalculatorController);

    function CalculatorController($scope,$http,$routeParams){
        $scope.manualSearch = false;

        $scope.setManual = function(){
            $scope.manualSearch = !$scope.manualSearch;
        }

        $scope.reset = function(){
            $scope.manualSearch = false;
            $scope.search = null;
            $scope.offer = null;
            $scope.models = null;

        }

        $scope.findOfferLicensplate = function() {
            var calcid = $routeParams.calcid
            $scope.search.licensplate = $scope.search.licensplate.toUpperCase();
            $http.get('http://localhost:3000/api/mycalculator/'+calcid+'/offer/licensplate/'+$scope.search.licensplate)
            .success(function (data) {
                    $scope.offer = data;
                }
            );
        }

        $scope.findOfferManual = function() {
            if($scope.search.model) {
                var calcid = $routeParams.calcid
                var modelid = $scope.search.model.id;
                $http.get('http://localhost:3000/api/mycalculator/' + calcid + '/offer/model/' + modelid)
                .success(function (data) {
                        $scope.offer = data;
                    }
                );
            }
        }

        $scope.getBrands = function() {
            if(!$scope.brands) {
                var calcid = $routeParams.calcid
                $scope.brandsloading = true;
                $http.get('http://localhost:3000/api/mycalculator/' + calcid + '/brands')
                .success(function (data) {
                    $scope.brands = data.brands;
                        $scope.brandsloading = false;
                    }
                );
            }
        }

        $scope.getModels = function() {
            if($scope.search.brand.id) {
                var calcid = $routeParams.calcid;
                var brandid = $scope.search.brand.id;
                $scope.modelsloading = true;
                $http.get('http://localhost:3000/api/mycalculator/' + calcid + '/models/'+brandid)
                .success(function (data) {
                        $scope.models = data.models;
                        $scope.modelsloading = false;
                    }
                );
            }
        }

        $scope.hello = "hi from PriceOfferController";
    }
})();
