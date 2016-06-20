(function() {
    'use strict';

    var serviceName = 'FileUploadModel';

    var serviceCtrl = [
        'FileUploadService', 'FileUploader', 'Notification',
        function (fileUploadService, fileUploader, notification) {

            var model = {
                uploader: new fileUploader({
                    url: '/api/FileUpload/PriceBookParts/Upload'
                }),
                priceBookUploadList: [],
                selectedEntry: {},
                postData:{},
                params: {
                    filterText: '',
                    pageIndex: 1,
                    pageSize: 20,
                    fileUploadId: 0,
                    totalCount: 0,
                    totalPages: 1,
                    invalidOnly: false
                }
            };


            model.uploader.filters.push({
                name: 'fileTypeFilter',
                fn: function (item, options) {
                    var type = item.name.slice(item.name.lastIndexOf('.') + 1);
                    if ('xlsx' !== type) {
                        notification.error('Excel files only');
                    }

                    return 'xlsx' === type;
                }
            });

            model.uploader.onBeforeUploadItem = function (item) {
                model.postData.manufacturerName = model.postData.manufacturer.name;
                item.formData.push(model.postData);
            };

            model.uploader.onCompleteItem = function (fileItem, response, status, headers) {
                model.params.fileUploadId = response.id;
                model.params.totalCount = response.totalRecords;
                model.findUploadList();
                model.uploader.clearQueue();
            };

            model.update = function() {
                return fileUploadService.update(model.selectedEntry).then(function(response) {
                    model.selectedEntry = response;
                });
            };

            //model.loadFileUploadList = function () {
            //    return fileUploadService.loadFileUploadList(model.postData.id).then(function (response) {
            //        model.priceBookUploadList = response.data;
            //        model.params.totalCount = response.totalCount;
            //    });
            //};

            model.findUploadList = function () {
                model.priceBookUploadList = [];
                model.params.priceBookId = model.postData.id;

                fileUploadService.findUploadList(model.params).then(function (response) {
                    model.priceBookUploadList = response.data;
                    model.params.totalPages = response.totalPages;
                    model.params.totalCount = response.totalCount;
                });
            };

            model.savePriceBookParts = function(pricebookId) {
                return fileUploadService.savePriceBookParts(pricebookId).then(function(response) {
                    model.priceBookUploadList = [];
                });
            };

            model.listPageIndex = function() {
                return (model.params.pageIndex - 1) * model.params.pageSize;
            };

            model.removeUpload = function(pricebookId) {
                return fileUploadService.removeUpload(pricebookId).then(function(response) {
                    model.priceBookUploadList = [];
                });
            };

            return model;
        }
    ];

    angular.module('app').service(serviceName, serviceCtrl);
})();