(function() {
    'use strict';

    var controllerName = "PartCreateController";
    var module = 'app';

    var ctrl = [
        '$scope', 'PriceBookModel', 'PriceBookPartModel',
            function ($scope, priceBookModel, priceBookPartModel) {
                var self = $scope;

                self.priceBookPartModel = priceBookPartModel;
                self.priceBookModel = priceBookModel;
                self.partPriceBook = {};

                self.onSave = function () {
                    self.partModel.checkPartExist().then(function() {
                        if (self.partModel.partExists)
                            self.notification.error("This Model Number already exists for this Manufacturer.  Please update the existing record.");
                        else {
                            self.partModel.createPart().then(function() {

                                self.priceBookPartModel.assignPartIdForPriceBooks(self.partModel.selectedPart.id);
                                self.priceBookPartModel.saveAll().then(function() {
                                    self.ipgVariables.hasUnsavedData = false;
                                    self.notification.success("Successfully Created New Part");
                                    self.state.go('Part.Detail.View', { partId: self.partModel.selectedPart.id });
                                });

                            });
                        }
                    });


                };

                self.onPriceBookSelect = function(selectedPriceBook) {
                    if (selectedPriceBook) {
                        if (!self.priceBookPartModel.priceBookExists(selectedPriceBook)) {
                            self.priceBookModel.loadPriceBook(selectedPriceBook.id).then(function() {
                                if (self.partModel.selectedPart.mfrListPrice) {
                                    self.partPriceBook.unitPrice = self.partModel.selectedPart.mfrListPrice;
                                    self.partPriceBook.discountPrice = self.partPriceBook.unitPrice -self.partPriceBook.unitPrice * (self.priceBookModel.selectedPriceBook.discountPercent / 100);
                                }
                            });
                        }
                    }
                };

                self.onCancel = function() {
                    self.state.go('Part');
                };


                self.$watch('FormData.$dirty', function (newvalue) {
                    if (newvalue) {
                        self.ipgVariables.hasUnsavedData = true;
                    }
                });

                self.onAddPriceBook = function() {
                    
                    self.partPriceBook.added = true;
                    self.partPriceBook.priceBook = self.priceBookModel.selectedPriceBook;
                    self.partPriceBook.pricebookId = self.priceBookModel.selectedPriceBook.id;
                    self.priceBookPartModel.priceBookPartList.push(self.partPriceBook);
                    self.partPriceBook = {};
                };

                self.OnPartUnitPriceChange = function(partPriceBook) {
                    partPriceBook.modified = true;
                    self.ipgVariables.hasUnsavedData = true;
                    if (partPriceBook.priceBook.discountPercent > 0)
                        partPriceBook.discountPrice = partPriceBook.unitPrice - partPriceBook.unitPrice * (partPriceBook.priceBook.discountPercent / 100);
                };


                self.OnPartDiscountPriceChange = function(partPriceBook) {
                    partPriceBook.modified = true;
                    self.ipgVariables.hasUnsavedData = true;
                };

                self.onDiscountOverrideChange = function() {
                    if (!self.partModel.selectedPart.discountOverride) self.partModel.selectedPart.costFormula = null;
                };

            function initialize() {
                self.partModel.resetPart();
                self.priceBookPartModel.resetPriceBookPart();
            };

            initialize();
        }
    ];

    angular.module(module).controller(controllerName, ctrl);

})();