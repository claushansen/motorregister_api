(function(){
angular.module('MDRAPI').controller('ModalAdminUserEditCtrl', function ($scope, $uibModalInstance, user, userService) {
    delete user.password;
    $scope.user = user;
    if(user._id){
        $scope.modaltitle = 'Opdater Bruger';
    }else{
        $scope.modaltitle = 'Opret Ny Bruger';
    }


    $scope.save = function () {
        $scope.passwordchanged = false;
        if($scope.form.password.$dirty){
            $scope.user.password = $scope.password;
            $scope.passwordchanged = true;
        }
        userService.updateUser(user)
            .then(function(result){
                $uibModalInstance.close(result);
            },function(result){
                $scope.errorMessage = result.message;
            })
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
})();