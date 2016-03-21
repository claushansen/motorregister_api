(function () {
    'use strict';

    angular
        .module('MDRAPI')
        .factory('userService', userService);

    userService.$inject = ['$http', '$rootScope', '$timeout','$q'];
    function userService($http,$rootScope,$timeout,$q) {
        var service = {};

        service.Login = Login;
        service.Logout = Logout;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.getAllUsers = getAllUsers;
        service.updateUser = updateUser;
        service.createUser = createUser;

        return service;

        function Login(username, password, callback) {
            $http.post('/api/login', { username: username, password: password })
                .success(function (response) {
                    callback(response);
                })
                .error(
                    function(){
                        callback({success:false,message:'Username or password are wrong'});
                    }
                );

        }

        function Logout(callback) {
            $http.get('/api/logout')
                .success(function (response) {
                    ClearCredentials();
                    callback(response);
                });
        }

        function SetCredentials(user) {
           $rootScope.currentUser =  user;
        }

        function ClearCredentials() {
            $rootScope.currentUser = null;
        }

        function getAllUsers(){
            var deferred = $q.defer();

            $http.get('/api/user')
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data.users);
                    }else{
                        deferred.reject(data.message);
                    }
                });

            return deferred.promise;

        }

        function updateUser(user){

            var deferred = $q.defer();
            $http.put('/api/user/'+user._id,user)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data);
                    }else{
                        deferred.reject(data);
                    }
                });

            return deferred.promise;

        }

        function createUser(user){

            var deferred = $q.defer();
            $http.post('/api/user',user)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data);
                    }else{
                        deferred.reject(data);
                    }
                });

            return deferred.promise;

        }


    }


})();