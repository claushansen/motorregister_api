(function(){
    angular
        .module("MDRAPI")
        .controller("LoginController",LoginController);
    function LoginController($scope,userService,$location,$rootScope){
        $scope.hello = "hi from LoginController";

        $scope.login = login;

            function login() {
            $scope.dataLoading = true;
            userService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    $rootScope.errorMessage = null;
                    $scope.dataLoading = false;
                    userService.SetCredentials(response.user);
                    $location.path('/');
                } else {
                    $rootScope.errorMessage = response.message;
                    $scope.dataLoading = false;
                }
            });
        }
    }
})();
