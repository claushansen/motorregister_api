(function(){
angular.module('BILAPI').controller('ModalAdminUserEditCtrl', function ($scope, $uibModalInstance, user, userService,messageCenterService) {
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
                messageCenterService.add('danger', result.message, { timeout: 5000 });
            })
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
})();