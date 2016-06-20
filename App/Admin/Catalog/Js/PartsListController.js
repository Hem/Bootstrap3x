(function () {

    'use strict';

    var module = 'app';
    var controllerName = 'PartsListController';

    var ctrl = [
        '$scope', 'PartModel', '$cookieStore', '$state', 'Notification', 'IpgVariables', 'IpgDialog', 'currentUser',
        function ($scope, partModel, $cookieStore, $state, notification, ipgVariable, ipgDialog, currentUser) {
            var self = $scope;
            self.partModel = partModel;
            self.state = $state;
            self.ipgVariables = ipgVariable;
            self.currentUser = currentUser;
            self.notification = notification;
            self.ipgDialog = ipgDialog;

            self.searchParts = function () {
                $cookieStore.put('searchPartsByPartNumber', self.partModel.params.partNumber);
                $cookieStore.put('searchPartsByPartName', self.partModel.params.partName);
                $cookieStore.put('searchPartsByManufacturer', self.partModel.params.mfrName);
                $cookieStore.put('searchPartsByHcpcs', self.partModel.params.hcpcs);
                $cookieStore.put('searchPartsByCategory', self.partModel.params.category);

                self.partModel.LoadPartsList();
            };

            self.$watch('partModel.params.pageSize', function (newVal, oldVal) {
                if (self.partModel.partsList.length) self.partModel.LoadPartsList();
            });

            self.refreshList = function () {
                if (self.partModel.params.partNumber
                    || self.partModel.params.partName
                    || self.partModel.params.mfrName
                    || self.partModel.params.hcpcs
                    || self.partModel.params.category) {
                    self.partModel.LoadPartsList();
                }
                self.state.go('Part');
            };

            var getSortOrder = function (requestedOrderByField) {
                var currentSortOrder = $cookieStore.get('PartFieldSortOrder');

                var sortOrder = 'ASC';
                var currentSortField = $cookieStore.get('sortPartsBy');
                if (currentSortField === requestedOrderByField && currentSortOrder === 'ASC') {
                        sortOrder = 'DESC';
                }

                return sortOrder;
            };

            self.sortBy = function (orderBy) {
                self.partModel.params.orderBy = orderBy;
                self.partModel.params.sortOrder = getSortOrder(orderBy);

                $cookieStore.put('sortPartsBy', orderBy);
                $cookieStore.put('PartFieldSortOrder', self.partModel.params.sortOrder);
                self.partModel.LoadPartsList();
            };

            self.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams, options) {

                    if (self.ipgVariables.hasUnsavedData === true) {
                        event.preventDefault();
                        var title = 'You have unsaved changes.';
                        var message = 'Are you sure you want to leave?';

                        self.ipgDialog.showConfirm(title, message).then(function () {
                            self.ipgVariables.hasUnsavedData = false;
                            self.state.go(toState.name, toParams);
                        });
                    }

                });

            //when page refresh
            window.onbeforeunload = function (event) {
                if (self.ipgVariables.hasUnsavedData) {
                    return "You have unsaved Changes.";
                }

                return;
            };


            self.$on('$destroy', function () {
                window.onbeforeunload = undefined;
            });

            function initialize() {
                self.partModel.params.orderBy = $cookieStore.get('sortPartsBy');
                self.partModel.params.partNumber = $cookieStore.get('searchPartsByPartNumber');
                self.partModel.params.partName = $cookieStore.get('searchPartsByPartName');
                self.partModel.params.mfrName = $cookieStore.get('searchPartsByManufacturer');
                self.partModel.params.hcpcs = $cookieStore.get('searchPartsByHcpcs');
                self.partModel.params.category = $cookieStore.get('searchPartsByCategory');
                self.partModel.params.sortOrder = $cookieStore.get('PartFieldSortOrder');

                self.refreshList();

            }

            initialize();
        }
    ];

    angular
        .module(module)
        .controller(controllerName, ctrl);

})();
