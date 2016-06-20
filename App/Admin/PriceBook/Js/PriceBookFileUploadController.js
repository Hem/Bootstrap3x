(function () {
    'use strict';

    var module = 'app';
    var controllerName = 'PriceBookFileUploadController';

    var ctrl = ['$scope', '$state', 'Notification', 'FileUploadModel', 'ArrayHelper', 'IpgDialog',
        function ($scope, $state, notification, fileUploadModel, arrayHelper, ipgDialog) {

            var self = $scope;
            self.state = $state;
            self.isCollapsed = true;
            self.arrayHelper = arrayHelper;
            self.uploadModel = fileUploadModel;
            
            self.OnEditClick = function (item) {
                item.editMode = true;
            };

            //self.onBack = function() {
            //    window.history.back();
            //};

            self.OnSaveItemClick = function (item) {
                if (self.model.selectedPriceBook.discountPercent > 0)
                    item.discountPrice = item.unitPrice - (item.unitPrice * self.model.selectedPriceBook.discountPercent / 100);
                self.uploadModel.selectedEntry = item;
                self.uploadModel.update().then(function () {
                    item.partId = self.uploadModel.selectedEntry.partId;
                    item.partName = self.uploadModel.selectedEntry.partName;
                    item.action = self.uploadModel.selectedEntry.action;
                    item.reason = self.uploadModel.selectedEntry.reason;
                    item.editMode = false;
                    item.valid = self.uploadModel.selectedEntry.valid;
                });
                
            };

            self.onSubmit = function () {
                self.uploadModel.savePriceBookParts(self.state.params.id).then(function () {
                    notification.success("Successfully Uploaded file data.");
                    self.state.go('PriceBook.Detail.Parts', { id: self.state.params.id });
                });
                
            };

            self.$watch('uploadModel.params.pageSize', function () {
                self.uploadModel.findUploadList();
            });

            self.onDelete = function(item) {
                self.uploadModel.selectedEntry = item;
                self.uploadModel.selectedEntry.deleted = 1;

                self.uploadModel.update().then(function() {
                    notification.success("Successfully deleted entry.");
                    angular.forEach(self.uploadModel.priceBookUploadList, function (value, index) {
                        if (value.id === item.id) {
                            self.uploadModel.priceBookUploadList.splice(index, 1);
                        }
                    });
                });
            };

            self.onCancelUpload = function () {
                self.uploadModel.removeUpload(self.state.params.id).then(function () {
                    notification.warning("Upload data has been removed.");
                    self.state.reload('PriceBook.Detail.FileUpload');
                });
            };

            var initialize = function () {
                self.model.loadPriceBook(self.state.params.id).then(function () {
                    self.uploadModel.postData = self.model.selectedPriceBook;
                    self.uploadModel.findUploadList();
                });
                
            };

            initialize();

        }
    ];

    angular
        .module(module)
        .controller(controllerName, ctrl);

})();


