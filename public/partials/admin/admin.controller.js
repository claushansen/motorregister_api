(function(){
    angular
        .module("BILAPI")
        .controller("AdminController",AdminController);
    function AdminController($scope){
        $scope.hello = "hi from adminController";
    }
})();
