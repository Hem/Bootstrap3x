(function() {
    "use strict";

    var ctrlName = 'CaseSnapshotController';

    var ctrl = [
        '$scope', '$http', '$stateParams','viewModelHelper', '$window',
        function($scope, $http, $stateParams, viewModelHelper, $window) {

            var headerHistoryUrl = '~/api/PatientProcedureHistory/detail/';
            var self = $scope;
            viewModelHelper.showPageHeader = !$window.opener;

            self.print = function() {
                $window.print();
            }
            
            function mergePartsCostAndPrice() {
                self.mergedPriceAndCosts = [];
                _.forEach(self.actualPartPrices, function (price) {
                    var actualPart = {};
                    actualPart.partPrice = price;
                    actualPart.partCost = _.find(self.actualPartCosts, function (value) {
                        return value.id === price.id;
                    });
                    self.mergedPriceAndCosts.push(actualPart);
                });
            };

            var initialize = function() {

                $http.get(headerHistoryUrl + $stateParams.ppId + '/' + $stateParams.snapshotId)
                    .success(function(response) {
                        self.header = response;
                        self.actualPartPrices = response.partPrices;
                        self.actualPartCosts = response.partCosts;
                        mergePartsCostAndPrice();
                    });
            };

            initialize();
        }
    ];


    angular
        .module('app')
        .controller(ctrlName, ctrl);

})();