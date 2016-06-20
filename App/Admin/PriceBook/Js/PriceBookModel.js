(function () {

    "use strict";

    var serviceName = 'PriceBookModel';

    var serviceCtrl = ['PriceBookApiService', 
        function (priceBookApiService) {

            var model = {
                params: {
                    pageIndex: 1,
                    pageSize: 15
                },
                priceBookList: [],
                selectedPriceBook: {}
            };

            model.loadPriceBookList = function () {
                model.priceBookList = [];

                priceBookApiService.loadPriceBookList(model.params)
                    .then(function(response) {
                        model.priceBookList = response.data;
                        model.params.totalCount = response.totalCount;
                        model.params.totalPages = response.totalPages;
                    });
            };

            model.createPriceBook = function() {
                return priceBookApiService.createPriceBook(model.selectedPriceBook).then(function (response) {
                    model.params.mfrName = response.manufacturer.name;
                    model.loadPriceBookList();
                    model.selectedPriceBook = response;
                });
            };

            model.updatePriceBook = function () {
                return priceBookApiService.updatePriceBook(model.selectedPriceBook).then(function (response) {
                    model.params.mfrName = response.manufacturer.name;
                    model.loadPriceBookList();
                    model.selectedPriceBook = response;
                });
            };

            model.loadPriceBook = function (id) {
                model.selectedPriceBook = {};

                return priceBookApiService.loadPriceBook(id)
                    .then(function(response) {
                        model.selectedPriceBook = response.data;
                    });
            };

            model.resetPriceBook = function() {
                model.selectedPriceBook = {};
            };

            model.getDiscountPrice = function(unitPrice) {
                return unitPrice - unitPrice * (model.selectedPriceBook.discountPercent / 100);
            };

            return model;
        }
    ];

    angular.module('app').service(serviceName, serviceCtrl);

})();