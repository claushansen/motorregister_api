(function(){
    angular
        .module("BILAPI")
        .controller("HomeController",HomeController);
    function HomeController($scope){
        $scope.hello = "hi from HomeController";
    }
})();
