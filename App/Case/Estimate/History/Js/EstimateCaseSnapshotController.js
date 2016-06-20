(function() {
    "use strict";

    var ctrlName = 'EstimateCaseSnapshotController';

    var ctrl = [
        '$scope', '$http', '$stateParams', 'viewModelHelper', '$window',
        function($scope, $http, $stateParams, viewModelHelper, $window) {

            var headerHistoryUrl = '~/api/PatientProcedureHistory/detail/estimate/';
            var self = $scope;
            viewModelHelper.showPageHeader = !$window.opener;

            self.print = function() {
                $window.print();
            }

            function mergePartsCostAndPrice() {
                self.mergedPriceAndCosts = [];
                _.forEach(self.actualPartPrices, function(price) {
                    var actualPart = {};
                    actualPart.partPrice = price;

                    actualPart.partCost = {
                        maicUnitCost: 0,
                        poLineCost: actualPart.partPrice ? actualPart.partPrice.poTotalLineCost : null,
                        poEstimatedLineTax: 0,
                        poEstimatedLineShipping: 0
                    };
                    actualPart.partCost.poTotalLineCost = actualPart.partCost.poLineCost;
                    self.mergedPriceAndCosts.push(actualPart);
                });
                self.header.costSummary = {
                    partsCost: _.sum(self.mergedPriceAndCosts, function(value) { return value.partCost.poLineCost; }),
                    totalCost: _.sum(self.mergedPriceAndCosts, function(value) {
                        return value.partCost.poLineCost;
                    })
                }
            };

            var initialize = function() {

                $http.get(headerHistoryUrl + $stateParams.ppId + '/' + $stateParams.snapshotId)
                    .success(function(response) {
                        self.header = response;
                        self.actualPartPrices = response.partPrices;
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