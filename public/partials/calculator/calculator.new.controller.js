(function(){
    angular
        .module("MDRAPI")
        .controller("CalculatorNewController",CalculatorNewController);
    //getting brands and models;
    function CalculatorNewController($scope,$http){
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

        $scope.newSubItem = function (scope) {
            var nodeData = scope.$modelValue;
            if(!nodeData.extra) {
                nodeData.extra = [];
            }
            nodeData.extra.push({
                id: nodeData.id + 10 + nodeData.extra.length,
                name: nodeData.name + '.' + (nodeData.extra.length + 1),
                extra: []
            });
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


        $scope.calculator = {};
        $scope.setActive = function(activetab){
            $scope.active = activetab;
        }
        $scope.calculator.prisgrupper = [{name:'Prisgruppe 1'}]
    }
})();
