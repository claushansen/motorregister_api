(function () {
    'use strict';

    angular
        .module('MDRAPI')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', '$rootScope', '$timeout','$q'];
    function AuthService($http,$rootScope,$timeout,$q) {
        var service = {};

        service.Login = Login;
        service.Logout = Logout;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.checkLoggedin = checkLoggedin;

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

        function checkLoggedin ($q, $timeout, $http, $location, $rootScope)
        {
            var deferred = $q.defer();

            $http.get('/api/loggedin').success(function(user)
            {
                $rootScope.errorMessage = null;
                // User is Authenticated
                if (user !== '0')
                {
                    $rootScope.currentUser = user;
                    deferred.resolve();
                }
                // User is Not Authenticated
                else
                {
                    $rootScope.errorMessage = 'You need to log in.';
                    deferred.reject();
                    $location.url('/login');
                }
            });

            return deferred.promise;
        }


    }


})();