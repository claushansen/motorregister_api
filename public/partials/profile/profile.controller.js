(function(){
    angular
        .module("BILAPI")
        .controller("ProfileController",ProfileController);
    function ProfileController($scope){
        $scope.hello = "hi from ProfileController";
    }
})();
