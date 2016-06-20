(function() {
    'use strict';

    var serviceName = 'PartApiService';

    var serviceCtrl = [
        '$http', '$q', function($http, $q) {
            var service = {};

            
           service.createPart = function(part) {
               var url = '~/api/Parts/Create';
               return service.savePart(part, url);
           };

            service.updatePart = function(part) {
                var url = '~/api/Parts/Update';
                return service.savePart(part, url);
            };

            service.deletePart = function (part) {
                var url = '~/api/Parts/Delete';
                return service.savePart(part, url);
            }

           service.savePart = function (part, url) {
               var deffered = $q.defer();
               $http.post(url, part).then(function (response) {
                   deffered.resolve(response.data);
               });

               return deffered.promise;
           };

           service.getByModelAndManufacturer = function (params) {
                var deffered = $q.defer();
                var url = '~/api/Parts/GetByModelAndManufacturer';

                $http.get(url, { params }).then(function(response) {
                    deffered.resolve(response.data);
                }, function(reason) {
                    deffered.reject(reason);
                });

                return deffered.promise;
            };

            service.loadPart = function(partId) {
                var deffered = $q.defer();
                var url = '~/api/Parts/' + partId;

                $http.get(url, partId).then(function(response) {
                    deffered.resolve(response.data);
                }, function(reason) {
                    deffered.reject(reason);
                });

                return deffered.promise;
            };

            service.LoadPartsList = function (params) {
                var deffered = $q.defer();
                var url = '~/api/Parts/Find';

                $http.get(url, { params }).then(function (response) {
                    deffered.resolve(response.data);
                }, function (reason) {
                    deffered.reject(reason);
                });

                return deffered.promise;
            };


            return service;
        }
    ];

    angular.module('app').service(serviceName, serviceCtrl);
})();