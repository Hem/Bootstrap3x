(function() {
    'use strict';

    var serviceName = 'PriceBookPartApiService';

    var service = [
        '$http', '$q', function ($http, $q) {

            var service = {};

            service.loadListByPriceBookId = function (priceBooId) {
                var deffered = $q.defer();
                var url = '~/api/PriceBookPart/' + priceBooId + '/Parts';

                $http.get(url).then(function (response) {
                    deffered.resolve(response.data);
                }, function (reason) {
                    deffered.reject(reason);
                });

                return deffered.promise;
            };

            service.loadPriceBookList = function(partId) {
                var deffered = $q.defer();
                var url = '~/api/PriceBookPart/' + partId + '/PriceBooks';

                $http.get(url).then(function(response) {
                    deffered.resolve(response.data);
                }, function(reason) {
                    deffered.reject(reason);
                });

                return deffered.promise;
            };

            service.saveAll = function (list) {
                var url = '~/api/PriceBookPart/BulkUpdate';
                var deffered = $q.defer();

                $http.post(url, list).then(function (response) {
                    deffered.resolve(response.data);
                });

                return deffered.promise;
            };

            return service;
        }
    ];

    angular.module('app').service(serviceName, service);
})();