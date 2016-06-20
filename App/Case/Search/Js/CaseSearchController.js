(function() {
    'use strict';


    var ctrlName = 'CaseSearchController';


    var ctrl = [
        '$scope', '$log', '$http', '$modal', '$window',
        function($scope, $log, $http, $modal, $window) {

            var loadData = null;

            var activate = function() {
                $log.info(ctrlName + 'Activated');
            };

            activate();

            $scope.records = [];
            $scope.dataLoadInProgress = false;
            $scope.params = {
                caseText: "",
                facility: "",
                carrier: "",

                pageSize: 20,
                pageIndex: 1,
                totalCount: 0,
                totalPages: 1 // Total number of pages to display
            };

            $scope.search = function() {
                // reset if called from ui
                $scope.params.pageIndex = 1;
                $scope.params.totalCount = 0;
                loadData();
            };

            $scope.showPdl = function(patientProcedureId) {
                $window.open("/Case/pdl#/" + patientProcedureId + '/primary', "", "width=900, height=1000");
            }

            $scope.showPdl2 = function(patientProcedureId) {
                $window.open("/Case/pdl#/" + patientProcedureId + '/secondary', "", "width=900, height=1000");
            }

            $scope.onShowActualPartDetails = function(cs, mode) {
                var modalInstance = $modal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: '~/App/Case/Search/Views/ActualPartsDetailsView.html',
                    controller: 'ActualPartsDetailsController',
                    resolve: {
                        patientCase: function() { return cs; },
                        mode: function() { return mode; }
                    }
                });


            };


            $scope.onPageIndexChange = function() {
                $log.log('Page changed to: ' + $scope.params.pageIndex);
                loadData();
            };

            loadData = function() {

                var params = angular.copy($scope.params);

                $scope.records = [];
                $scope.dataLoadInProgress = true;
                $http({
                    method: 'GET',
                    url: '~/api/PatientProcedure/Find',
                    params: params
                }).success(function(data /*, status, headers, config*/) {


                    $scope.records = data.data;
                    $scope.params.pageIndex = data.pageIndex;
                    $scope.params.pageSize = data.pageSize;
                    $scope.params.totalCount = data.totalCount;
                    $scope.params.totalPages = data.totalPages;

                }).then(function( /*response*/) {
                    $scope.dataLoadInProgress = false;
                });
            };


        }
    ];


    angular
        .module('app')
        .controller(ctrlName, ctrl);

})();