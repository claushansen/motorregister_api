(function () {
    'use strict';

    angular
        .module('MDRAPI')
        .factory('calculatorService', calculatorService);

    calculatorService.$inject = ['$http', '$rootScope', '$timeout','$q' ,'appConfig'];
    function calculatorService($http,$rootScope,$timeout,$q,appConfig) {
        var service = {};

        //service.Login = Login;
        //service.Logout = Logout;
        //service.SetCredentials = SetCredentials;
        //service.ClearCredentials = ClearCredentials;
        service.getMyCalculators = getMyCalculators;
        service.getCalculator = getCalculator;
        service.updateCalculator = updateCalculator;
        service.createCalculator = createCalculator;
        service.copyCalculator = copyCalculator;
        service.removeCalculator = removeCalculator;
        //service.createUser = createUser;
        //service.registerUser = registerUser;

        return service;


        function getMyCalculators(){
            var deferred = $q.defer();

            $http.get(appConfig.apiPath+'/api/calculator/'+$rootScope.currentUser._id)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data.items);
                    }else{
                        deferred.reject(data.message);
                    }
                });

            return deferred.promise;

        }
        function getCalculator(calcid){
            var deferred = $q.defer();

            $http.get(appConfig.apiPath+'/api/'+$rootScope.currentUser._id+'/calculator/'+calcid)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data.item);
                    }else{
                        deferred.reject(data.message);
                    }
                });

            return deferred.promise;

        }

        function copyCalculator(calcid){
            var deferred = $q.defer();

            $http.get(appConfig.apiPath+'/api/'+$rootScope.currentUser._id+'/calculator/'+calcid+'/duplicate')
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data.item);
                    }else{
                        deferred.reject(data.message);
                    }
                });

            return deferred.promise;

        }


        //
        function updateCalculator(calculator){

            var deferred = $q.defer();
            $http.put(appConfig.apiPath+'/api/'+$rootScope.currentUser._id+'/calculator/'+calculator._id,calculator)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data);
                    }else{
                        deferred.reject(data);
                    }
                });

            return deferred.promise;

        }

        function createCalculator(calculator){

            var deferred = $q.defer();
            $http.post(appConfig.apiPath+'/api/'+$rootScope.currentUser._id+'/calculator',calculator)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data);
                    }else{
                        deferred.reject(data);
                    }
                });

            return deferred.promise;

        }
        // delete calculator
        // apiurl: DELETE /api/:userid/calculator/:id
        function removeCalculator(calcid){
            var deferred = $q.defer();
            $http.delete(appConfig.apiPath+'/api/'+$rootScope.currentUser._id+'/calculator/'+calcid)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data.message);
                    }else{
                        deferred.reject(data.message);
                    }
                });

            return deferred.promise;

        }


    }


})();