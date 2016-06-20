(function () {
    var controllerName = "ipgPartSelectController";
    var directiveName = 'ipgPartSelect';

    var partCtr = [
        '$http', '$log', '$scope', function ($http, $log, $scope) {
            var self = $scope;
            self.list = [];

            self.onSelect = function (item) {
                if (item) {
                    self.ngModel = item;
                    self.onPartSelect({ selectedItem: item });
                } else {
                    self.ngModel = null;
                    self.list = null;
                }

            };
            var onError = function (reason) {
                $log.info(reason);
            };

            self.placeHolderText = self.placeHolderText || 'Search by part name or part number';

            self.filterRecords = function (filter) {
                var minChars = 2;
                var lookupUrl = "~/api/Lookup/Parts";
                if (filter.length >= minChars) {
                    $log.debug("input filtering state!");

                    $http.post(lookupUrl, {
                        FilterText: filter,
                        IncludeMainKitPart: self.includeMainKit,
                        AssociatedEntityId: self.associatedEntityId,
                        AssociatedEntityType: self.associatedEntityType
                    })
                        .then(function(response) {
                            self.list = response.data;
                        }, onError());
                }
            };

            self.$watch("ngModel", function (newValue) {
                //This is a temporary hack, right now a clone of ngModel is created in the child scope which is not getting
                //updated when user reset the model on actual UI controller(For example PartsAdminDetailController). That is why we are 
                //updating child scoper ngModel.
                if (self.$$childHead.hasOwnProperty("ngModel")) {
                    self.$$childHead.ngModel = newValue;
                }
                self.ngChange();
            });

            self.$watch('clearPart', function () {
                self.onSelect(null);
            });

        }
    ];

    var partDirective = function () {
        return {
            restrict: 'E',
            replace: false,
            require: ['ui.select'],
            scope: {
                ngModel: '='
               , ngChange: '&'
               , clearPart: '='
               , onPartSelect: '&'
               , includeMainKit: '='
               , associatedEntityId: '='
               , associatedEntityType: '@associatedEntityType'
               , placeHolderText: '='
            },

            controller: controllerName,
            templateUrl: '~/App/Core/Views/IpgPartSelect.html'
        };
    };

    angular.module('app').controller(controllerName, partCtr);
    angular.module('app').directive(directiveName, partDirective);
})();