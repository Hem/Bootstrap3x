(function () {
    "use strict";

    var appName = 'app';
    var ctrlName = 'ipgCodeSelectController';
    var directiveName = 'ipgCodeSelect'; // <ipg-code-select>

    var directive = function () {
        return {
            restrict: 'E', // this is an element
            replace: false,
            require: ['ui.select'],
            scope: {
                ngModel: '=',
                codeId: '=codeId',
                code: '=code',
                codeType: '@codeType',
                ngChange: '&',
                placeHolderText: '@',
                sizing: '@',
                loadAllRecords: '@loadAllRecords'
            },
            controller: ctrlName,
            templateUrl: '~/App/Core/Views/IpgCodeSelect.html'
        };
    };


    var ctrl = [
        '$scope', '$http', function ($scope, $http) {

            var lookupUrl = "~/api/Lookup/Codes/{key}";
            var lookupByIdUrl = "~/api/Lookup/CodeById/{key}/{id}";
            var lookupByNameUrl = "~/api/Lookup/CodeByName/{key}";
            var allRecordsLoaded = false;
            var masterList = [];

            $scope.list = [];

            $scope.placeHolderText = $scope.placeHolderText || $scope.codeType;

            $scope.onSelect = function (item) {
                if (item) {
                    $scope.codeId = item.id;
                    $scope.code = item.code;
                    $scope.ngModel = item;
                } else {
                    $scope.codeId = null;
                    $scope.code = null;
                    $scope.ngModel = null;
                }
                
                $scope.ngChange();
            };

            // $scope contains Id, Name, Facility
            $scope.filterRecords = function(filter) {
                var minChars = 2;
                if ((!$scope.loadAllRecords && filter.length >= minChars) ||
                ($scope.loadAllRecords && !allRecordsLoaded)) {
                    $http.post(lookupUrl, { FilterText: filter })
                        .success(function(data) {
                            masterList = data;
                            $scope.list = data;
                            allRecordsLoaded = $scope.loadAllRecords;
                        });
                }
            };

            $scope.clearSelected = function() {
                $scope.onSelect(null);
            };

            var activate = function () {

                lookupUrl = lookupUrl.replace('{key}', $scope.codeType);
                lookupByIdUrl = lookupByIdUrl.replace('{key}', $scope.codeType).replace('{id}', $scope.codeId);
                lookupByNameUrl = lookupByNameUrl.replace('{key}', $scope.codeType);

                if (angular.isObject($scope.ngModel)) {

                    $scope.list = [$scope.ngModel];

                }
                    // id and code was passed... we do not need to query the backend.
                else if (angular.hasValue($scope.codeId) && $scope.codeId.length > 0
                        && angular.hasValue($scope.code) && $scope.code.length > 0) {
                    var item = { id: $scope.codeId, code: $scope.code };
                    $scope.list = [item];
                    $scope.ngModel = item;
                } else if (angular.hasValue($scope.codeId) && $scope.codeId.length > 0) {

                    $http.post(lookupByIdUrl).success(function (data) {
                        $scope.list = [data];
                        $scope.ngModel = data;
                    });

                } else if (angular.hasValue($scope.code) && $scope.code.length > 0) {

                    $http.post(lookupByNameUrl, { FilterText: $scope.code }).success(function (data) {
                        $scope.list = [data];
                        $scope.ngModel = data;
                    });
                }

            };

            activate();

            $scope.$watch("ngModel", function (newValue, oldValue) {
                //This is a temporary hack, right now a clone of ngModel is created in the child scope which is not getting
                //updated when user reset the model on actual UI controller(For example PartsAdminDetailController). That is why we are 
                //updating child scoper ngModel.
                if ($scope.$$childHead.hasOwnProperty("ngModel"))
                    $scope.$$childHead.ngModel = newValue;
            });

        }

    ];



    angular.module(appName).directive(directiveName, directive);
    angular.module(appName).controller(ctrlName, ctrl);

})();