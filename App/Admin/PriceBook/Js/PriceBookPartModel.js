(function () {
    'use strict';

    var serviceName = 'PriceBookPartModel';

    var serviceCtrl = ['PriceBookPartApiService', function (priceBookPartApiService) {

        var model = {
            params: {
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0
            },
            partExistsInPriceBook: false,
            priceBookExistsInPart: false,
            priceBookPartList: []
        };

        model.loadListByPriceBookId = function (priceBookId) {
            priceBookPartApiService.loadListByPriceBookId(priceBookId).then(function (response) {
                model.priceBookPartList = response.data;
                model.params.totalCount = response.totalCount;
            });
        };

        model.loadListByPartId = function (partId) {
            model.priceBookPartList = [];
            priceBookPartApiService.loadPriceBookList(partId).then(function (response) {
                model.priceBookPartList = response.data;
                model.params.totalCount = response.totalCount;
            });
        };

        model.saveAll = function () {
            return priceBookPartApiService.saveAll(model.priceBookPartList).then(function (response) {
            });
        };

        model.assignPartIdForPriceBooks = function (partId) {
            angular.forEach(model.priceBookPartList, function (priceBook) {
                priceBook.partId = partId;
            });
        };

        model.partExists = function (item) {
            for (var i = 0; i < model.priceBookPartList.length; i++) {
                if (model.priceBookPartList[i].partId === item.id) {
                    model.partExistsInPriceBook = true;
                    return true;
                }
            }
            model.partExistsInPriceBook = false;

            return false;
        };

        model.priceBookExists = function (item) {
            for (var i = 0; i < model.priceBookPartList.length; i++) {
                if (model.priceBookPartList[i].pricebookId === item.id) {
                    model.priceBookExistsInPart = true;
                    return true;
                }
            }
            model.priceBookExistsInPart = false;

            return false;
        };

        model.resetPriceBookPart = function () {
            model.priceBookPartList = [];
        };

        return model;
    }
    ];

    angular.module('app').service(serviceName, serviceCtrl);
})();