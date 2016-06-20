(function() {
    'use strict';
    var controllerName = 'UserListController';

    var userListController = [
        '$scope', 'userService', function ($scope, userService) {
            var self = $scope;
            self.userResponse = {};
            self.param = {
                FilterText: '',
                PageIndex: 1,
                PageSize: 15
            };

            //var getDefaultFilter = function() {
            //    return{
            //        FilterText: '',
            //        PageIndex: 1,
            //        PageSize: 15
            //    };
            //};

            self.loadUsers = function (filter) {
                userService.getUsers(filter).then(function(data) {
                    self.userResponse = data;
                });
            };

            self.filterUsers = function () {
                //var filter = getDefaultFilter();
                //filter.FilterText = self.userFilterText;
                self.loadUsers(self.param);
            };

            self.clearFilter = function() {
                //self.userFilterText = "";
                //var filter = getDefaultFilter();
                self.param.FilterText = "";
                self.loadUsers(self.param);
            };

            var activate = function () {
                //var filter = getDefaultFilter();
                self.loadUsers(self.param);
            };

            activate();
        }
    ];
    
    angular.module('app').controller(controllerName, userListController);

})();