(function () {
    'use strict';

    angular
        .module('mycalculator')
        .factory('mycalculatorService', mycalculatorService);

    mycalculatorService.$inject = ['$http', '$rootScope', '$timeout','$q' ,'appConfig'];
    function mycalculatorService($http,$rootScope,$timeout,$q,appConfig) {
        var service = {};

        service.getSettings = getSettings;
        service.getModelsList = getModelsList;
        service.getBrandsList = getBrandsList;
        service.getOfferLicensplate = getOfferLicensplate;
        service.getOfferModel = getOfferModel;
        service.sendMessage = sendMessage;


        return service;


        //service for getting mycalculator settings
        function getSettings(calcid){
            var deferred = $q.defer();
            $http.get(appConfig.apiPath+'/api/mycalculator/settings/'+calcid )
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data.settings);
                    }else{
                        deferred.reject(data.message);
                    }
                });
            return deferred.promise;
        }

        //service for getting list of brands included in calculator
        function getBrandsList(calcid){
            var deferred = $q.defer();
            $http.get(appConfig.apiPath+'/api/mycalculator/' + calcid + '/brands')
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data.brands);
                    }else{
                        deferred.reject(data.message);
                    }
                });
            return deferred.promise;
        }

        //service for getting list of models based on brand ID
        function getModelsList(calcid,brandid){
            var deferred = $q.defer();
            $http.get(appConfig.apiPath+'/api/mycalculator/' + calcid + '/models/'+brandid)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data.models);
                    }else{
                        deferred.reject(data.message);
                    }
                });
            return deferred.promise;
        }

        //service for getting offer based on licensplate
        //returns object i.e {success:true,hasoffer:true,offer:195}
        function getOfferLicensplate(calcid,licensplate){
            var deferred = $q.defer();
            $http.get(appConfig.apiPath+'/api/mycalculator/'+calcid+'/offer/licensplate/'+licensplate)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data);
                    }else{
                        deferred.reject(data.message);
                    }
                });
            return deferred.promise;
        }

        /**
         * service for getting offer based on model ID
         *
         * returns object i.e {success:true,hasoffer:true,offer:195}
         *
         * @param calcid String
         * @param modelid String
         * @returns {*|promise}
         */
        function getOfferModel(calcid,modelid){
            var deferred = $q.defer();
            $http.get(appConfig.apiPath+'/api/mycalculator/' + calcid + '/offer/model/' + modelid)
                .success(function (data) {
                    if(data.success){
                        deferred.resolve(data);
                    }else{
                        deferred.reject(data.message);
                    }
                });
            return deferred.promise;
        }


        /**
         *service for sending message to calculator owner
         *
         * @param calcid String
         * @param contactData Object
         * @returns {*|promise}
         */
        function sendMessage(calcid,contactData){
            var deferred = $q.defer();
            $http.post(appConfig.apiPath+'/api/mycalculator/' + calcid + '/contact',contactData)
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