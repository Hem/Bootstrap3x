(function () {
    'use strict';

    var module = 'app';
    var controllerName = 'PriceBookListController';
    var ctrl = [ '$scope', '$state', '$cookieStore', 'PriceBookModel', 'IpgDialog', 'currentUser', 'IpgVariables',
        function ($scope, $state, $cookieStore, priceBookModel, ipgDialog, currentUser,ipgVariables) {

            var self = $scope;
            
            self.model = priceBookModel;
            self.state = $state;
            self.currentUser = currentUser;
            self.ipgVariables = ipgVariables;

            self.$watch('model.params.pageSize', function() {
                self.model.loadPriceBookList();
            });

            var getSortOrderField = function() {
                return $cookieStore.get('sortPriceBookBy');
            };

            var getSortOrder = function(orderBy) {
                var currentSortOrder = $cookieStore.get('PriceBookFieldSortOrder');

                var sortOrder = 'ASC';
                var currentSortField = getSortOrderField();
                if (currentSortField === orderBy) {
                    if (currentSortOrder === 'ASC') {
                        sortOrder = 'DESC';
                    }
                }

                return sortOrder;
            };

            self.onBack = function() {
                window.history.back();
            };

            self.sortBy = function (orderBy) {
                self.model.params.orderBy = orderBy;
                self.model.params.sortOrder = getSortOrder(orderBy);

                $cookieStore.put('sortPriceBookBy', self.model.params.orderBy);
                $cookieStore.put('PriceBookFieldSortOrder', self.model.params.sortOrder);
                self.model.loadPriceBookList();
            };

            self.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams, options) {

                    if (self.ipgVariables.hasUnsavedData === true) {
                        event.preventDefault();
                        var title = 'You have unsaved changes.';
                        var message = 'Are you sure you want to leave?';

                        ipgDialog.showConfirm(title, message).then(function () {
                            self.ipgVariables.hasUnsavedData = false;
                            self.state.go(toState.name, toParams);
                        });
                    }

                });

            //when page refresh
            window.onbeforeunload = function(event) {
                if (self.ipgVariables.hasUnsavedData) {
                    return "You have unsaved Changes.";
                }

                return;
            };


            self.$on('$destroy', function () {
                window.onbeforeunload = undefined;
            });

            var activate = function() {
                self.model.params.orderBy = $cookieStore.get('sortPriceBookBy');
                self.model.params.sortOrder = $cookieStore.get('PriceBookFieldSortOrder');
            };

            activate();
        }
    ];
    
    angular
        .module(module)
        .controller(controllerName, ctrl);

})();
