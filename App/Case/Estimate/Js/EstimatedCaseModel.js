(function() {
    "use strict";

    var modelName = 'EstimatedCaseModel';
    var calculateEstimateUrl = '~/api/ProcedureEstimatedParts/Recalculate/';
    var getPartsUrl = '~/api/ProcedureEstimatedParts/';

    var modelFunction = [
        '$http', function($http) {
            var self = this;
            var getEstRespUrl = '~/api/Responsibility/Estimated/';
            var getEstPriceUrl = '~/api/Price/Estimated/';

            self.calculateAndSaveEstimate = function() {
                return $http.post(calculateEstimateUrl + self.ppId).success(function(data) {
                    self.parts = data;
                    self.loadEstimatedResponsibility();
                    self.loadEstimatedPrice();
                });
            };

            self.loadParts = function(ppId) {
                self.ppId = ppId;
                return $http.get(getPartsUrl + self.ppId).success(function(data) {
                    self.parts = data;
                    _.forEach(self.parts, function(value) {
                        //Add dummy cost object.
                        value.partCost = {
                            maicUnitCost: 0,
                            poLineCost: value.partPrice ? value.partPrice.poTotalLineCost : null,
                            poEstimatedLineTax: 0,
                            poEstimatedLineShipping: 0
                        };
                    });
                });
            };

            self.loadEstimatedResponsibility = function() {
                return $http.get(getEstRespUrl + self.ppId).success(function(data) {
                    self.estimatedResp = data;
                    if (!self.estimatedResp) return;
                    self.estimatedResp.negCarWrtOff = -self.estimatedResp.carrierWriteoffAmount;
                    self.estimatedResp.negPatWrtOff = -self.estimatedResp.patientWriteoffAmount;
                });
            };

            self.loadEstimatedPrice = function() {
                return $http.get(getEstPriceUrl + self.ppId).success(function(data) {
                    self.estimatedPriceSummary = data;
                });
            };
        }
    ];

    angular.module('app').service(modelName, modelFunction);

})();