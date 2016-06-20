(function () {
    'use strict';

    var module = 'app';
    var controllerName = 'PartEditController';

    var ctrl = ['$scope', 'PriceBookPartModel', 'PriceBookModel',
        function ($scope, priceBookPartModel, priceBookModel){

            var self = $scope;
            self.priceBookPartModel = priceBookPartModel;
            self.priceBookModel = priceBookModel;
            self.partPriceBook = {};
            self.priceBook = {};
            self.pageListLoaded = false;

            self.onPriceBookSelect = function (selectedPriceBook) {
                if (selectedPriceBook.id) {
                    if (!self.priceBookPartModel.priceBookExists(selectedPriceBook)) {
                        self.priceBookModel.loadPriceBook(selectedPriceBook.id).then(function () {
                            if (self.partModel.selectedPart.mfrListPrice) {
                                self.partPriceBook.unitPrice = self.partModel.selectedPart.mfrListPrice;
                                self.partPriceBook.discountPrice = self.partPriceBook.unitPrice - self.partPriceBook.unitPrice * (self.priceBookModel.selectedPriceBook.discountPercent / 100);
                            }
                        });
                    }
                }
            };

            self.onCancel = function () {
                self.state.go('Part');
            };

            self.onSave = function() {
                self.partModel.updatePart().then(function () {
                    if (self.ipgVariables.hasUnsavedData) {
                        self.priceBookPartModel.saveAll().then(function () {
                            self.notification.success('Successfully updated the Part.');
                            self.ipgVariables.hasUnsavedData = false;
                            self.state.go('Part.Detail.View', { partId: self.state.params.partId });
                        });
                    } else {
                        self.ipgVariables.hasUnsavedData = false;
                        self.state.go('Part.Detail.View', { partId : self.state.params.partId});
                    }
                    
                });
            };

            self.reset = function() {
                self.partPriceBook = {};
                self.priceBook = {};
                self.FormData.priceBookForm.$setPristine();
            };

            self.OnPartUnitPriceChange = function (partPriceBook) {
                partPriceBook.modified = true;
                self.ipgVariables.hasUnsavedData = true;
                if(partPriceBook.priceBook.discountPercent  > 0)
                    partPriceBook.discountPrice = partPriceBook.unitPrice - partPriceBook.unitPrice * (partPriceBook.priceBook.discountPercent / 100);
            };

            self.OnPartDiscountPriceChange = function(partPriceBook) {
                partPriceBook.modified = true;
                self.ipgVariables.hasUnsavedData = true;
            };

            self.onAddPriceBook = function () {
                self.partPriceBook.added = true;
                self.partPriceBook.priceBook = self.priceBookModel.selectedPriceBook;
                self.partPriceBook.pricebookId = self.priceBookModel.selectedPriceBook.id;
                self.partPriceBook.partId = self.partModel.selectedPart.id;
                self.priceBookPartModel.priceBookPartList.push(self.partPriceBook);
                self.ipgVariables.hasUnsavedData = true;
                self.reset();
            };

            self.$watch('FormData.detailForm.$dirty', function (newvalue) {
                if (newvalue) {
                    self.ipgVariables.hasUnsavedData = true;
                }
            });
            
            self.$watch('FormData.categoryForm.$dirty', function (newvalue) {
                if (newvalue) {
                    self.ipgVariables.hasUnsavedData = true;
                }
            });
            
            self.$watch('FormData.manufacturerSummaryForm.$dirty', function(newvalue) {
                if (newvalue) {
                    self.ipgVariables.hasUnsavedData = true;
                }
            });

            self.onDiscountOverrideChange = function () {
                if (!self.partModel.selectedPart.discountOverride) self.partModel.selectedPart.costFormula = null;
            };

            var initialize = function () {
                //Temporary Hack to assign discount
                self.partModel.loadPart(self.state.params.partId).then(function() {
                    if (self.partModel.selectedPart.mfrDiscountPrice === 0)
                        self.partModel.selectedPart.mfrDiscountPrice = null;
                });
                self.priceBookPartModel.loadListByPartId(self.state.params.partId);
            }

            initialize();

        }
    ];

    angular
        .module(module)
        .controller(controllerName, ctrl);

})();


