(function(){
    angular
        .module("MDRAPI")
        .controller("AdminController",AdminController);
    function AdminController($scope){
        $scope.hello = "hi from adminController";
    }
})();
