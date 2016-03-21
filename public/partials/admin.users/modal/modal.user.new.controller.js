(function(){
angular.module('MDRAPI').controller('ModalAdminUserNewCtrl', function ($scope, $uibModalInstance, user, userService) {

    $scope.user = user;
    $scope.modaltitle = 'Opret Ny Bruger';



    $scope.save = function () {

        //$uibModalInstance.close(user);

        userService.createUser(user)
            .then(function(result){
                $uibModalInstance.close(result);
            },function(result){
                $scope.errorMessage = result.message;
            });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
})();