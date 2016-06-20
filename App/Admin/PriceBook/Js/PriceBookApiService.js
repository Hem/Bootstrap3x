(function () {
    "use strict";

    var serviceName = 'PriceBookApiService';

    var serviceCtrl = ['$http', '$q',
       function ($http, $q) {

           var service = {};

           service.loadPriceBookList = function (params) {
               var deffered = $q.defer();
               var url = '~/api/PriceBook/Find';

               $http.get(url, { params }).then(function (response) {
                   deffered.resolve(response.data);
               });

               return deffered.promise;
           };

           service.loadPriceBook = function (id) {
               var deffered = $q.defer();
               var url = '~/api/PriceBook/' + id;
               $http.get(url).then(function (response) {
                    deffered.resolve(response);
               });

               return deffered.promise;
           };

           service.createPriceBook = function(priceBook) {
               var url = '~/api/PriceBook/Create';
               return service.savePart(priceBook, url);
           };

           service.updatePriceBook = function (priceBook) {
               var url = '~/api/PriceBook/Update';
               return service.savePart(priceBook, url);
           }

           service.savePart = function (priceBook, url) {
               var deffered = $q.defer();
               $http.post(url, priceBook).then(function (response) {
                   deffered.resolve(response.data);
               });

               return deffered.promise;
           };

           return service;
       }
    ];

    angular.module('app').service(serviceName, serviceCtrl);

})();


