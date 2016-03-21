(function(){
    angular
        .module("MDRAPI")
        .controller("ProfileController",ProfileController);
    function ProfileController($scope){
        $scope.hello = "hi from ProfileController";
    }
})();
