(function(){
    angular
        .module("MDRAPI")
        .controller("CalculatorNewController",CalculatorNewController);
    //getting brands and models;
    function CalculatorNewController($scope, $http, $routeParams,$location, calculatorService, messageCenterService){
        if($routeParams.id){
            calculatorService.getCalculator($routeParams.id)
                .then(function(result){
                    $scope.calculator = result;
                },function(result){
                    messageCenterService.add('danger', result.message)

                });
            $scope.heading = 'Rediger Prisberegner';
            $scope.save = function(){
                updateCalculator();
            }
            $scope.thisis = 'Dette er en edit af:'+ $routeParams.id;
        }else{
            $scope.calculator = {};
            $scope.save = $scope.save = function(){
                createCalculator();
            }
            $scope.calculator.prisgrupper = [{name:'Prisgruppe 1'}];
            $scope.heading = 'Opret Ny Prisberegner';

            $scope.thisis = 'Dette er en ny prisberegner';
        }
        $scope.getBrands = function(){
            if(!$scope.calculator.brands){
                $http.get('http://localhost:3000/api/vehicle/brands/nested')
                    .success(
                        function(response) {
                            var brands = response;
                            $scope.calculator.brands = brands;
                        }
                    );
            }
        }
        //$http.get('http://localhost:3000/api/vehicle/brands/nested')
        //    .success(
        //        function(response) {
        //            var brands = response;
        //            $scope.brands = brands;
        //        });
        //getting models per brand

        //Functions for ui-tree

        $scope.remove = function (scope) {
            scope.remove();
        };

        $scope.toggle = function (scope) {
            scope.toggle();
        };

        $scope.moveLastToTheBeginning = function () {
            var a = $scope.data.pop();
            $scope.data.splice(0, 0, a);
        };



        $scope.newPrisgruppeItem = function (scope) {
            var nodeData = scope.$modelValue;

            $scope.calculator.prisgrupper.push({

                name: nodeData.name + '(kopi)' ,
                pris: nodeData.pris,

            });
        };

        $scope.collapseAll = function () {
            $scope.$broadcast('angular-ui-tree:collapse-all');
        };

        $scope.expandAll = function () {
            $scope.$broadcast('angular-ui-tree:expand-all');
        };



        $scope.setActive = function(activetab){
            $scope.active = activetab;
        }

        function updateCalculator(){
            calculatorService.updateCalculator($scope.calculator)
                .then(function(result){
                    messageCenterService.add("success", "Prisberegneren er blevet opdateret", {status: messageCenterService.status.next});
                    $location.path('/dashboard');
                    //$scope.calculator = result;
                },function(result){
                    messageCenterService.add('danger', result.message)

                });

        }

        function createCalculator(){

        }

    }
})();
