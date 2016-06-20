(function () {
    'use strict';

    var module = 'app';
    var controllerName = 'PartViewController';

    var ctrl = ['$scope', '$state', 'PriceBookPartModel',
        function ($scope, $state, priceBookPartModel) {

            var self = $scope;
            self.state = $state;
            self.priceBookPartModel = priceBookPartModel;

            self.onDelete = function () {
                var title = "Are you sure you want to delete this part?";
                var message = "Please confirm deletion";

                self.ipgDialog.showConfirm(title, message).then(function() {
                    self.partModel.deletePart().then(function() {
                        if (!self.partModel.selectedPart.deleted) {
                            self.ipgDialog.showAlert("You can't delete this Part", 'This Part is used by Patient Procedures.');
                        } else {
                            self.notification.success("Part has been deleted.");
                            self.refreshList();
                        }
                    });
                });


            };

            var initialize = function () {
                self.partModel.loadPart(self.state.params.partId);
                self.priceBookPartModel.loadListByPartId(self.state.params.partId);
            }

            initialize();

        }
    ];
    
    angular
        .module(module)
        .controller(controllerName, ctrl);

})();


