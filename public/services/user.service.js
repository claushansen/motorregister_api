(function () {
    'use strict';

    angular
        .module('BILAPI')
        .factory('userService', userService);

    userService.$inject = ['$http', '$rootScope', '$timeout','$q' ,'appConfig'];
    function userService($http,$rootScope,$timeout,$q,appConfig) {
        var service = {};

        service.Login = Login;
        service.Logout = Logout;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.getAllUsers = getAllUsers;
        service.updateUser = updateUser;
        service.createUser = createUser;
        service.registerUser = registerUser;
        service.checkLoggedin = checkLoggedin;

        return service;

        function Login(username, password, callback) {
            $http.post(appConfig.apiPath+'/api/login', { username: username, password: password })
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
            $http.get(appConfig.apiPath+'/api/logout')
                .success(function (response) {
                    ClearCredentials();
                    callback(response);
                });
        }

        function SetCredentials(user) {
           $rootScope.currentUser =  user;
            if(user.roles.indexOf('admin') > -1 ){
                $rootScope.currentUser.isadmin = true;
            }
        }

        function ClearCredentials() {
            $rootScope.currentUser = null;
        }

        function getAllUsers(){
            var deferred = $q.defer();

            $http.get(appConfig.apiPath+'/api/user')
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
            $http.put(appConfig.apiPath+'/api/user/'+user._id,user)
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
            $http.post(appConfig.apiPath+'/api/user',user)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data);
                    }else{
                        deferred.reject(data);
                    }
                });

            return deferred.promise;

        }

        function registerUser(user){

            var deferred = $q.defer();
            $http.post(appConfig.apiPath+'/api/register',user)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data);
                    }else{
                        deferred.reject(data);
                    }
                });

            return deferred.promise;

        }

        function checkLoggedin()
        {
            var deferred = $q.defer();

            $http.get(appConfig.apiPath+'/api/loggedin').success(function(user)
            {
                // User is Authenticated
                if (user !== '0')
                {
                    $rootScope.currentUser = user;
                    if(user.roles.indexOf('admin') > -1 ){
                        $rootScope.currentUser.isadmin = true;
                    }
                    deferred.resolve();
                }
                // User is Not Authenticated
                else
                {
                    deferred.reject();
                }
            });

            return deferred.promise;
        }


    }


})();