(function() {
    "use strict";

    var ctrlName = 'CasePdlController';

    var ctrl = [
        '$scope', '$http', '$stateParams', '$window', 'viewModelHelper',
        function($scope, $http, $stateParams, $window, viewModelHelper) {

            var headerLoadUrl = '~/api/PatientProcedure/header/';
            var partsLoadUrl1 = '~/api/ProcedureParts/pdl/';

            var self = $scope;
            viewModelHelper.showPageHeader = false;
            self.showSecondary = ($stateParams.pdlMode && $stateParams.pdlMode.toLowerCase() === 'secondary');
            self.currentDate = new Date();

            self.closeWindow = function() {
                $window.close();
            }

            self.print = function() {
                $window.print();
            }

            var loadParts = function() {
                return $http.get(partsLoadUrl1 + $stateParams.ppId)
                    .success(function(data) {
                        self.parts = _.filter(data, function (value) { return value.partSku !== 'admin_fee'; });

                        var partWithMaxBilledAmount = _.max(self.parts, function(nestedValue) {
                            return nestedValue.billedLineAmt;
                        });
                        var adminFeePart = _.find(data, function(value) {
                            return value.partSku === 'admin_fee';
                        });
                        if (adminFeePart && partWithMaxBilledAmount) {
                            partWithMaxBilledAmount.billedLineAmt += adminFeePart.billedLineAmt;
                        }
                    });
            };

            var loadHeader = function() {
                return $http.get(headerLoadUrl + $stateParams.ppId)
                    .success(function(data) {
                        self.caseId = data.caseId;
                        self.header = data;
                    });
            };

            var initialize = function () {
                loadHeader();
                loadParts();
            };

            initialize();
        }
    ];


    angular
        .module('app')
        .controller(ctrlName, ctrl);

})();