(function() {
    "use strict";

    var ctrlName = 'CaseController';

    var ctrl = [
        '$scope', '$stateParams', 'CaseModel', 'viewModelHelper', '$window', 'CaseAdjustmentModel', 'Notification', 'currentUser',
        function($scope, $stateParams, caseModel, viewModelHelper, $window, caseAdjustmentModel, notification, currentUser) {

            var self = $scope;

            self.case = caseModel;
            viewModelHelper.showPageHeader = !$window.opener;
            self.caseAdjustmentModel = caseAdjustmentModel;
            self.activeTabs = [true, false, false];

            self.getDisableReasonForEditmode = function() {
                if (caseModel.header.locked) {
                    return 'Case is in Billing/Collections. To make updates, change status to Billing Maintenance.';
                } else if (caseAdjustmentModel.isInEditMode()) {
                    return 'To make changes on Equipment List, please save adjustments.';
                }

                return '';
            };

            self.toggleOldCalcRevView = function() {
                self.showOldCalcRev = !self.showOldCalcRev;

                if (!self.showOldCalcRev) {
                    if (self.activeTabs[2]) {
                        self.activeTabs[2] = false;
                        self.activeTabs[1] = false;
                        self.activeTabs[0] = true;
                    }
                } else {
                    self.activeTabs[0] = false;
                    self.activeTabs[1] = false;
                    self.activeTabs[2] = true;
                }
            };
            
            self.isEditDisabled = function () {
                var hasPermissionToEdit = self.case.hasPermToOvrdArEst || (self.case.hasPermissionToSave && !self.case.header.locked);
                return !hasPermissionToEdit ||
                        self.caseAdjustmentModel.isInEditMode();
            };

            var showWriteOffNotification = function() {
                if (!self.case.header || !self.case.header.procedureResponsibility) return;
                var greaterPatWrtOff = self.case.header.actualMemberResp < (-self.case.header.procedureResponsibility.patientWriteoffAmount);
                var greatetCarWrtOff = self.case.header.actualCarrierResp < (-self.case.header.procedureResponsibility.carrierWriteoffAmount);
                if (greaterPatWrtOff && greatetCarWrtOff) notification.error("Writeoffs are greater than responsibility.");
                else if (greaterPatWrtOff) notification.error("Patient writeoff is greater than responsibility.");
                else if (greatetCarWrtOff) notification.error("Carrier writeoff is greater than responsibility.");
            };

            var activate = function() {
                self.case.loadCase($stateParams.ppId).then(function() {
                    showWriteOffNotification();
                });
            };


            activate();
        }
    ];

    angular.module('app').controller(ctrlName, ctrl);
})();