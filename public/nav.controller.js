(function(){
    angular
        .module("MDRAPI")
        .controller("navController",navController);
    function navController($scope,userService,$location,$rootScope,$http,messageCenterService){
        $scope.hello = "hi from navController";

        $scope.Logout = Logout;
        $scope.$location = $location;

        function Logout() {
            $http.get('/api/logout')
                .success(function () {
                    $rootScope.currentUser = null;
                    messageCenterService.add('success', 'Du er nu logget ud', {status: messageCenterService.status.next})
                    $location.path('/');
                });
        }

    }
})();
