(function(){
    angular
        .module("BILAPI")
        .controller("mainController",mainController);
    function mainController($scope,userService,$location,$rootScope,$http,messageCenterService){

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
