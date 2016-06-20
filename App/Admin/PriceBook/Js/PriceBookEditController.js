(function () {

    'use strict';

    var module = 'app';
    var controllerName = 'PriceBookEditController';

    var ctrl = ['$scope', '$state', 'Notification', 'IpgDialog', 'PriceBookPartModel',
        function ($scope, $state, notification, ipgDialog, priceBookPartModel) {

            var self = $scope;
            self.state = $state;
            self.priceBookPartModel = priceBookPartModel;

            var saveChanges = function () {
                self.model.updatePriceBook().then(function () {
                    notification.success("Successfully Updated Price Book.");
                    self.model.loadPriceBook(self.state.params.id);
                    self.ipgVariables.hasUnsavedData = false;
                    self.state.go('PriceBook.Detail.View', { id: self.state.params.id });
                });
            };

            self.onSave = function () {

                if (self.priceBookForm.discountPercent.$dirty) {
                    if (self.priceBookPartModel.priceBookPartList.length) {
                        var title = 'All parts associated with this Price Book will be recalculated with the new Discount %';
                        var message = 'Click YES to confirm; Click NO to reset';

                        ipgDialog.showConfirm(title, message).then(function () {
                            saveChanges();
                        }, function () {
                            self.model.loadPriceBook(self.state.params.id);
                            self.priceBookForm.$setPristine();
                            self.ipgVariables.hasUnsavedData = false;
                        });
                    } else {
                        saveChanges();
                    }

                } else {
                    saveChanges();
                }

            };

            //self.onBack = function () {
            //    window.history.back();
            //};

            self.reset = function () {
                self.model.loadPriceBook(self.state.params.id);
                self.ipgVariables.hasUnsavedData = false;
                self.priceBookForm.$setPristine();
                self.state.reload('PriceBook.Detail.Edit');
            };

            var initialize = function () {
                self.model.loadPriceBook(self.state.params.id);
                self.priceBookPartModel.loadListByPriceBookId(self.state.params.id);
            };

            initialize();

        }
    ];

    angular
        .module(module)
        .controller(controllerName, ctrl);




})();