(function () {
    'use strict';

    var serviceName = 'FileUploadService';

    var serviceCtrl = [
        '$http', '$q', function ($http, $q) {
            var service = {};

            service.update = function (param) {
                var deffered = $q.defer();
                var url = '~/api/FileUpload/PriceBookParts/Update';

                $http.post(url, param).then(function (response) {
                    deffered.resolve(response.data);
                }, function (reason) {
                    deffered.reject(reason);
                });

                return deffered.promise;
            };

            service.savePriceBookParts = function (pricebookId) {
                var url = "~/api/FileUpload/PriceBookParts/Save/" + pricebookId;
                var deffered = $q.defer();

                $http.post(url).then(function (response) {
                    deffered.resolve(response.data);
                }, function (reason) {
                    deffered.reject(reason);
                });

                return deffered.promise;
            };

            //service.loadFileUploadList = function (priceBookId) {
            //    var url = "~/api/FileUpload/priceBookParts/entries/" + priceBookId;
            //    var deffered = $q.defer();
            //    $http.post(url).success(function (response) {
            //        deffered.resolve(response);
            //    }).error(function (reason) {
            //        deffered.reject(reason);
            //    });
            //    return deffered.promise;
            //};

            service.findUploadList = function(params) {
                var url = "~/api/FileUpload/PricebookParts/Find";
                var deffered = $q.defer();

                $http.post(url, params).success(function(response) {
                    deffered.resolve(response);
                }).error(function(reason) {
                    deffered.reject(reason);
                });

                return deffered.promise;

            };

            service.removeUpload = function(pricebookId) {
                var url = "~/api/FileUpload/PriceBookParts/DeleteAll/" + pricebookId;
                var deffered = $q.defer();

                $http.post(url).then(function(response) {
                    deffered.resolve(response.data);
                }, function(reason) {
                    deffered.reject(reason);
                });

                return deffered.promise;
            };


            return service;
        }
    ];

    angular.module('app').service(serviceName, serviceCtrl);
})();