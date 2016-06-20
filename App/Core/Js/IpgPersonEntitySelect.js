(function () {

    'use strict';

    var appName = 'app';
    var ctrlName = 'ipgPersonEntitySelectCtrl';
    var directiveName = 'ipgPersonEntitySelect';
    var placeHolderText = 'Please select an entity';

    var ctrl = [
        '$scope', '$http',
        function ($scope, $http) {

            // var self = $scope;
            var lookupUrl = "";
            var lookupIdUrl = "";

            $scope.list = [];
            $scope.placeHolderText = $scope.placeHolderText || placeHolderText;

            $scope.onSelect = function(item /*, model*/) {
                if (item) {
                    $scope.entityId = item.id;
                    $scope.ngModel = item;
                } else {
                    $scope.entityId = null;
                    $scope.ngModel = null;
                }
                $scope.ngChange();
            };

            $scope.list = [];


            // $scope contains Id, Name, Facility
            $scope.filterRecords = function (filter) {

                var minChars = ($scope.minCharsToFilter || 2);

                if (filter.length > minChars) {
                    $http.post(lookupUrl, { FilterText: filter })
                        .success(function (data) {
                            $scope.list = data;
                        });
                }

            };

            $scope.clearSelected = function () {
                $scope.onSelect(null);
            };

            var activate = function () {

                lookupUrl = "~/api/Lookup/PersonByName/" + $scope.entityType + "/";
                lookupIdUrl = "~/api/Lookup/PersonById/" + $scope.entityType + "/";

                if (angular.isObject($scope.ngModel)) {

                    $scope.list = [$scope.ngModel];

                } else if (angular.hasValue($scope.entityId) && $scope.entityId.length > 0) {

                    $http.post(lookupIdUrl + $scope.entityId).success(function (data) {
                        $scope.list = [data];
                        $scope.ngModel = data;
                    });
                }
            };

            activate();

            $scope.$watch("ngModel", function (newValue) {
                //This is a temporary hack, right now a clone of ngModel is created in the child scope which is not getting
                //updated when user reset the model on actual UI controller(For example PartsAdminDetailController). That is why we are 
                //updating child scoper ngModel.
                if ($scope.$$childHead.hasOwnProperty("ngModel")) {
                    $scope.$$childHead.ngModel = newValue;
                }
            });
        }
    ];

    var directive = function () {
        return {
            restrict: 'E', // this is an element
            replace: false,
            require: ['ui.select'],

            scope: {
                ngModel: '='
                , entityId: '=entityId'
                , entityType: '@entityType'             // One way
                , placeHolderText: '@placeHolderText'   // One way
                , minCharsToFilter: '@minCharsToFilter' // One way
                , ngChange: '&'                         // Expression
            },

            controller: ctrlName,
            templateUrl: '~/App/Core/Views/IpgPersonSelect.html'
        };
    };

    angular.module(appName).directive(directiveName, directive);
    angular.module(appName).controller(ctrlName, ctrl);

})();