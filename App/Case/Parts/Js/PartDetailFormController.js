(function() {
    'use strict';

    angular.module('app').directive('partDetailForm', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                part: '=',
                surgeryScheduledDate: '=',
                remove: '&',
                formName: '='
            },
            controller: [
                '$scope', '$modal', '$http', 'Notification', function($scope, $modal, $http, notification) {
                    $scope.Math = window.Math;
                    $scope.validatePoOverrides = function(part) {
                        if (!part.poType || part.poType.name !== 'C') {
                            part.enteredUnitCost = null;
                            part.enteredLineShipping = null;
                            part.enteredLineTax = null;

                            if (!part.poType) {
                                $scope[$scope.formName].$setDirty();
                            }
                        }

                    };

                    $scope.getMaxCostOverride = function(part) {
                        return Math.round(part.mfrUnitCost + (part.mfrUnitCost / 10));
                    };

                    var recalculateShippingAndTax = function() {
                        if ($scope.part.linkedPatientProcedureId) {
                            var quantity = $scope.part.quantity > 0 ? $scope.part.quantity : 1;
                            $scope.part.enteredLineShipping = $scope.part.linkedShippingPerQuantity * quantity;
                            $scope.part.enteredLineTax = $scope.part.linkedTaxPerQuantity * quantity;
                        }
                    }

                    $scope.onQuantityChange = function() {
                        recalculateShippingAndTax();
                    }

                    $scope.deLink = function() {
                        $scope.part.linkedPatientProcedureId = null;
                        $scope.part.linkedActualPartId = null;
                        $scope.part.documentId = null;
                        $scope.part.enteredUnitCost = null;
                        $scope.part.enteredLineShipping = null;
                        $scope.part.enteredLineTax = null;
                        $scope[$scope.formName].$setDirty();
                        notification.warning('Invoice is no longer linked to the part.');
                    };

                    $scope.$watch(function() { return $scope[$scope.formName] },
                        function(value) {
                            if (value) {
                                $scope.partDetailForm = value;
                            }
                        });

                    $scope.showInvoiceHistory = function(part) {
                        var modalInstance = $modal.open({
                            templateUrl: '~/App/Case/Parts/Views/InvoiceHistory.html',
                            controller: 'InvoiceHistoryController',
                            size: 'lg',
                            resolve: {
                                partInfo: function() {
                                    return part;
                                }
                            }
                        });

                        modalInstance.result.then(function(actualPart) {
                            if (actualPart) {
                                $scope.part.linkedPatientProcedureId = actualPart.linkedPatientProcedureId;
                                $scope.part.linkedActualPartId = actualPart.linkedActualPartId;
                                $scope.part.documentId = actualPart.documentId;
                                $scope.part.enteredUnitCost = actualPart.enteredUnitCost;
                                $scope.part.linkedShippingPerQuantity = actualPart.enteredLineShipping / actualPart.quantity;
                                $scope.part.linkedTaxPerQuantity = actualPart.enteredLineTax / actualPart.quantity;
                                recalculateShippingAndTax();
                                $scope[$scope.formName].$setDirty();
                            }
                        });

                    };

                    $scope.togglePartDeleted = function(part) {
                        part.markedForDeletion = !part.markedForDeletion;
                        $scope.remove();
                        //To enable save.
                        $scope[$scope.formName].$setDirty();
                    };

                    var getLinkedActualPart = function() {
                        if ($scope.part.linkedActualPartId) {
                            $http.get('~/api/ProcedureParts/GetById/' + $scope.part.linkedActualPartId).success(function(response) {
                                $scope.part.linkedShippingPerQuantity = response.enteredLineShipping / response.quantity;
                                $scope.part.linkedTaxPerQuantity = response.enteredLineTax / response.quantity;
                            });
                        }
                    };
                    getLinkedActualPart();
                }
            ],
            templateUrl: '~/app/Case/Parts/Views/AddPartsView_PartDetailForm.html'
        };

    });

}());