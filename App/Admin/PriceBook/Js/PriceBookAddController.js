(function() {

    'use strict';

     var module = 'app';
     var controllerName = 'PriceBookAddController';

    var ctrl = [ '$scope', '$state', 'PriceBookModel', 'Notification',
        function ($scope, $state, priceBookModel, notification) {

            var self = $scope;
            self.state = $state;
            self.mfgDropDownMetadata = {
                directBill: true
            };
            self.onSave = function () {
                priceBookModel.createPriceBook().then(function () {
                    notification.success("Successfully Created Price Book");
                    self.state.go('PriceBook.Detail.View', { id: self.model.selectedPriceBook.id });
                });
                self.ipgVariables.hasUnsavedData = false;
            };

            self.reset = function () {
                priceBookModel.resetPriceBook();
                self.state.reload("PriceBook.add");
            };

            self.cancel = function () {
                self.state.go("PriceBook");
            };

            //self.onBack = function() {
            //    window.history.back();
            //};

            function initialize() {
                self.ipgVariables.hasUnsavedData = true;
                priceBookModel.resetPriceBook();
            };

            initialize();

        }
    ];
    
    angular
        .module(module)
        .controller(controllerName, ctrl);

})();