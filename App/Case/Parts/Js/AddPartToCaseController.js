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

                var data = [{'hcpcsCode2':null,'hcpcsId2':null,'discountOptions':null,'enteredLineShipping':null,'calculatedUnitCost':0.00,'calculatedLineTax':0.00,'calculatedLineShipping':0.00,'calculatedLineCost':0.00,'mac':null,'serialNumber':null,'lotNumber':null,'macEnabled':false,'maicDisableReason':0,'poType':{'id':'','name':'','description':''},'payFacility':false,'partTypeName':null,'partTaxCategory':null,'poId':null,'multiPackPoId':null,'poDateAdd':null,'debitActualPartId':null,'debitedQuantity':0.0,'displaySortOrder':11,'partCost':null,'partPrice':null,'enteredLineTax':0.0000,'wastedQuantity':0,'printOnPo':{'id':'1','name':'Yes: Paid by IPG'},'printOnClaim':{'id':'1','name':'Yes'},'boxQuantity':0,'ipgPartNumber':null,'poName':null,'linkedPatientProcedureId':null,'linkedActualPartId':null,'documentId':null,'enforceMaxQuantity':false,'maxQuantityPerCase':null,'id':'b40c63e4-9cb3-484a-bad6-ecc219a0ee23','patientProcedureId':'34714039-8cf6-5d54-2281-571a630daaea','partId':'5ACE485B-D8E1-0C9F-F883-4B7B27F84F7F','partSku':'admin_fee','partName':'Admin Fee','manufacturerId':null,'manufacturer':{'id':'','name':''},'hcpcsCode':'A9900','hcpcsId':'DB0463BD-A4BD-41C3-B347-13A0B4530465','quantity':1.0,'enteredUnitCost':0.00,'mfrUnitCost':null,'mfrDiscUnitCost':0.00,'multiplier':1,'billedQuantity':1,'billedUnitPrice':50.00,'billedLineAmt':50.00,'allowedUnitPrice':50.00,'allowedLineAmt':50.00},{'hcpcsCode2':null,'hcpcsId2':null,'discountOptions':null,'enteredLineShipping':3.00,'calculatedUnitCost':13.00,'calculatedLineTax':null,'calculatedLineShipping':3.00,'calculatedLineCost':42.00,'mac':null,'serialNumber':null,'lotNumber':null,'macEnabled':false,'maicDisableReason':0,'poType':{'id':'1','name':'C','description':'CPA - Pay Facility'},'payFacility':true,'partTypeName':'Implantables','partTaxCategory':null,'poId':null,'multiPackPoId':null,'poDateAdd':null,'debitActualPartId':null,'debitedQuantity':0.0,'displaySortOrder':21,'partCost':null,'partPrice':null,'enteredLineTax':0.0000,'wastedQuantity':0,'printOnPo':{'id':'1','name':'Yes: Paid by IPG'},'printOnClaim':{'id':'1','name':'Yes'},'boxQuantity':0,'ipgPartNumber':'plate','poName':null,'linkedPatientProcedureId':null,'linkedActualPartId':null,'documentId':null,'enforceMaxQuantity':false,'maxQuantityPerCase':null,'id':'dcdf4f34-223b-4c59-a98a-dc72d85755c6','patientProcedureId':'34714039-8cf6-5d54-2281-571a630daaea','partId':'4cd0adfc-580c-71f5-64c0-5665a8bc6b12','partSku':'55-06708','partName':'Straight Plate, 8 Hole','manufacturerId':'5d5b0257-bbc2-9974-0321-4901a746d6dc','manufacturer':{'id':'5d5b0257-bbc2-9974-0321-4901a746d6dc','name':'Synthes'},'hcpcsCode':'C1713','hcpcsId':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','quantity':3.0,'enteredUnitCost':13.00,'mfrUnitCost':267.47,'mfrDiscUnitCost':0.00,'multiplier':1,'billedQuantity':3,'billedUnitPrice':null,'billedLineAmt':null,'allowedUnitPrice':null,'allowedLineAmt':null},{'hcpcsCode2':null,'hcpcsId2':null,'discountOptions':null,'enteredLineShipping':null,'calculatedUnitCost':484.00,'calculatedLineTax':null,'calculatedLineShipping':null,'calculatedLineCost':484.00,'mac':null,'serialNumber':null,'lotNumber':null,'macEnabled':false,'maicDisableReason':0,'poType':{'id':'2','name':'M','description':'MPO - Mfg Rep Delivery - Bill Only PO'},'payFacility':false,'partTypeName':'Implantables','partTaxCategory':null,'poId':null,'multiPackPoId':null,'poDateAdd':null,'debitActualPartId':null,'debitedQuantity':0.0,'displaySortOrder':31,'partCost':null,'partPrice':null,'enteredLineTax':0.0000,'wastedQuantity':0,'printOnPo':{'id':'1','name':'Yes: Paid by IPG'},'printOnClaim':{'id':'1','name':'Yes'},'boxQuantity':0,'ipgPartNumber':'plate','poName':null,'linkedPatientProcedureId':null,'linkedActualPartId':null,'documentId':null,'enforceMaxQuantity':false,'maxQuantityPerCase':null,'id':'f720c1be-eeec-4325-81c9-dc0393546fca','patientProcedureId':'34714039-8cf6-5d54-2281-571a630daaea','partId':'860dc03b-11eb-6373-61e8-541c94ece587','partSku':'7005-08003','partName':'0.8 mm T-Plate','manufacturerId':'eb8d33f6-1c6e-4574-d7f4-48dcd5e33eb3','manufacturer':{'id':'eb8d33f6-1c6e-4574-d7f4-48dcd5e33eb3','name':'Acumed'},'hcpcsCode':'C1713','hcpcsId':'41E64F58-5FCD-4FCC-AAB3-7F1EB0E78807','quantity':1.0,'enteredUnitCost':null,'mfrUnitCost':718.00,'mfrDiscUnitCost':484.00,'multiplier':1,'billedQuantity':1,'billedUnitPrice':null,'billedLineAmt':null,'allowedUnitPrice':null,'allowedLineAmt':null}];

                    self.parts = _.filter(data, function(value) {
                        return !value.poId && !value.multiPackPoId && value.quantity > 0 && value.partSku !== 'admin_fee';
                    });
                    _.forEach(self.parts, function(value) {
                        value.metadata = {
                            partId: value.partId,
                            patientProcedureId:  $stateParams.ppId
                        };
                    });
                    //self.$$childHead.form.$setPristine();
                return $http.get("~/api/ProcedureParts/GetParts/" + $stateParams.ppId).then(function(response) {
                    // self.parts = _.filter(response.data, function(value) {
                    //     return !value.poId && !value.multiPackPoId && value.quantity > 0 && value.partSku !== 'admin_fee';
                    // });
                    // _.forEach(self.parts, function(value) {
                    //     value.metadata = {
                    //         partId: value.partId,
                    //         patientProcedureId:  $stateParams.ppId
                    //     };
                    // });
                    // self.$$childHead.form.$setPristine();
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