(function(){
    angular
        .module("BILAPI")
        .controller("RegisterController",RegisterController);
    function RegisterController($scope , userService ,$location,  messageCenterService){




        $scope.register = function () {

            userService.registerUser($scope.user)
                .then(function(result){
                    messageCenterService.add("success", "Du er nu oprettet som bruger og vi har sendt en mail med dit brugernavn og password " , {status: messageCenterService.status.next});
                    $location.path('/login');
                },function(result){
                    messageCenterService.add('danger', result.message, { timeout: 5000 });
                });
        }
    }
})();
