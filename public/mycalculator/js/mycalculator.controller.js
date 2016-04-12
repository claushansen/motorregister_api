(function(){
    angular
        .module("mycalculator")
        .controller("MyCalculatorController",MyCalculatorController);

    function MyCalculatorController($scope,$http,$routeParams, mycalculatorService ,messageCenterService){

        //get settings on init
        getCalcSettings();

        $scope.manualSearch = false;

        $scope.setManual = function(){
            $scope.manualSearch = !$scope.manualSearch;
        };

        //resetting everything = start a new calculation
        $scope.reset = function(){
            $scope.manualSearch = false;
            $scope.search = null;
            $scope.offer = null;
            $scope.models = null;

        };

        //Get offer from calculator based on licensplate typed in
        $scope.findOfferLicensplate = function() {
            var calcid = $routeParams.calcid;
            $scope.search.licensplate = $scope.search.licensplate.toUpperCase();
            $scope.offerloading = true;
            mycalculatorService.getOfferLicensplate(calcid,$scope.search.licensplate)
                .then(function success(offer){
                    $scope.offer = offer;
                    $scope.offerloading = false;
                },function error(message){
                    $scope.offerloading = false;
                    messageCenterService.add('danger', message);
                });
        };

        //Get offer from calculator based on the selected brand/model
        $scope.findOfferManual = function() {
            if($scope.search.model) {
                var calcid = $routeParams.calcid;
                var modelid = $scope.search.model.id;
                $scope.offerloading = true;
                mycalculatorService.getOfferModel(calcid,modelid)
                    .then(function success(offer){
                        $scope.offer = offer;
                        $scope.offerloading = false;
                    },function error(message){
                        $scope.offerloading = false;
                        messageCenterService.add('danger', message);
                    });
            }
        };

        //get brands list for select
        $scope.getBrands = function() {
            if(!$scope.brands) {
                var calcid = $routeParams.calcid;
                $scope.brandsloading = true;
                mycalculatorService.getBrandsList(calcid)
                    .then(function success(list){
                        $scope.brands = list;
                        $scope.brandsloading = false;
                    },function error(message){
                        $scope.brandsloading = false;
                        messageCenterService.add('danger', message);
                    });
            }
        };

        //get models list for select based on selected brand
        $scope.getModels = function() {
            if($scope.search.brand.id) {
                var calcid = $routeParams.calcid;
                var brandid = $scope.search.brand.id;
                $scope.modelsloading = true;
                mycalculatorService.getModelsList(calcid,brandid)
                    .then(function success(list){
                        $scope.models = list;
                        $scope.modelsloading = false;
                    },function error(message){
                        $scope.modelsloading = false;
                        messageCenterService.add('danger', message);
                    });
            }
        };

        //getting the calculator settings
        function getCalcSettings(){
            var calcid = $routeParams.calcid;
            $scope.settingsloading = true;
            mycalculatorService.getSettings(calcid)
                .then(function success(settings){
                    $scope.settings = settings;
                    $scope.settingsloading = false;
                },function error(message){
                    $scope.settingsloading = false;
                    messageCenterService.add('danger', message);
                });

        }

        //sending message and data to calculator owner
         $scope.sendContact = function(){
            var contactObj = {};
            contactObj.name = $scope.contact.name;
            contactObj.email = $scope.contact.email;
            contactObj.phone = $scope.contact.phone;
            contactObj.message = $scope.contact.message;
            contactObj.offer = $scope.offer;
            if($scope.manualSearch){
                contactObj.search = $scope.search;
            }
            var calcid = $routeParams.calcid;
            $scope.sendmsgloading = true;
            mycalculatorService.sendMessage(calcid,contactObj)
                .then(function success(message){
                    messageCenterService.add('success', message);
                    $scope.sendmsgloading = false;
                },function error(message){
                    $scope.sendmsgloading = false;
                    messageCenterService.add('danger', message);
                });

        }

    }
})();
