(function () {
    'use strict';
    var ctrl = ['$scope', '$log', '$http', 'viewModelHelper',
        function ($scope, $log, $http) {
            var loadData = null;
            $scope.title = 'IPG Parts (Admin)';
            $scope.dataLoadInProgress = false;
            $scope.parts = [];
            $scope.mfrlist = [];

            $scope.params = {
                partNumber: "",
                partName: "lions eye",
                mfrName: "",
                pageIndex: 1,
                pageSize: 20,
                totalCount: 0,
                totalPages: 1 // Total number of pages to display
            };

            $scope.search = function () {
                // reset if called from ui
                $scope.params.pageIndex = 1;
                $scope.params.totalCount = 0;
                loadData();
            }
            $scope.onPageIndexChange = function () {
                $log.log('Page changed to: ' + $scope.params.PageIndex);
                loadData();
            }
            $scope.refreshMfrs = function (filter) {
                if (filter.length > 3) {
                    $http.get('~/api/Manufacturers/Lookup/' + filter)
                        .success(function (data) {
                            $scope.mfrlist = [{ name: filter }].concat(data);
                        });
                }
                    
            }
            $scope.mfrTagTransform = function (newTag) {
                var item = { Id: null, Name: newTag };
                $log.info("New Tag:" + newTag);
                return item;
            }
            //loadData = function () {
            //    var params = $scope.params;
            //    $scope.data = [];
            //    $scope.dataLoadInProgress = true;
            //    $http({
            //        method: 'GET',
            //        url:'~/api/Parts/Find', 
            //        params: params
            //        })
            //        .success(function (data/*, status, headers, config*/) {
            //            $scope.parts = data.data;
            //            $scope.params.pageIndex = data.pageIndex;
            //            $scope.params.pageSize = data.pageSize;
            //            $scope.params.totalCount = data.totalCount;
            //            $scope.params.totalPages = data.totalPages;
            //        }).then(function (/*response*/) {
            //            $scope.dataLoadInProgress = false;
            //        });
            //};
            var activate = function () {
                $log.info("Controller is active: $s, loading data!", $scope.title);
            }
            activate();
        }
    ];
    angular
        .module('app')
        .controller('PartsAdminListController', ctrl);
})();