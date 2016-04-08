(function(){
    angular
        .module("BILAPI")
        .controller("CalculatorController",CalculatorController);
    //getting brands and models;
    function CalculatorController($scope,$rootScope, $http, $routeParams, $location, calculatorService, messageCenterService){
        //is this an edit of an existing calculator
        if($routeParams.id){
            //getting the existing calculator
            calculatorService.getCalculator($routeParams.id)
                .then(function(result){
                    $scope.calculator = result;
                },function(result){
                    messageCenterService.add('danger', result.message)
                });
            // setting headline to update
            $scope.heading = 'Rediger Prisberegner';
            //Assigning save function to update
            $scope.save = function(){
                updateCalculator();
            }
        }
        // if no id, we are dealing with a new calculator
        else{
            //creating a new empty calculator object
            $scope.calculator = {};
            //Setting userID on calculator
            $scope.calculator.user_id = $rootScope.currentUser._id;
            //Assigning save function to Create new
            $scope.save = $scope.save = function(){
                createCalculator();
            };
            //Creating the first prisgruppe on calculator
            $scope.calculator.prisgrupper = [{id:'id' + (new Date()).getTime(),name:'Prisgruppe 1'}];
            //setting headline to create new
            $scope.heading = 'Opret Ny Prisberegner';
        }


        $scope.getBrands = function(){
            //TODO - create service for brands
            if(!$scope.calculator.brands){
                $http.get('/api/vehicle/brands/nested')
                    .success(
                        function(response) {
                            var brands = response;
                            $scope.calculator.brands = brands;
                        }
                    );
            }
        };

         $scope.updateModels = function(models,prisgruppeId){
             console.log('UpdateModels called');
             console.log(models);
             console.log(prisgruppeId);
            angular.forEach(models, function(model,key){
                model.prisgruppeId = prisgruppeId;
            });
        };

        //Functions for ui-tree

        //this function renders models only when the brand is toggled for quicker rendering
        $scope.renderModels = function(scope){
            //getting top position of the clicked element
            var clickedEl = angular.element('#'+scope.$modelValue.id);
            var clickedElpos = clickedEl.position();
            var infobox = angular.element('#info_box');
            //setting scope variable to place infobox where element clicked
            $scope.clickedElTopPos = (clickedElpos.top - (infobox.height()/2)) + 25 +'px';

            //if loadmodels not the same as the clicked brand id
            if($scope.loadmodels !== scope.$modelValue.id) {
                // first collapse all
                $scope.$broadcast('angular-ui-tree:collapse-all');
                //then toggle the clicked element open
                scope.toggle();
                //finally Set the loadmodels so the models can be rendered
                $scope.loadmodels = scope.$modelValue.id;

            }
            // else just toggle the clicked element to close
            else{
                scope.toggle();
            }
        };

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
                id: 'id' + (new Date()).getTime(),
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
        };

        //function for updating existing calculator in database
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
        //function for creating new calculator in database
        function createCalculator(){
            calculatorService.createCalculator($scope.calculator)
                .then(function(result){
                    messageCenterService.add("success", "Prisberegneren er blevet oprettet", {status: messageCenterService.status.next});
                    $location.path('/dashboard');
                    //$scope.calculator = result;
                },function(result){
                    messageCenterService.add('danger', result.message)
                });
        }

        //style templates
        $scope.styles = {
            light:{
                type:'light',
                backgroundColor:'#ffffff',
                textColor:'#333333',
                buttonColor:'#337ab7',
                buttonTextColor:'#ffffff'
            },
            dark:{
                type:'dark',
                backgroundColor:'#000000',
                textColor:'#f2f2f2',
                buttonColor:'#bd2c2c',
                buttonTextColor:'#ffffff'
            },
            grey:{
                type:'grey',
                backgroundColor:'#f5f5f5',
                textColor:'#333333',
                buttonColor:'#8c8c8c',
                buttonTextColor:'#ffffff'
            },
            custom:{
                type:'custom'
            }

        };
        $scope.ensureStyleSwitch = function(style){
            if($scope.calculator.settings.style.type == 'custom'){
                $scope.calculator.settings.style.type = style;
            }
        };


    }
})();
