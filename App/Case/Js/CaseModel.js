(function () {
    "use strict";

    var modelName = 'CaseModel';

    var recalculateUrl = '~/api/ProcedureParts/Recalculate/';
    var saveAndPrintUrl = '~/api/ProcedureParts/SaveAndPrint/';
    var partsLoadUrl = '~/api/ProcedureParts/';
    var headerLoadUrl = '~/api/PatientProcedure/header/';
    var benefitsLoadUrl = '~/api/PatientProcedure/benefits/';
    var partCostsUpdateUrl = '~/api/ProcedureParts/UpdateActualPartCosts/';
    var partPricesUpdateUrl = '~/api/ProcedureParts/UpdateActualPartPrices/';

    var modelFunc = [
        '$http', 'currentUser',
        function($http, currentUser) {

            var self = this;

            self.ppId = '';
            self.caseId = 0;
            self.header = {};
            self.parts = [];
            self.dataLoadInProgress = false;

            self.anyCostModified = false;
            self.anyPriceModified = false;
            self.caseInEditMode = false;
            self.allowOverrideArEstimates = false;

            self.enableCaseEditMode = function() {
                self.caseInEditMode = true;
            };

            self.resetCaseEditMode = function() {
                self.caseInEditMode = false;
                self.anyCostModified = false;
                self.anyPriceModified = false;
                return self.loadParts();
            };

            var loadHeader = function(url) {
                self.caseId = 0;
                self.header = {};
                self.dataLoadInProgress = true;

                return $http.get(url + self.ppId)
                    .success(function(data) {
                        self.caseId = data.caseId;
                        self.header = data;
                        self.reCalculateAdjustments();
                        self.hasPermToOvrdArEst = currentUser.hasPermission('CALCREV_OVERRIDE') && self.header.allowArEstimateOverride;
                        self.hasPermissionToSave = currentUser.hasPermission('CALCREV_SAVE');
                        _.forEach(self.header.adjustments, function(value) {
                            value.negativeAdjustmentAmount = - value.adjustmentAmount;
                        });
                        validateBilled();
                        validateProfit();
                        calculateOldHeaderValue();
                    }).then(function() {
                        self.dataLoadInProgress = false;
                    });
            };

            self.loadCase = function (ppId) {
                self.ppId = ppId || self.ppId;
                return loadHeader(headerLoadUrl).then(self.loadParts);
            };

            self.reLoadCase = function() {
                return loadHeader(headerLoadUrl);
            };

            self.refreshBenefits = function () {
                self.header.procedureBenefit = {};
                $http.get(benefitsLoadUrl + self.ppId)
                    .success(function(data) {
                        self.header.procedureBenefit = data;
                    });
            };

            var loadParts = function(url) {
                self.dataLoadInProgress = true;

                return $http.post(url)
                    .success(function(data) {
                        self.parts = data;
                    }).then(function() {
                        self.anyCostModified = false;
                        self.anyPriceModified = false;
                    });
            };

            // Load what's in the database...
            self.loadParts = function () {
                return loadParts(partsLoadUrl + self.ppId);
            };

            self.reCalculateAdjustments = function () {

                if (!self.header.procedureResponsibility)
                    return;

                self.header.procedureResponsibility.overrideCarrierWriteOff = _.some(self.header.adjustments, function (value) {
                    return value.reason.isEnabled && value.entityCode === 'C';
                });

                self.header.procedureResponsibility.carrierWriteOff_Ovrrd = 0;
                _.forEach(self.header.adjustments, function(value) {
                    if (value.reason.isEnabled && value.entityCode === 'C')
                        self.header.procedureResponsibility.carrierWriteOff_Ovrrd += value.adjustmentAmount;
                });

                self.header.procedureResponsibility.overridePatientWriteOff = _.some(self.header.adjustments, function (value) {
                    return value.reason.isEnabled && value.entityCode === 'P';
                });


                self.header.procedureResponsibility.patientWriteOff_Ovrrd = 0;
                _.forEach(self.header.adjustments, function (value) {
                    if (value.reason.isEnabled && value.entityCode === 'P')
                        self.header.procedureResponsibility.patientWriteOff_Ovrrd += value.adjustmentAmount;
                });

            };

            // recalculate costs
            self.reCalculateCosts = function () {
                return loadParts(recalculateUrl + self.ppId).then(self.reLoadCase);
            };

            // recalculate costs and save
            self.savePartsToActualParts = function () {
                self.dataLoadInProgress = true;

                return $http.post(saveAndPrintUrl + self.ppId)
                .then(function () {
                    self.loadCase(self.ppId);
                        self.dataLoadInProgress = false;
                    });
            };

            self.hcpcsUpdated = function(item) {
                var pp = item.partPrice;
                self.anyPriceModified = true;
                pp.modified = true;
            };

            self.recalcPartPrice = function (item) {
                var pp = item.partPrice;

                self.anyPriceModified = true;
                pp.modified = true;
                pp.billedLineAmt = pp.billedQuantity * pp.billedUnitPrice;
                pp.expReimburseUnitPrice = pp.billedUnitPrice * (pp.expReimbursePct / 100);
                pp.expReimburseLineAmt = pp.billedQuantity * pp.expReimburseUnitPrice;

                calculatedHeaderValue();
                validateBilled();
                validateProfit();
            };

            function validateProfit() {
                if (!self.header.procedureResponsibility) return;

                self.negativeProfit = self.header.procedureResponsibility.profitAmount < 0 ||
                                     ((self.anyPriceModified || self.anyCostModified) &&
                                     (self.calculatedPartTotalExpBilled < self.calculatedPartTotalCost));

                self.profitInBandingReason = '';
                self.profitInBanding = false;

                if (self.header.procedureResponsibility && self.header.procedureResponsibility.approvalRequired && !self.header.procedureResponsibility.approved) {
                    var margin = self.header.procedureResponsibility.profitPct;

                    if (margin > self.header.primaryCarrier.bandingMaxProfitMargin) {
                        self.profitInBanding = true;
                        self.profitInBandingReason = "Profit is greater than " + self.header.primaryCarrier.bandingMaxProfitMargin + '%.';
                    } else if (margin < self.header.primaryCarrier.bandingMinProfitMargin) {
                        self.profitInBanding = true;
                        self.profitInBandingReason = "Profit is less than " + self.header.primaryCarrier.bandingMinProfitMargin + '%.';
                    }
                }
            }

            function validateBilled() {
                self.totalBilledInBandingReason = '';
                self.totalBilledInBanding = false;
                if (self.header.procedureResponsibility && self.header.procedureResponsibility.approvalRequired && !self.header.procedureResponsibility.approved) {
                    self.totalBilledInBanding = self.header.priceSummary.billedAmount > self.header.primaryCarrier.bandingMaxBilled;
                    if (self.totalBilledInBanding)
                        self.totalBilledInBandingReason = "Total billed is greater than $" + self.header.primaryCarrier.bandingMaxBilled + '.';
                }
            }

            function calculatedHeaderValue() {

                var partCostExists = _.some(self.parts, function(item) { return item.partCost != null; });
                var partPriceExists = _.some(self.parts, function(item) { return item.partPrice != null; });

                if (partCostExists) {
                    self.calculatedPartCost = self.anyCostModified ? _.sum(self.parts, 'partCost.poLineCost') : self.header.costSummary.partsCost;
                    self.calculatedPartTotalCost = self.anyCostModified ? _.sum(self.parts, 'partCost.poTotalLineCost') : self.header.costSummary.totalCost;
                }

                if (partPriceExists) {
                    self.calculatedPartTotalBilled = self.anyPriceModified ? _.sum(self.parts, 'partPrice.billedLineAmt') : self.header.priceSummary.billedAmount;
                    self.calculatedPartTotalExpBilled = self.anyPriceModified ? _.sum(self.parts, 'partPrice.expReimburseLineAmt') : self.header.priceSummary.estAllowedAmount;
                }

                if (partPriceExists && partCostExists) {
                    //Calculate profit
                    var netAllowed = self.calculatedPartTotalExpBilled + self.header.procedureResponsibility.patientWriteoffAmount + self.header.procedureResponsibility.carrierWriteoffAmount;
                    self.profitMargin = (netAllowed - self.calculatedPartTotalCost);
                    self.profitPct = ((self.profitMargin) / netAllowed) * 100;

                    //Calculate responsibility
                    var remainingDeductable = self.header.procedureBenefit.deductableMax - self.header.procedureBenefit.deductableMet;
                    self.calculatedPatientResponsibility = Math.min(remainingDeductable, self.calculatedPartTotalExpBilled);
                }
            }

            function calculateOldHeaderValue() {
                self.header.oldFinalCarResp = self.header.actualCarrierResp - self.header.carrierWriteOff;
                self.header.oldFinalMemResp = self.header.actualMemberResp - self.header.patientWriteOff;
                var netAllowed = self.header.oldFinalCarResp + self.header.oldFinalMemResp;
                self.header.oldProfitMargin = netAllowed - self.header.totalPoCost;
                self.header.oldProfitPct = (self.header.oldProfitMargin / netAllowed) * 100;
            }

            self.updatePartCost = function (item) {

                var pc = item.partCost;
                var pp = item.partPrice;

                self.anyCostModified = true;
                pc.modified = 1;
                pc.mfrDiscountUnitCost = pc.mfrDiscountUnitCost || 0;
                pc.enteredUnitCost = pc.enteredUnitCost || 0;
                pc.mfrDiscountUnitCost = pc.mfrDiscountUnitCost !== 0 ? pc.mfrDiscountUnitCost : pc.mfrListPrice;
                pc.estimatedUnitCost = pc.enteredUnitCost !== 0 ? pc.enteredUnitCost : pc.mfrDiscountUnitCost;
                // pc.poEstimatedLineTax = pc.enteredLineTax !== 0 ? pc.enteredLineTax : pc.calculatedLineTax;
                pc.poEstimatedLineShipping = pc.enteredLineShipping !== 0 ? pc.enteredLineShipping : pc.calculatedLineShipping;

                var maicUnitCost = 0;
                if (pc.maicIsEnabled && pc.payFacilityFlag) {
                    maicUnitCost = pc.maicUnitCost * (pc.maicReimbursePct / 100);
                }

                pc.poUnitCost = pc.estimatedUnitCost;

                if (pc.maicIsEnabled && maicUnitCost > 0 && maicUnitCost < pc.poUnitCost)
                    pc.poUnitCost = maicUnitCost;

                pc.poLineCost = pc.poUnitCost * pc.quantityUsed;
                pc.poLineCostTax = pc.poLineCost + pc.poEstimatedLineTax;
                pc.poTotalLineCost = pc.poLineCost + pc.poEstimatedLineTax +
                                     (pc.payFacilityFlag ? pc.poEstimatedLineShipping : 0);
                
                // update cost for part prices!
                pp.poUnitCost = pc.poUnitCost;
                pp.poTotalLineCost = pc.poTotalLineCost;

                calculatedHeaderValue();
                validateBilled();
                validateProfit();
            };


            // Saving the part costs triggers a reload of the case header and parts
            self.savePartCosts = function() {
                var url = partCostsUpdateUrl + self.ppId;

                var updatedParts = [];
                _(self.parts).forEach(function(item) {
                    if (item.partCost && item.partCost.modified) updatedParts.push(item);
                }).value();

                console.info("update parts price for case", updatedParts);

                return $http.post(url, updatedParts)
                    .success(function() {
                        self.loadCase();
                    }).error(function(e) {
                        console.error(e);
                    });

            };

            // Saving the part costs triggers a reload of the case header and parts
            self.savePartPrices = function() {

                var updatedParts = [];

                _(self.parts).forEach(function (item) {
                    if (item.partPrice && item.partPrice.modified) updatedParts.push(item);
                }).value();

                console.info("update parts for case", updatedParts);

                return $http.post(partPricesUpdateUrl + self.ppId, updatedParts)
                    .success(function (i) {
                        _.forEach(self.parts, function (value) {
                            value.partPrice.modified = false;
                        });
                        self.anyPriceModified = false;
                        self.loadCase();
                    }).error(function (e) {
                        console.error(e);
                    });
            };
        }
    ];

    
    angular.module('app').service(modelName, modelFunc);

})();