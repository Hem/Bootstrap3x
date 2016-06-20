(function() {
    'use strict';

    var serviceName = 'PartModel';

    var serviceCtrl = [
        'PartApiService', function(partApiService) {
            var model = {
                params: {
                    pageSize: 20,
                    pageIndex: 1,
                    totalCount: 0,
                    totalPages: 1
                },
                dataLoadInProgress: false,
                hasUnsavedData: false,
                selectedPart: {},
                partExists: false,
                partsList: []
            };

            model.loadPart = function (partId) {

                return partApiService.loadPart(partId).then(function(response) {
                    model.selectedPart = response;
                });
            };

            model.createPart = function() {
                return partApiService.createPart(model.selectedPart).then(function (response) {
                    model.selectedPart = response;
                });
            };

            model.updatePart = function () {
                return partApiService.updatePart(model.selectedPart).then(function (response) {
                    model.selectedPart = response;
                });
            };

            model.deletePart = function() {
                return partApiService.deletePart(model.selectedPart).then(function (response) {
                    model.selectedPart = response;
                });
            };

            model.resetPart = function() {
                model.selectedPart = {};
                model.selectedPart.active = true;
            };


            model.getFormatPartSize = function() {
                if (model.selectedPart.size && model.selectedPart.size.measurement) {
                    if (model.selectedPart.size.volume && model.selectedPart.size.volume > 0 && angular.lowercase(model.selectedPart.size.measurement) === 'cc') {
                        return model.selectedPart.size.volume + angular.lowercase(model.selectedPart.size.measurement);
                    } else {
                        return model.selectedPart.size.length + angular.lowercase(model.selectedPart.size.measurement)
                            + ' X ' + model.selectedPart.size.width + angular.lowercase(model.selectedPart.size.measurement)
                            + ' X ' + model.selectedPart.size.height + angular.lowercase(model.selectedPart.size.measurement);
                    }
                }

                return '';
            };

            model.LoadPartsList = function () {
                model.partsList = [];
                model.dataLoadInProgress = true;

                partApiService.LoadPartsList(model.params)
                    .then(function (response) {
                        model.partsList = response.data;
                        model.params.totalCount = response.totalCount;
                        model.params.totalPages = response.totalPages;
                        model.dataLoadInProgress = false;
                    });
            };

            model.checkPartExist = function() {
                var param = {};
                model.partExists = false;
                param.partNumber = model.selectedPart.partNumber;
                param.manufacturerId = model.selectedPart.manufacturer.id;

                return partApiService.getByModelAndManufacturer(param).then(function(response) {
                    if (response) {
                        model.partExists = true;
                    }

                });

               
            };

            return model;
        }
    ];

    angular.module('app').service(serviceName, serviceCtrl);
})();