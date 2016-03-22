(function(){
    angular
        .module("MDRAPI")
        .controller("LoginController",LoginController);
    function LoginController($scope,userService,$location,$rootScope,messageCenterService){

        $scope.login = login;

            function login() {
            $scope.dataLoading = true;
            userService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    messageCenterService.add('success', 'Velkommen '+ response.user.firstName, {status: messageCenterService.status.next});
                    $scope.dataLoading = false;
                    userService.SetCredentials(response.user);
                    $location.path('/dashboard');
                } else {
                    messageCenterService.add('danger', response.message)
                    $scope.dataLoading = false;
                }
            });
        }
    }
})();
