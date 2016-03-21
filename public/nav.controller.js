(function(){
    angular
        .module("MDRAPI")
        .controller("navController",navController);
    function navController($scope,userService,$location,$rootScope,$http){
        $scope.hello = "hi from navController";

        $scope.Logout = Logout;
        $scope.$location = $location;

        function Logout() {
            $http.get('/api/logout')
                .success(function () {
                    $rootScope.currentUser = null;
                    $rootScope.successMessage = 'You are now logged out';
                    $location.path('/');
                });
        }




    }
})();
