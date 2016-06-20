(function () {

    'use strict';

    var appName = 'app';
    var ctrlName = 'ipgEntitySelectCtrl';
    var directiveName = 'ipgEntitySelect';
    var placeHolderText = 'Please select an entity';


    var directive = function () {
        return {
            restrict: 'E', // this is an element
            replace: false,
            require: ['ui.select'],
            scope: {
                ngModel: '='
                , entityId: '=entityId'
                , entityName: '=entityName'
                , entityType: '@entityType'
                , placeHolderText: '@placeHolderText'
                , minCharsToFilter: '@minCharsToFilter'
                , ngChange: '&'
                , filterMetadata: '=filterMetadata'
                , loadAllRecords: '@loadAllRecords'
                , disabled: '=disabled'
                , required: '=required'
                , displayMember: '=displayMember'
                , associatedEntityId: '=associatedEntityId'
                , associatedEntityType: '@associatedEntityType'
                },

            controller: ctrlName,
            templateUrl: '~/App/Core/Views/IpgEntitySelect.html'
        };
    };

    var ctrl = [
        '$scope', '$http', /*'$log',*/
        function ($scope, $http /*, $log*/) {

            var lookupUrl = "";
            var lookupIdUrl = "";
            var allRecordsLoaded = false;

            // data list
            $scope.list = [];
            $scope.placeHolderText = $scope.placeHolderText || placeHolderText;
            $scope.displayMember = $scope.displayMember || 'name';

            $scope.onSelect = function(item) {
                if (item) {
                    $scope.entityId = item.id;
                    $scope.entityName = item.name;
                    $scope.ngModel = item;
                } else {
                    $scope.entityId = null;
                    $scope.entityName = null;
                    $scope.ngModel = null;
                }
            };
            
            $scope.clearSelected = function() {
                $scope.onSelect(null);
            };

            // $scope contains Id, Name, Facility
            $scope.filterRecords = function(filter) {

                var minChars = ($scope.minCharsToFilter || 2);

                if ((!$scope.loadAllRecords && filter.length > minChars) ||
                    ($scope.loadAllRecords && !allRecordsLoaded)) {
                    $http.post(lookupUrl, {
                             FilterText: filter, 
                             AssociatedEntityId: $scope.associatedEntityId, 
                             AssociatedEntityType: $scope.associatedEntityType, 
                             metadata: $scope.filterMetadata
                        })
                        .success(function(data) {
                            $scope.list = data;
                            allRecordsLoaded = $scope.loadAllRecords;
                        });
                }
            };

            $scope.$watch("filterMetadata", function() {
                $scope.list = [];
                allRecordsLoaded = false;
                $scope.filterRecords('');
            });

            var activate = function() {

                lookupUrl = "~/api/Lookup/ValueByName/" + $scope.entityType + "/";
                lookupIdUrl = "~/api/Lookup/ValueById/" + $scope.entityType + "/";


                if (angular.isObject($scope.ngModel)) {

                    $scope.list = [$scope.ngModel];

                } else if (angular.hasValue($scope.entityId) && $scope.entityId.length > 0) {

                    $http.post(lookupIdUrl + $scope.entityId).success(function(data) {
                        $scope.list = [data];
                        $scope.ngModel = data;
                    });
                } 
            };

            activate();

            $scope.$watch("ngModel", function(newValue) {
                //This is a temporary hack, right now a clone of ngModel is created in the child scope which is not getting
                //updated when user reset the model on actual UI controller(For example PartsAdminDetailController). That is why we are 
                //updating child scoper ngModel.
                if ($scope.$$childHead.hasOwnProperty("ngModel")) {
                    $scope.$$childHead.ngModel = newValue;
                }
                $scope.ngChange();
            });
        }
    ];  

    angular.module(appName).directive(directiveName, directive);
    angular.module(appName).controller(ctrlName, ctrl);

})();