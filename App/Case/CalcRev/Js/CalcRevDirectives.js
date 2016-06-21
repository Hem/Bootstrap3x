(function() {
    "use strict";


    angular.module('app').directive('caseInfoView', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '='
            },
            templateUrl: '/App/Case/CalcRev/Views/CaseInfoView.html'
        };
    });

    angular.module('app').directive('caseFeeScheduleView', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '='
            },
            templateUrl: '/App/Case/CalcRev/Views/CaseFeeScheduleView.html'
        };
    });

    angular.module('app').directive('caseCarrierInfoView', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                primaryCarrier: '=',
                secondaryCarrier: '=',
                homePlanCarrier: '=',
                feeSchedule: '=',
                priceRuleGroup: '='
            },
            templateUrl: '/App/Case/CalcRev/Views/CaseCarrierInfoView.html'
        };
    });

    angular.module('app').directive('caseBenefitsView', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '='
            },
            controller: [
                '$scope', function($scope) {
                    $scope.refreshBenefits = function() {
                        $scope.ngModel.refreshBenefits();
                    };
                }
            ],
            templateUrl: '/App/Case/CalcRev/Views/CaseBenefitsView.html'
        };
    });

    angular.module('app').directive('caseAdjustmentView', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '='
            },
            controller: [
                '$scope', 'CaseAdjustmentModel', 'currentUser', function ($scope, caseAdjustmentModel, currentUser) {
                    var self = $scope;
                    self.adjustment = caseAdjustmentModel;
                    self.adjustment.caseModel = $scope.ngModel;          
                    self.case =  $scope.ngModel;

                    self.hasPermissionToSaveAdjustments = currentUser.hasPermission('CALCREV_ADJUSTMENTS');

                    function setPristine() {
                        self.adjustmentContentForm.$setPristine();
                        self.adjustmentAddForm.$setPristine();
                    };

                    self.flip = function() {
                        self.case.showAdjustments = false;
                    };

                    self.cancel = function() {
                        self.adjustment.cachedAdjustments = [];
                        self.adjustment.listModified = false;
                        self.adjustment.anyAdjustmentModified = false;
                        self.case.reLoadCase();
                        setPristine();
                        self.flip();
                    };

                    self.saveAdjustments = function() {
                        self.adjustment.save().then(function() {
                            setPristine();
                            self.flip();
                        });
                    };

                    var hasPermissionToSave = function() {
                        return (self.case.hasPermissionToSave || self.case.hasPermToOvrdArEst) &&
                            self.hasPermissionToSaveAdjustments;
                    };

                    self.isAddDisabled = function() {
                        return self.adjustmentAddForm.$invalid ||
                            self.case.header.locked ||
                            ((self.case.header.planType === 'Workers Comp' || self.case.header.procedureBenefit.carrierCoinsurancePct === 100) &&
                                self.adjustment.newAdjustment.reason.entityCode === 'P') ||
                            !hasPermissionToSave();
                    };

                    self.isSaveDisabled = function() {
                        return self.adjustmentContentForm.$invalid ||
                            (!self.adjustmentContentForm.$invalid && !self.adjustmentContentForm.$dirty && !self.adjustment.listModified) ||
                            self.case.header.locked ||
                            self.adjustment.saveInProgress ||
                            self.case.caseInEditMode ||
                            !hasPermissionToSave();
                    };

                    self.getDisableReasonForSave = function() {
                        if (self.case.caseInEditMode) {
                            return 'Equipment List is in edit mode. To save Adjustments, save Claim Prices and PO Costs.';
                        }
                        return '';
                    };

                    window.onbeforeunload = function (e) {
                        if (self.case.anyCostModified || self.case.anyPriceModified || self.adjustment.listModified || self.adjustment.anyAdjustmentModified) {
                            return 'You have attempted to leave this page.  ' +
                                'If you have made any changes to the fields without clicking the Save button, your changes will be lost.  ';
                        }
                    };
                }
            ],
            templateUrl: '/App/Case/CalcRev/Views/CaseAdjustmentView.html'
        };
    });

    angular.module('app').directive('caseBilledChargesView', function() {
        return {
            restrict: 'E', // this is an element
            replace: true,
            scope: {
                ngModel: "=",
                priceSummary: '=',
                responsibility: '=',
                editInline: '='
            },
            templateUrl: '/App/Case/CalcRev/Views/CaseBilledChargesView.html',
            controller: [
                '$scope', '$modal', 'CaseAdjustmentModel', '$http', 'EstimatedCaseModel', 'currentUser', function($scope, $modal, caseAdjustmentModel, $http, estimatedCaseModel, currentUser) {

                    var self = $scope;
                    var saveEstRespUrl = '~/api/Responsibility/Save/';

                    self.caseAdjustmentModel = caseAdjustmentModel;
                    self.hasPermissionForApproval = currentUser.hasPermission('CALCREV_BANDING_APPROVAL');

                    self.cancel = function() {
                        estimatedCaseModel.loadEstimatedResponsibility().then(function() {
                            self.editMode = false;
                        });
                    }

                    self.saveEstimatedResp = function() {
                        self.savingResp = true;
                        estimatedCaseModel.estimatedResp.carrierWriteoffAmount = -estimatedCaseModel.estimatedResp.negCarWrtOff;
                        estimatedCaseModel.estimatedResp.patientWriteoffAmount = -estimatedCaseModel.estimatedResp.negPatWrtOff;

                        $http.post(saveEstRespUrl, estimatedCaseModel.estimatedResp).then(function() {
                            estimatedCaseModel.calculateAndSaveEstimate().then(function() {
                                self.savingResp = false;
                                self.editMode = false;
                            });
                        });
                    };

                    self.open = function(size) {

                        var modalInstance = $modal.open({
                            templateUrl: '/App/Case/CalcRev/Views/ApproveCaseInBandingView.html',
                            controller: 'ApproveCaseInBandingController',
                            size: size,
                            resolve: {
                            
                            }
                        });

                        modalInstance.result.then(function(selectedItem) {
                            self.selected = selectedItem;
                        }, function() {
                            console.log('modal closed');
                        });
                    };
                }
            ]
        };
    });

    angular.module('app').directive('caseOldBilledChargesView', function () {
        return {
            restrict: 'E', 
            replace: true,
            scope: {
                ngModel: "="
            },
            templateUrl: '/App/Case/CalcRev/Views/CaseOldBilledChargesView.html'
        };
    });

    angular.module('app').directive('calcRevPoPartsView', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: "=",
                parts: '='
            },
            controller: [
                '$scope', 'Notification', 'currentUser', '$window', 'APP_CONSTANTS',
                function($scope, notification, userPermissions, $window, appConstants) {

                    var self = $scope;
                    self.currentUser = userPermissions;

                    self.onMaicToggle = function(item) {
                        var maicReasons = item.partCost.maicCalcReasons.split(',');

                        maicReasons = _.remove(maicReasons, function(i) {
                            i = parseInt(i);
                            return !(i === 100 || i === -100);
                        });

                        maicReasons.push(item.partCost.maicIsEnabled ? 100 : -100);

                        item.partCost.maicCalcReasons = maicReasons.join(',');

                        self.updatePartCost(item);
                    };

                    self.updatePartCost = function(item) {
                        self.ngModel.updatePartCost(item);
                    };

                    self.reCalculateCosts = function() {
                        self.reCalcInProgress = true;
                        self.ngModel.reCalculateCosts().then(function() {
                            self.reCalcInProgress = false;
                        });
                    };

                    self.savePartsToActualParts = function() {
                        self.saveAndPrintInProgress = true;
                        self.ngModel.savePartsToActualParts().then(function() {
                            self.saveAndPrintInProgress = false;
                            self.onClose();
                        });
                    };

                    self.savePartCosts = function() {
                        self.savingPartCosts = true;
                        self.ngModel.savePartCosts().then(function() {
                            self.savingPartCosts = false;
                            self.ngModel.resetCaseEditMode().then(function() {
                                notification.success("Cost saved successfully");
                            });
                        });
                    };

                    self.isCostEditable = function(item) {
                        if (item.poId === '') item.poId = null;
                        if (item.multiPackPoId === '') item.multiPackPoId = null;
                        return self.ngModel.caseInEditMode &&
                            !angular.hasValue(item.poId) &&
                            !angular.hasValue(item.multiPackPoId) &&
                            item.partSku !== 'admin_fee' &&
                            (self.ngModel.hasPermissionToSave || self.ngModel.hasPermToOvrdArEst) &&
                            item.quantity > 0;
                    };

                    self.isUnitCostEditable = function(item) {
                        return self.currentUser.hasPermission('CALCREV_COST_QTY_EDIT') &&
                               self.isCostEditable(item);
                    };

                    self.isSaveAndPrintDisabled = function() {
                        return !self.ngModel.hasPermissionToSave ||
                                self.reCalcInProgress ||
                                self.saveAndPrintInProgress ||
                                self.savingPartCosts ||
                                self.ngModel.header.locked ||
                                self.ngModel.header.allowArEstimateOverride;
                    };

                    self.isOvrdArEstDisabled = function() {
                        return !self.ngModel.hasPermToOvrdArEst ||
                            self.reCalcInProgress ||
                            self.saveAndPrintInProgress ||
                            self.savingPartCosts;
                    };

                    self.isMacEditable = function(item) {
                        return self.currentUser.hasPermission('CALCREV_MAIC_UPDATE') &&
                               self.isCostEditable(item);
                    }

                    self.filterPoParts = function(item) {
                        if (item.partPrice && item.partPrice.poQuantity === 0) return false;
                        return true;
                    };

                    $window.onunload = function() {
                        if ($window.opener) {
                            $window.opener.postMessage('refreshEquipmentList', appConstants.insight_url);
                        }
                    };

                    self.onClose = function() {
                        if ($window.opener) {
                            $window.close();
                        } else {
                            //Go to case search page.
                            $window.location.href = '../../#/Search';
                        }
                    };

                    self.onCancelClick = function() {
                        self.ngModel.resetCaseEditMode();
                    };
                }
            ],
            templateUrl: '/App/Case/CalcRev/Views/CalcRevPoPartsView.html'
        };
    });

    angular.module('app').directive('calcRevClaimPartsView', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: "=",
                parts: '=',
                reCalculate: '=',
                saveAndPrint: '=',
                reCalculateEstimates: '=',
                printEstimates: '='
            },
            controller: [
                '$scope', 'currentUser', 'Notification', '$window', 'APP_CONSTANTS', 'EstimatedCaseModel', 'LeftNav',
                function($scope, userPermissions, notification, $window, appConstants, estimatedCaseModel, leftNav) {
                    var self = $scope;
                    self.currentUser = userPermissions;

                    self.hcpcsUpdated = function(item) {
                        self.ngModel.hcpcsUpdated(item);
                    };
                    self.recalcPartPrice = function(item) {
                        self.ngModel.recalcPartPrice(item);
                    };

                    self.reCalculateCosts = function() {
                        self.reCalcInProgress = true;
                        self.ngModel.reCalculateCosts().then(function() {
                            self.reCalcInProgress = false;
                        });
                    };
                    self.savePartsToActualParts = function() {
                        self.saveAndPrintInProgress = true;
                        self.ngModel.savePartsToActualParts().then(function() {
                            self.saveAndPrintInProgress = false;
                            self.onClose();
                        });
                    };

                    self.calculateEstimates = function() {
                        self.reCalcEstInProgress = true;
                        estimatedCaseModel.calculateAndSaveEstimate(self.ngModel.ppId).then(function() {
                            self.reCalcEstInProgress = false;
                        });
                    };

                    self.savePartPrices = function() {
                        self.savingPartPrices = true;
                        self.ngModel.savePartPrices().then(function() {
                            self.savingPartPrices = false;
                            self.ngModel.resetCaseEditMode().then(function() {
                                notification.success("Prices saved successfully");
                            });
                        });
                    };

                    self.filterClaimParts = function(item) {
                        if (item.partPrice && item.partPrice.poQuantity === 0) return false;
                        return true;
                    };

                    self.primaryHcpcsEditable = function(item) {
                        return self.ngModel.caseInEditMode &&
                            item.partSku !== 'admin_fee' &&
                            self.currentUser.hasPermission('EDIT_PRI_HCPCS') &&
                            item.partPrice &&
                            (self.ngModel.hasPermissionToSave || self.ngModel.hasPermToOvrdArEst);
                    };

                    self.billedAmountEditable = function() {
                        return self.ngModel.caseInEditMode &&
                               self.currentUser.hasPermission('EDIT_BILLED_AMT') && 
                               (self.ngModel.hasPermissionToSave || self.ngModel.hasPermToOvrdArEst) &&
                               !self.ngModel.header.primaryCarrier.isContracted;
                    };

                    self.isSaveAndPrintDisabled = function() {
                        return !self.ngModel.hasPermissionToSave ||
                                self.reCalcInProgress ||
                                self.saveAndPrintInProgress ||
                                self.savingPartCosts ||
                                self.ngModel.header.locked ||
                                self.ngModel.header.allowArEstimateOverride;
                    };

                    self.isOvrdArEstDisabled = function() {
                        return !self.ngModel.hasPermToOvrdArEst ||
                            self.reCalcInProgress ||
                            self.saveAndPrintInProgress ||
                            self.savingPartCosts;
                    };

                    self.secHcpcsEditable = function(item) {
                        return self.ngModel.caseInEditMode &&
                            item.partSku !== 'admin_fee' &&
                            self.ngModel.header.secondaryCarrier &&
                            item.partPrice &&
                            self.ngModel.header.secondaryCarrier.allowSecondaryHcpcs &&
                            self.currentUser.hasPermission('EDIT_SEC_HCPCS') &&
                            (self.ngModel.hasPermissionToSave || self.ngModel.hasPermToOvrdArEst);
                    };

                    self.print = function() {
                        leftNav.close();
                        $window.print();
                    };

                    $window.onunload = function() {
                        if ($window.opener) {
                            if (self.reCalculateEstimates) {
                                $window.opener.postMessage('refreshEstimatedPartsList', appConstants.insight_url);
                            } else {
                                $window.opener.postMessage('refreshEquipmentList', appConstants.insight_url);
                            }
                        }
                    };

                    self.onClose = function() {
                        if ($window.opener) {
                            $window.close();
                        } else {
                            $window.location.href = '../../#/Search';
                        }
                    };

                    self.onCancelClick = function() {
                        self.ngModel.resetCaseEditMode();
                    };
                }
            ],
            templateUrl: '/App/Case/CalcRev/Views/CalcRevClaimPartsView.html'
        };
    });

    angular.module('app').directive('calcRevOldActualPartsView', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                parts: '='
            },
            templateUrl: '/App/Case/CalcRev/Views/CalcRevOldActualPartsView.html'
        };
    });


})();
