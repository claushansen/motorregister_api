(function(){
angular.module('MDRAPI').controller('ModalAdminUserNewCtrl', function ($scope, $uibModalInstance, user, userService,messageCenterService) {

    $scope.user = user;
    $scope.modaltitle = 'Opret Ny Bruger';



    $scope.save = function () {

        //$uibModalInstance.close(user);

        userService.createUser(user)
            .then(function(result){
                $uibModalInstance.close(result);
            },function(result){
                messageCenterService.add('danger', result.message, { timeout: 5000 });
            });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
})();