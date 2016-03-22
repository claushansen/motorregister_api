(function(){
    angular
        .module("MDRAPI")
        .controller("RegisterController",RegisterController);
    function RegisterController($scope , userService ,$location,  messageCenterService){




        $scope.register = function () {

            userService.registerUser($scope.user)
                .then(function(result){
                    messageCenterService.add("success", "Velkommen til MDRAPI "+ result.user.firstName , {status: messageCenterService.status.next});
                    $location.path('/dashboard');
                },function(result){
                    messageCenterService.add('danger', result.message, { timeout: 5000 });
                });
        }
    }
})();
