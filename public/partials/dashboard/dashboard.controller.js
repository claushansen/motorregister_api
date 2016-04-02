(function(){
    angular
        .module("BILAPI")
        .controller("DashboardController",DashboardController);
    //getting brands and models;
    function DashboardController($scope,$http,calculatorService,messageCenterService){

        getMyCalcs();

        $scope.copyCalc = copyCalc;
        $scope.removeCalc = removeCalc;
        //TODO - create embed scripts modalfunction
        $scope.openEmbedModal = function(){

        }

        function copyCalc(scope){
            calculatorService.copyCalculator(scope.calculator._id)
                .then(function success(calc){
                    messageCenterService.add('success', 'Prisberegneren er blevet kopieret', { timeout: 5000 });
                    getMyCalcs();
                },function error(message){
                    messageCenterService.add('danger', message);
                });
        }

        function removeCalc(scope){
            //console.log(scope);
            if (confirm("Er du sikker på at du vil slette denne prisberegner")) {
                calculatorService.removeCalculator(scope.calculator._id)
                    .then(function success(message) {
                        messageCenterService.add('success', 'Prisberegneren er blevet slettet', {timeout: 5000});
                        getMyCalcs();
                    }, function error(message) {
                        messageCenterService.add('danger', message);
                    });
            }
        }

        function getMyCalcs(){
            calculatorService.getMyCalculators()
                .then(function success(calcs){
                    $scope.calculators = calcs;
                },function error(message){
                    messageCenterService.add('danger', message);
                });
        }

        //$scope.calculators = calculatorService.getAllCalculators();

    }
})();
