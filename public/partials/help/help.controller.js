(function(){
    angular
        .module("BILAPI")
        .controller("HelpController",HelpController);
    function HelpController($scope){
        $scope.hello = "hi from HelpController";
    }
})();
