(function() {

    'use strict';


    var controllerName = 'AdvancedSearchController';

    var ctrl = [
        '$scope', 'PartApiService', '$modalInstance', 
        function($scope, partApiService, $modalInstance) {
            $scope.params = {
                pageSize: 10,
                pageIndex: 1,
                totalCount: 0,
                totalPages: 1
            };
            $scope.selectedParts = [];

            $scope.onPageIndexChange = function() {
                $scope.loadParts();
            };

            $scope.onSelectionChange = function(part) {
                if (part.selected) {
                    var isSelected = _.some($scope.selectedParts, function(value) {
                        return value.id === part.id;
                    });
                    if (!isSelected) {
                        $scope.selectedParts.push(part);
                    }
                } else {
                    $scope.selectedParts = _.filter($scope.selectedParts, function(value) {
                        return value.id !== part.id;
                    });
                }
                $scope.anyPartSelected = $scope.selectedParts.length > 0;
            };

            var updateSelection = function() {
                _.forEach($scope.partsList, function (part) {
                    var isSelected = _.some($scope.selectedParts, function(value) {
                        return value.id === part.id;
                    });
                    if (isSelected) {
                        part.selected = true;
                    }
                });
            };

            $scope.search = function() {
                $scope.selectedParts = [];
                $scope.params.pageIndex = 1;
                $scope.partsList = [];
                $scope.searchInProgress = true;
                $scope.loadParts();
            };

            $scope.quickAdd = function() {
                $modalInstance.close($scope.selectedParts);
            };

            $scope.close = function() {
                $modalInstance.close();
            };

            $scope.loadParts = function() {
                $scope.loadingParts = true;
                partApiService.LoadPartsList($scope.params)
                    .then(function(response) {
                        $scope.partsList = response.data;
                        $scope.params.totalCount = response.totalCount;
                        $scope.params.totalPages = response.totalPages;
                        updateSelection();
                        $scope.searchInProgress = false;
                        $scope.loadingParts = false;
                    });
            };
        }
    ];

    angular.module('app').controller(controllerName, ctrl);

})();