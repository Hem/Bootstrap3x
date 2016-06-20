(function() {
    "use strict";

    var modelName = 'CaseAdjustmentModel';
    var modelFunc = [
        '$http', '$rootScope', 'Notification',
        function ($http, $rootScope, notification) {

            var self = this;
            self.newAdjustment = {};
            self.cachedAdjustments = [];
            self.listModified = false;
            self.saveInProgress = false;

            var saveUrl = '~/api/Adjustments/SaveAdjustments/';

            self.isInEditMode = function() {
                return self.listModified || self.anyAdjustmentModified;
            };

            self.add = function () {
                var parameter = angular.copy(self.newAdjustment);
                var existing = _.filter(self.caseModel.header.adjustments, function (value) {
                    return value.adjustmentReasonId === parseInt(parameter.reason.id, 10);
                });

                var existingCached = _.filter(self.cachedAdjustments, function (value) {
                    return value.reason.id === parameter.reason.id;
                });

                if (existing.length === 1) {
                    existing[0].negativeAdjustmentAmount = parameter.negativeAdjustmentAmount;
                    existing[0].isModified = true;
                }
                else if (existingCached.length === 1) {
                    existingCached[0].negativeAdjustmentAmount = parameter.negativeAdjustmentAmount;
                }
                else {
                    self.cachedAdjustments.push(angular.copy(self.newAdjustment));
                }

                self.newAdjustment = {};
                self.listModified = true;
            };

            function addOrUpdate() {
                _.forEach(self.cachedAdjustments, function (value) {
                    value.patientProcedureId = self.caseModel.ppId;
                    value.entityCode = value.reason.entityCode;
                    value.adjustmentAmount = -value.negativeAdjustmentAmount;
                    value.adjustmentReasonId = value.reason.id;
                });
                var modified = _.filter(self.caseModel.header.adjustments, function (value) { return value.isModified; });
                _.forEach(modified, function (value) { value.adjustmentAmount = -value.negativeAdjustmentAmount; });
                var deleted = _.filter(self.caseModel.header.adjustments, function (value) { return value.isDeleted; });
                _.forEach(deleted, function (value) { value.adjustmentAmount = 0; });

                return $http.post(saveUrl + self.caseModel.ppId,
                                  self.cachedAdjustments.concat(modified).concat(deleted));
            };

            var showWriteOffNotification = function() {
                if (!self.caseModel.header || !self.caseModel.header.procedureResponsibility) return;
                var greaterPatWrtOff = self.caseModel.header.actualMemberResp < (-self.caseModel.header.procedureResponsibility.patientWriteoffAmount);
                var greatetCarWrtOff = self.caseModel.header.actualCarrierResp < (-self.caseModel.header.procedureResponsibility.carrierWriteoffAmount);
                if (greaterPatWrtOff && greatetCarWrtOff) notification.error("Writeoffs are greater than responsibility.");
                else if (greaterPatWrtOff) notification.error("Patient writeoff is greater than responsibility.");
                else if (greatetCarWrtOff) notification.error("Carrier writeoff is greater than responsibility.");
            };
            
            self.save = function() {
                self.saveInProgress = true;
                return addOrUpdate().then(function (response) {
                    self.caseModel.reLoadCase().then(function() {
                        notification.success("Adjustments saved.");
                        showWriteOffNotification();
                        self.cachedAdjustments = [];
                        self.listModified = false;
                        self.anyAdjustmentModified = false;
                        self.saveInProgress = false;
                    });
                });
            };

            self.removeCached = function (cached) {
                var index = self.cachedAdjustments.indexOf(cached);
                if (index >= 0)
                    self.cachedAdjustments.splice(index, 1);
            };
        }
    ];

    angular.module('app').service(modelName, modelFunc);
})();