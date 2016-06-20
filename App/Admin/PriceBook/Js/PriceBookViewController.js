(function() {
    'use strict';

    var controllerName = 'PriceBookViewController';

    var ctrl = [
        '$scope', '$state', 'Notification', 'IpgDialog', 'ArrayHelper', function ($scope, $state, notification, ipgDialog, arrayHelper) {
            var self = $scope;
            self.arrayHelper = arrayHelper;


            //self.onBack = function() {
            //    window.history.back();
            //};

            self.onDelete = function() {
                var title = 'You are about to delete a record.';
                var message = 'Are you sure you want to Delete?';

                ipgDialog.showConfirm(title, message).then(function () {
                    self.model.selectedPriceBook.deleted = true;
                    self.model.updatePriceBook().then(function() {
                        notification.success("PriceBook has been deleted.");
                        $state.go('PriceBook');
                    });
                });
            };

            var initialize = function() {
                self.model.loadPriceBook($state.params.id);
            };

            initialize();
        }
    ];


    angular.module('app').controller(controllerName, ctrl);
})();