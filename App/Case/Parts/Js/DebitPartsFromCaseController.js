(function() {

    'use strict';
    var controllerName = 'DebitPartsFromCaseController';

    var ctrl = [
        '$scope', '$http', '$state', '$stateParams', 'viewModelHelper', '$window', 'APP_CONSTANTS', 'Notification', '$timeout',
        function($scope, $http, $state, $stateParams, viewModelHelper, $window, appConstants, notification, $timeout) {

            var self = $scope;
            self.mode = $stateParams.mode.toLowerCase();

            viewModelHelper.showPageHeader = !$window.opener;
            var loadPartsOnPo = function() {
                $http.get("~/api/ProcedureParts/GetPartsWithDebitInformation/" + $stateParams.ppId).then(function(response) {
                    processPartsInformation(response.data);
                });
            };

            var loadPartsNotOnPo = function() {
                $http.get("~/api/ProcedureParts/GetParts/" + $stateParams.ppId).then(function(response) {
                     self.partsWithoutPoExists = _.some(response.data, function(value) {
                        return value.poId === null && value.multiPackPoId === null && value.quantity > 0 && value.partSku !== 'admin_fee';
                     });
                });
            };
            
            function processPartsInformation(data) {
                if (self.mode === 'readd') {
                    self.parts = _.filter(data, function(value) {
                        return value.debitMemoQuantity < 0;
                    });
                } else {
                    self.parts = data;
                }
                _.forEach(self.parts, function(value) {
                    value.negativeNewDebit = -value.newDebitQuantity;
                    value.maxNewDebit = value.poQuantity + value.debitMemoQuantity;
                });

                // If its true do not allow re-add
                self.uncommittedDebitPartsExists = _.some(self.parts, function(value) {
                    return value.newDebitQuantity < 0;
                });

                if (self.$$childHead && self.$$childHead.debitPartForm) {
                    self.$$childHead.debitPartForm.$setPristine();
                }
            }

            var loadCaseInformation = function() {
                var caseInfoUrl = "~/api/PatientProcedure/header/" + $stateParams.ppId;
                $http.get(caseInfoUrl).success(function(response) {
                    self.caseInfo = response;
                });
            };

            self.validateIsAddPartToCaseEnabled = function() {
                self.isAddPartToCaseEnabled = _.some(self.parts, function(value) {
                    return value.reAdd;
                });
            };


            self.debitParts = function() {
                _.forEach(self.parts, function(value) { value.newDebitQuantity = -value.negativeNewDebit; });
                $http.post("~/api/ProcedureParts/Debit/" + $stateParams.ppId, self.parts).success(function(response) {
                    //processPartsInformation(response);
                    notification.success('Debited parts have been saved.');
                    $timeout(function() {
                        self.onClose();
                    }, 1000);
                });
            };

            self.reAdd = function() {
                $state.go('case-add-part-view', {
                    ppId: $stateParams.ppId,
                    partsToAdd: _.filter(self.parts, function(value) { return value.reAdd; })
                });
            }

            self.onClose = function() {
                if ($window.opener) {
                    $window.close();
                } else {
                    //Go to case search page.
                    $window.location.href = '../../#/Search';
                }
            }

            $window.onunload = function() {
                if ($window.opener) {
                    $window.opener.postMessage('refreshEquipmentList', appConstants.insight_url);
                }
            };

            loadCaseInformation();
            loadPartsOnPo();
            loadPartsNotOnPo();
            document.title = "Insight NG: Debit Parts";
        }
    ];

    angular.module('app').controller(controllerName, ctrl);

})();