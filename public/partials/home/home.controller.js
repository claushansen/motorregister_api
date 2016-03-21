(function(){
    angular
        .module("MDRAPI")
        .controller("HomeController",HomeController);
    function HomeController($scope){
        $scope.hello = "hi from HomeController";
    }
})();
