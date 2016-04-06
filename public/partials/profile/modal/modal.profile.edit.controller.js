(function(){
angular.module('BILAPI').controller('ModalProfileEditCtrl', function ($scope, $uibModalInstance,$rootScope ,userService,messageCenterService,$location) {

    var user = {};
    user._id = $rootScope.currentUser._id;
    user.username = $rootScope.currentUser.username;
    user.firstName = $rootScope.currentUser.firstName;
    user.lastName = $rootScope.currentUser.lastName;
    user.email = $rootScope.currentUser.email;

    $scope.user = user;



    if(user._id){
        $scope.modaltitle = 'Opdater Din Profil';
    }else{
        $scope.modaltitle = 'Ingen brugerprofil';
    }


    $scope.save = function () {
        $scope.passwordchanged = false;
        if($scope.form.password.$dirty){
            $scope.user.password = $scope.password;
            $scope.passwordchanged = true;
        }
        userService.updateUser(user)
            .then(function(result){
                //Using userservice.checkLoggedin to update currentUser
                userService.checkLoggedin()
                    .then(function(){
                        $uibModalInstance.close(result);
                    });
            },function(result){
                messageCenterService.add('danger', result.message, { timeout: 5000 });
            })
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
})();