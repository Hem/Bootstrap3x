(function () {

    'use strict';

    var module = 'app';
    var controllerName = 'PriceBookPartsController';

    var ctrl = [
        '$scope', '$state', '$rootScope', 'PriceBookPartModel', 'Notification', 'ArrayHelper',
        function ($scope, $state, $rootScope, priceBookPartModel, notification, arrayHelper) {
            var self = $scope;
            self.state = $state;
            self.arrayHelper = arrayHelper;
            self.isCollapsed = true;
            self.priceBookPartModel = priceBookPartModel;

            var getTempPriceBookPart = function () {
                return {
                    partId: self.part.id,
                    pricebookId: self.model.selectedPriceBook.id,
                    unitPrice: self.unitPrice,
                    discountPrice: self.discountPrice,
                    part: self.part
                };
            };

            var clearInputPrices = function () {
                self.unitPrice = null;
                self.discountPrice = null;
                self.partForm.$setPristine();
            };

            self.onAddNew = function () {
                var priceBookPart = getTempPriceBookPart();
                priceBookPart.added = true;
                priceBookPart.modified = true;
                self.priceBookPartModel.priceBookPartList.splice(0, 0, priceBookPart);
                clearInputPrices();
                self.ipgVariables.hasUnsavedData = true;
                self.part = null;
                self.clearPartSelection = true;
            };

            self.sortBy = function (sortOrder) {
                self.priceBookPartModel.priceBookPartList = _.sortByOrder(self.priceBookPartModel.priceBookPartList, ['added', sortOrder], ['asc', 'asc']);
            };

            self.onSaveAll = function () {
                self.priceBookPartModel.saveAll().then(function () {
                    notification.success('Changes successfully Saved.');
                    self.priceBookPartModel.loadListByPriceBookId(self.state.params.id);
                    self.ipgVariables.hasUnsavedData = false;
                    self.state.go("PriceBook");
                });
            };

            self.onPartSelect = function (item) {
                clearInputPrices();
                if (!self.priceBookPartModel.partExists(item)) {
                    self.part = item;
                    self.unitPrice = item.unitPrice;
                    self.discountPrice = self.model.getDiscountPrice(item.unitPrice);
                }
            };

            self.onUnitPriceChange = function (priceBookPart) {
                priceBookPart.modified = true;
                self.ipgVariables.hasUnsavedData = true;
                priceBookPart.discountPrice = self.model.getDiscountPrice(priceBookPart.unitPrice);
            };

            self.onDiscountPriceChange = function (priceBookPart) {
                priceBookPart.modified = true;
                self.ipgVariables.hasUnsavedData = true;
            };

            self.onDelete = function (priceBookPart) {
                
                if (priceBookPart.added) {
                    var index = self.priceBookPartModel.priceBookPartList.indexOf(priceBookPart);
                    self.priceBookPartModel.priceBookPartList.splice(index, 1);
                } else {
                    priceBookPart.deleted = true;
                    priceBookPart.modified = true;
                    self.ipgVariables.hasUnsavedData = true;
                }

            };

            self.onUndoDelete = function(priceBookPart) {
                priceBookPart.deleted = false;
                priceBookPart.modified = false;
            };
            
            //self.onBack = function() {
            //    window.history.back();
            //};

            self.onCancel = function() {
                self.ipgVariables.hasUnsavedData = false;
                self.state.go("PriceBook");
            };

            function initialize() {
                if (self.state.params.id) {
                    self.priceBookPartModel.loadListByPriceBookId(self.state.params.id);
                    self.model.loadPriceBook(self.state.params.id);
                }
            };

            initialize();
        }
    ];

    angular
    .module(module)
    .controller(controllerName, ctrl);

})();
