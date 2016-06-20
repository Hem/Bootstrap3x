(function () {

    'use strict';
    var appName = 'app';
    var ctrlName = 'IpgPersonMultiSelectController';
    var directiveName = 'ipgPersonMultiSelect';

    var ctrl = ['$scope', '$http',
        function ($scope, $http) {
            var self = $scope;
            self.selectedPersons = [];
            self.ngModel = self.ngModel || [];
            self.loadAllRecords = self.loadAllRecords || false;
            self.list = [];
            var lookupUrl = "";

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

            self.$watchCollection('ngModel', function() {
                self.selectedPersons = self.ngModel;
            });
            
            var loadRecords = function (params) {
                $http.post(lookupUrl, params)
                    .success(function (data) {
                        if (self.ngModel && self.ngModel.length) {
                            filterExistingData(data);
                        } else {
                            self.list = data;
                        }
                    });
            };

            self.onSelect = function (item) {
                if (item) {
                    self.ngModel.push(item);
                    self.ngChange();
                }
            };

            self.onRemoveChoice = function (item) {
                angular.forEach(self.ngModel, function (value, index) {
                    if (item.id === value.id) {
                        self.ngModel.splice(index, 1);
                        self.ngChange();
                    }
                });
            };

            self.filterRecords = function (filter) {

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
                self.selectedPersons = self.ngModel || [];
                lookupUrl = "~/api/Lookup/PersonByName/" + self.entityType + "/";

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
            replace: true,
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
                , onDelete:'&'
                , loadAllRecords: '@'
                , disabled: '='
                , associatedEntityId: '='
                , associatedEntityType: '@'
            },

            controller: ctrlName,
            templateUrl: '~/App/Core/Views/IpgPersonMultiSelect.html'
        };
    };

    angular.module(appName).directive(directiveName, directive);
    angular.module(appName).controller(ctrlName, ctrl);

})();