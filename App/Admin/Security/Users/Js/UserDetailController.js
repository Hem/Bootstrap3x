(function () {
    var controllerName = 'UserDetailController';
    var userDetailController = ['userService', '$scope', '$stateParams', 'RolesAdminModel', '$filter', 'Notification', function (userService, $scope, $stateParams, rolesAdminModel, $filter, notification) {
        var self = $scope;
        self.user = {};
        self.userRole = {};
        self.userRole.startDateTime = new Date();
        self.userRole.endDateTime = '12/31/2050';
        self.roleservice = rolesAdminModel;
        self.addedRoles = [];
        self.deletedRoles = [];
        self.updatedRoles = [];
        self.userId = $stateParams.userId;

        var loadRoles = function () {
            self.roleservice.loadRoles();
        };

        var loadDetail = function () {
            userService.getUserDetail(self.userId).then(function (data) {
                self.user = data;
                angular.forEach(self.user.userRoles, function(value) {
                    value.editMode = false;
                });
            });
        };

        var notExist = function () {
            var exist = false;
            angular.forEach(self.addedRoles, function (value) {
                if (value.role.id === self.userRole.role.id) {
                    exist = true;
                }
            });

            angular.forEach(self.user.userRoles, function (value) {
                if (value.roleId === self.userRole.role.id) {
                    exist = true;
                }
            });

            return !exist;
        };

        self.addRole = function () {
            if (notExist()) {
                var tempRole = angular.copy(self.userRole);
                tempRole.startDateTime = $filter('date')(new Date(self.userRole.startDateTime), 'MM/dd/yyyy');
                tempRole.endDateTime = $filter('date')(new Date(self.userRole.endDateTime), 'MM/dd/yyyy');

                self.addedRoles.push(tempRole);
            }
        };

        self.onSelect = function (role) {
            self.userRole.role = role;
            self.userRole.startDateTime = new Date();
            self.userRole.endDateTime = '01/01/2050';
        };

        self.deleteRole = function (deletedRole) {
           
                angular.forEach(self.user.userRoles, function (value, index) {
                    if (value.roleId === deletedRole.role.id) {
                        self.user.userRoles.splice(index, 1);
                        self.deletedRoles.push(deletedRole);
                    }
                });
        
                angular.forEach(self.addedRoles, function (value, index) {
                    if (value.role.id === deletedRole.role.id) {
                        self.addedRoles.splice(index, 1);
                    }
                });
        };

        var saveUpdatedRoles = function() {
            if (self.updatedRoles.length) {
                userService.updateUserRoles(self.updatedRoles, self.userId).then(function () {
                    notification.success('Successfully updated Roles for: ' + self.user.firstName + ', ' + self.user.lastName);
                    self.updatedRoles = [];
                    loadDetail();
                }, function (reason) {
                    self.updatedRoles = [];
                    notification.error('Error while updating Roles: ' + reason);
                });
            }
        };

        var saveDeletedRoles = function() {
            if (self.deletedRoles.length) {
                userService.deleteUserRoles(self.deletedRoles).then(function() {
                    notification.success('Successfully deallocated Roles from: ' + self.user.firstName + ', ' + self.user.lastName).then(function() {
                        self.deletedRoles = [];
                        loadDetail();
                    });
                }, function(reason) {
                    self.deletedRoles = [];
                    notification.error('Error while deallocating Roles: ' + reason);
                });
            }
        };

        var saveAddedRoles = function () {
            if (self.addedRoles.length) {
                userService.createUserRoles(self.addedRoles, self.userId).then(function () {
                    notification.success('Successfully added new Roles for: ' + self.user.firstName + ', ' + self.user.lastName);
                    self.addedRoles = [];
                    loadDetail();
                }, function (reason) {
                    self.addedRoles = [];
                    notification.error('Error while adding Roles: ' + reason);
                });
            }
        }

        self.saveUserRoles = function () {
            saveAddedRoles();
            saveDeletedRoles();
            saveUpdatedRoles();
        };

        self.editRole = function (editedRole) {
            editedRole.editMode = true;
            angular.forEach(self.user.userRoles, function(value) {
                if (value.roleId === editedRole.roleId) {
                    self.updatedRoles.push(editedRole);
                }
            });
        };

        var loadData = function () {
            loadDetail();
            loadRoles();
        }

        loadData();

    }];

    angular.module('app').controller(controllerName, userDetailController);
})();