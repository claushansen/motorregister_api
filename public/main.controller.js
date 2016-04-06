(function(){
    angular
        .module("BILAPI")
        .controller("mainController",mainController);
    function mainController($scope,userService,$location,$window,$rootScope,$http,messageCenterService,$uibModal){

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

        $scope.editProfile = function () {

            var modalEditProfile = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'partials/profile/modal/modal.profile.edit.html',
                controller: 'ModalProfileEditCtrl'
                //size: 'lg',
                //parsing currentUser to modal controller
                //resolve: {
                //    user: function () {
                //        return  $rootScope.currentUser;
                //    }
                //}
            });

            modalEditProfile.result.then(function (result) {
                messageCenterService.add('success', result.message, { timeout: 5000 });
            }, function () {
                //if user pressed cansel
                messageCenterService.add('warning', 'Handlingen blev afbrudt', { timeout: 5000 });
            });
        };

    }


})();
