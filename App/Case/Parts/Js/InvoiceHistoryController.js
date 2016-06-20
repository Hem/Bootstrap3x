(function() {
    'use strict';
    var controllerName = 'InvoiceHistoryController';

    var ctrl = [
        '$scope', '$http', 'Notification', 'partInfo', '$modalInstance', function($scope, $http, notification, partInfo, $modalInstance) {

            var updateSelectedActualPart = function(actualPart) {
                $scope.actualPart.linkedActualPartId = actualPart.id;
                $scope.actualPart.linkedPatientProcedureId = actualPart.patientProcedureId;
                $scope.actualPart.enteredUnitCost = actualPart.enteredUnitCost;
                $scope.actualPart.enteredLineTax = actualPart.enteredLineTax;
                $scope.actualPart.enteredLineShipping = actualPart.enteredLineShipping;
                $scope.actualPart.quantity = actualPart.quantity;
            };

            $scope.updatePartFlag = function(actualPart, patientProcedure) {
                updateSelectedActualPart(actualPart);
                var anyDocumentFromSelectedProcedure = _.some(patientProcedure.documents, function(doc) {
                    return doc.documentId === $scope.actualPart.documentId;
                });
                if (!anyDocumentFromSelectedProcedure) {
                    $scope.actualPart.documentId = patientProcedure.documents[0].documentId;
                }
                $scope.updatedHistoricInvoiceSelection = true;
            };

            $scope.updateDocumentFlag = function(document, patientProcedure) {
                $scope.actualPart.documentId = document.documentId;
                var anyPartFromSelectedProcedure = _.some(patientProcedure.actualParts, function(part) {
                    return part.id === $scope.actualPart.linkedActualPartId;
                });
                if (!anyPartFromSelectedProcedure) {
                    updateSelectedActualPart(patientProcedure.actualParts[0]);
                }
                
                $scope.updatedHistoricInvoiceSelection = true;
            };

            $scope.close = function() {
                $modalInstance.close();
            };

            $scope.LinkToPrevInvoiceDocument = function () {
                $modalInstance.close($scope.actualPart);
            };

            var loadInvoiceHistory = function() {
                $scope.loadingInvoiceHistory = true;
                return $http.get("~/api/ManufacturerInvoice/GetByPartsInCase/" + partInfo.patientProcedureId + '/' + partInfo.partId + '/' + partInfo.id).then(function(response) {
                    $scope.invoiceHistory = response.data;
                    $scope.loadingInvoiceHistory = false;
                });
            };

            var loadCaseInfo = function() {
                return $http.get("~/api/PatientProcedure/header/" + partInfo.patientProcedureId).then(function(response) {
                    $scope.caseInfo = response.data;
                });
            }

            var loadActualPart = function() {
                $scope.actualPart = angular.copy(partInfo);
            }

            loadCaseInfo();
            loadActualPart();
            loadInvoiceHistory();
        }
    ];

    angular.module('app').controller(controllerName, ctrl);
})();