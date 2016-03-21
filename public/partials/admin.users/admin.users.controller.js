(function(){
    angular
        .module("MDRAPI")
        .controller("AdminUsersController",AdminUsersController);
    function AdminUsersController($scope,$http,$uibModal,userService,$rootScope){

        getUsers();
        $scope.Message = {};

        $scope.removeUser = removeUser;


        //function getUsers(){
        //    $http.get('/api/user')
        //        .success(function (data) {
        //            $scope.users = data.users;
        //        });
        //}

        function getUsers(){
            userService.getAllUsers()
                .then(function success(users){
                    $scope.users = users;
                },function error(message){
                    $rootScope.errorMessage = message;
                });
        }



        function removeUser(user){
            if (confirm("Are you sure")) {
                $http.delete('/api/user/' + user._id)
                    .success(function (result) {
                        if (result.success) {
                            getUsers();
                        }
                        $scope.message = result.message;
                    });
            }
        }

        $scope.edit = function (user) {

            var modalEditUser = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'partials/admin.users/modal/modal.user.edit.html',
                controller: 'ModalAdminUserEditCtrl',
                //size: 'lg',
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });

            modalEditUser.result.then(function (result) {
                if(result.success)
                {
                    $scope.Message.type = 'success';
                }
                else
                {
                    $scope.Message.type = 'danger';
                }
                $scope.Message.message = result.message;
                getUsers();
            }, function () {
                //reloading users if any change made in the form that reflects here
                getUsers();
                $scope.Message.message = 'Handlingen blev afbrudt';
                $scope.Message.type = 'warning';
            });
        };

        $scope.newUser = function (user) {

            var modalNewUser = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'partials/admin.users/modal/modal.user.new.html',
                controller: 'ModalAdminUserNewCtrl',
                //size: 'lg',
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });

            modalNewUser.result.then(function (result) {
                $scope.returnuser = result;
                if(result.success)
                {
                    $scope.Message.type = 'success';
                }
                else
                {
                    $scope.Message.type = 'danger';
                }
                $scope.Message.message = result.message;
                getUsers();
            }, function () {
                //reloading users if any change made in the form that reflects here
                getUsers();
                $scope.Message.message = 'Handlingen blev afbrudt';
                $scope.Message.type = 'warning';
            });
        };

    }

})();
