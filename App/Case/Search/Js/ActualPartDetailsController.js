(function() {
    
    'use strict';

    var ctrlName = 'ActualPartsDetailsController';


    var ctrl = [
        '$scope', '$log', '$http', 'patientCase', 'mode', '$modalInstance',

        function ($scope, $log, $http, patientCase, mode, $modalInstance) {

            var calcUlr = '~/api/ProcedureParts/CalculateAndSavePartCosts/'; // costs will update the po costs and prices...
            var loadUrl = '~/api/ProcedureParts/';
            var loadRecords = null;


            var self = $scope;
            var ppId = patientCase.id;
            
            self.patientCase = patientCase;
            self.records = [];
            self.dataLoadInProgress = false;
            self.mode = mode || 'calc';


            self.ok = function () {
                $modalInstance.close();
            };

            self.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            

            self.reRunCalcRev = function() {
                loadRecords(calcUlr + ppId);
            };
            loadRecords = function(url) {
                self.dataLoadInProgress = true;
                self.records = [];
                $http.post(url)
                    .success(function(data) {
                        self.records = data;
                    }).then(function() {
                        self.dataLoadInProgress = false;
                    });
            };
            var loadPartCostsPrices = function() {
                loadRecords(loadUrl + ppId);
            };
            var calcAndSavePartCostsnPrices = function () {
                loadRecords(calcUlr + ppId);
            };


            var activate = function () {
                $log.info(ctrlName + 'Activated');
                
                if (self.mode === 'calc') {
                    calcAndSavePartCostsnPrices();
                } else {
                    loadPartCostsPrices();
                }
            };

            activate();

        }
    ];


    angular
        .module('app')
            .controller(ctrlName, ctrl);



})();