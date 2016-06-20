(function() {

    'use strict';


    var controllerName = 'AddPartToCaseController';

    var ctrl = [
        '$scope', '$http', '$stateParams', '$timeout', 'Notification', 'viewModelHelper', '$window', 'APP_CONSTANTS', '$modal',
        function($scope, $http, $stateParams, $timeout, notification, viewModelHelper, $window, appConstants, $modal) {

            var self = $scope;
            self.listOfPartsToAdd = [];
            viewModelHelper.showPageHeader = !$window.opener;

            self.onAddPartClick = function(partToAdd) {
                self.addingPartsToCase = true;
                if (!validatePartAlreadyExists(partToAdd)) {
                    var validatePolicyUrl = "~/api/ProcedureParts/ValidateForMedicalPolicy";
                    $http.post(validatePolicyUrl, { patientProcedureId: $stateParams.ppId, partId: partToAdd.id }).success(function(response) {
                        self.pushPartsToDisplayList(response);
                        self.addingPartsToCase = false;
                    });
                } else {
                    notification.error('Part already exists');
                    self.addingPartsToCase = false;
                }

            };

            function validatePartAlreadyExists(partToAdd) {
                var partExists = _.some(self.parts.concat(self.listOfPartsToAdd), function (value) {
                    //For the part selected from parts drop down, the part id field is the id field of object.
                    var partId = partToAdd.partId ? partToAdd.partId : partToAdd.id;
                    return value.partId === partId;
                });
                return partExists;
            };

            var loadParts = function() {
                return $http.get("~/api/ProcedureParts/GetParts/" + $stateParams.ppId).then(function(response) {
                    self.parts = _.filter(response.data, function(value) {
                        return !value.poId && !value.multiPackPoId && value.quantity > 0 && value.partSku !== 'admin_fee';
                    });
                    _.forEach(self.parts, function(value) {
                        value.metadata = {
                            partId: value.partId,
                            patientProcedureId:  $stateParams.ppId
                        };
                    });
                    self.$$childHead.form.$setPristine();
                });
            };
          
            window.onbeforeunload = function() {
                var anyPartModified = _.some(self.parts, function(value) { return value.modified; });
                if (anyPartModified || self.listOfPartsToAdd.length > 0) {
                    return "You have unsaved changes.";
                }
            };

            function reAddPartsFromDebitPartsScreen() {
                var partToAddClone = angular.copy($stateParams.partsToAdd);
                _.forEach(partToAddClone, function(value) {
                    if (!validatePartAlreadyExists(value)) {
                        var validatePolicyUrl = "~/api/ProcedureParts/ValidateForMedicalPolicy";
                        $http.post(validatePolicyUrl, {
                            patientProcedureId: $stateParams.ppId,
                            partId: value.partId
                        }).success(function(response) {
                            //response[0].quantity = value.poQuantity;
                            response[0].poType = value.poType;
                            self.pushPartsToDisplayList(response);
                        });
                    } else {
                        notification.error('Part already exists');
                    }
                });
                if ($stateParams.partsToAdd && $stateParams.partsToAdd.length > 0) {
                    self.$$childHead.form.$setDirty();

                    $stateParams.partsToAdd = [];
                }
            }

            var loadCaseInformation = function() {
                var caseInfoUrl = "~/api/PatientProcedure/header/" + $stateParams.ppId;
                $http.get(caseInfoUrl).success(function(response) {
                    self.caseInfo = response;
                });
            };

            var initialize = function () {
                self.loadingParts = true;
                loadParts().then(function() {
                    $http.get("~/api/ProcedureParts/GetPartsWithDebitInformation/" + $stateParams.ppId).then(function(response) {
                        
                        self.uncommittedDebitPartsExists = _.some(response.data, function(value) {
                            return value.newDebitQuantity < 0;
                        });

                        if (!self.uncommittedDebitPartsExists) {
                            reAddPartsFromDebitPartsScreen();
                        }
                        self.loadingParts = false;
                    });
                });
            }

            self.removePartFromList = function(part) {
                var indexOfPartInDisplay = self.listOfPartsToAdd.indexOf(part);
                self.listOfPartsToAdd.splice(indexOfPartInDisplay, 1);
            };

            self.pushPartsToDisplayList = function(data) {
                angular.forEach(data, function(tempActualPart) {
                    tempActualPart.newPart = true;
                    tempActualPart.enteredLineTax = null;
                    tempActualPart.metadata = {
                        partId: tempActualPart.partId,
                        patientProcedureId: $stateParams.ppId
                    };
                    if (tempActualPart.isDirectBillOrContracted && !tempActualPart.facilityManufacturerRelationshipExists) {
                        notification.warning("Manufacturer/Facility relationship not defined for " + self.caseInfo.facility.name);
                    }
                    if (tempActualPart.supported === 1) {
                        self.listOfPartsToAdd.unshift(tempActualPart);
                    } else if (tempActualPart.supported === -1) {
                        self.listOfPartsToAdd.unshift(tempActualPart);
                    } else if (self.caseInfo.primaryCarrier.allowUnsupportedParts) {
                        self.listOfPartsToAdd.unshift(tempActualPart);
                    } else {
                        notification.error(tempActualPart.partName + ' not supported.');
                    }
                });
            };

            var onSaveComplete = function() {
                notification.success("Parts saved successfully.");
                self.listOfPartsToAdd = [];
                self.parts = [];
                self.savingParts = false;
                $timeout(function() {
                    self.onCloseClick();
                }, 1000);
            };

            self.onSaveClick = function() {

                var saveUrl = "~/api/ProcedureParts/SaveActualParts/";
                var partsToSave = _.filter(self.parts, function(value) {
                    return !value.markedForDeletion;
                });
                var partsToDelete = _.filter(self.parts, function(value) {
                    return value.markedForDeletion;
                });

                var param = {
                    partsToSave: self.listOfPartsToAdd.concat(partsToSave),
                    partsToDelete: partsToDelete,
                    partsToLinkInvoices: self.listOfPartsToAdd.concat(partsToSave)
                };
                self.savingParts = true;
                $http.post(saveUrl + $stateParams.ppId, param).then(onSaveComplete);
            };

            self.onCancelClick = function() {
                self.listOfPartsToAdd = [];
                loadParts();
            };

            self.onCloseClick = function() {
                if ($window.opener) {
                    $window.close();
                } else {
                    //Go to case search page.
                    $window.location.href = '../../#/Search';
                }
            };

            $scope.showAdvancedSearch = function () {
                var modalInstance = $modal.open({
                    templateUrl: '~/App/Case/Parts/Views/AdvancedSearchView.html',
                    controller: 'AdvancedSearchController',
                    size: 'lg'
                });

                modalInstance.result.then(function(selectedParts) {
                    if (selectedParts) {
                        _.forEach(selectedParts, function(part) {
                            self.onAddPartClick(part);
                        });
                    }
                });

            };

            $window.onunload = function() {
                if ($window.opener) {
                    $window.opener.postMessage('refreshEquipmentList', appConstants.insight_url);
                }
            };
           
            loadCaseInformation();
            initialize();
            document.title = "Insight NG: Group Add/Edit";
        }
    ];

    angular.module('app').controller(controllerName, ctrl);

})();