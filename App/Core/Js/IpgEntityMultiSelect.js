(function () {

    'use strict';
    var appName = 'app';
    var ctrlName = 'IpgEntityMultiSelectController';
    var directiveName = 'ipgEntityMultiSelect';

    var ctrl = ['$scope', '$http',
        function ($scope, $http) {
            var self = $scope;
            self.selectedItems = [];
            self.ngModel = self.ngModel || [];
            self.list = [];
            var lookupUrl = "";

            self.$watchCollection('ngModel', function () {
                self.selectedItems = self.ngModel;
            });

            var filterExistingData = function (data) {
                angular.forEach(data, function(dataValue, dataIndex) {
                    var found = false;
                    for (var i = 0; i < self.ngModel.length; i++) {
                        if (self.ngModel[i].id === dataValue.id) {
                            found = true;
                            break;
                        }
                    };

                    if (!found) self.list.push(dataValue);

                });
            };

            var loadRecords = function (params) {
                self.list = [];
                $http.post(lookupUrl, params)
                    .success(function (data) {
                        if (self.ngModel && self.ngModel.length) {
                            filterExistingData(data);
                        } else {
                            self.list = data;
                        }
                    });
            };

            self.onRemoveChoice = function(item) {
                angular.forEach(self.ngModel, function(value, index) {
                    if (item.id === value.id) {
                        self.ngModel.splice(index, 1);
                        self.ngChange();
                        return;
                    }
                });
            };

            self.onSelect = function (item) {
                self.ngModel = self.ngModel || [];
                if (item) {
                    self.ngModel.push(item);
                    self.ngChange();
                }
            };

            self.filterRecords = function(filter) {
                var minChars = (self.minCharsToFilter || 2);

                if (!self.loadAllRecords && filter.length > minChars) {
                    loadRecords({
                        FilterText: filter,
                        AssociatedEntityId: self.associatedEntityId,
                        AssociatedEntityType: self.associatedEntityType
                    });
                }
            };


            var activate = function () {
                self.selectedItems = self.ngModel || [];
                lookupUrl = "~/api/Lookup/ValueByName/" + self.entityType + "/";

                if (self.loadAllRecords) {
                    loadRecords({
                        FilterText: '',
                        AssociatedEntityId: self.associatedEntityId,
                        AssociatedEntityType: self.associatedEntityType
                    });
                }

            };

            activate();
        }
    ];

    var directive = function () {
        return {
            restrict: 'E', // this is an element
            replace: false,
            require: ['ui.select'],
            scope: {
                ngModel: '='
                , entityId: '='
                , entityName: '='
                , isDisabled: '='
                , entityType: '@'
                , placeHolderText: '@'
                , minCharsToFilter: '@'
                , ngChange: '&'
                , loadAllRecords: '@'
                , disabled: '='
                , associatedEntityId: '='
                , associatedEntityType: '@'
            },

            controller: ctrlName,
            templateUrl: '~/App/Core/Views/IpgEntityMultiSelect.html'
        };
    };

    angular.module(appName).directive(directiveName, directive);
    angular.module(appName).controller(ctrlName, ctrl);

})();