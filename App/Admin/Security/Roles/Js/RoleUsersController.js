(function () {
    "use strict";

    var ctrlName = 'RoleUsersController';


    var ctrl = [
        '$scope', '$log', '$http', '$state', '$stateParams', 'Notification',
        function ($scope, $log, $http, $state, $stateParams, notification) {

            var mode = $stateParams.mode; // view, edit, add
            var roleId = $stateParams.roleId;
            var setRoleUsers = null;
            $scope.anyUserAdded = false;

            var getNewUser = function() {
                return {
                    "id": 0,
                    "userId": "",
                    "roleId": roleId,
                    "startDateTime": new Date(),
                    "endDateTime": "2999-12-31",
                    "user": null,
                    "isActive":true
                };
            }


            $scope.record = getNewUser();

            $scope.records = [];
            $scope.refreshingRecords = false;

            $scope.onAddUserToRole = function () {
                if ($scope.record.user == null) {
                    notification.error("Please reselect the user");
                    return;
                }

                $scope.records.push($scope.record);
                $scope.record = null;
                $scope.record = getNewUser();
                $scope.anyUserAdded = true;
            };

            $scope.onSaveUsersToDatabase = function() {
                $scope.refreshingRecords = true;
                $http.post("~/api/Roles/" + roleId + "/Users", $scope.records)
                    .success(function (data) {
                        setRoleUsers(data);
                    }).then(function () {
                        $scope.refreshingRecords = false;
                        $scope.anyUserAdded = false;
                        $scope.anyUserDeleted = false;
                        notification.success("Updated! users were assigned to the role");
                    });
            };

            $scope.onClickDelete = function (item) {
                item.isActive = false;
                if (item.id === 0) {
                    var i = $scope.records.indexOf(item);
                    if (i > -1) $scope.records.splice(i, 1);
                }
                $scope.anyUserDeleted = true;
            };

            $scope.onClickUndelete = function (item) {
                item.isActive = true;
            };

            $scope.isSaveDisabled = function() {
                var isDirty = $scope.anyUserAdded || $scope.anyUserDeleted|| $scope.userRoleListForm.$dirty;
                return !isDirty || $scope.userRoleListForm.$invalid;
            };

            setRoleUsers = function(data) {
                data.forEach(function (i) {
                    i.isActive = true;
                    i.startDateTime = Date.parse(i.startDateTime.substring(0, 10));
                    i.endDateTime = Date.parse(i.endDateTime.substring(0, 10));
                });

                $scope.records = data;
            };

            var loadPrivs = function () {
                $scope.refreshingRecords = true;
                $http.get("~/api/Roles/" + roleId + "/Users")
                    .success(function (data) {
                        setRoleUsers(data);
                    }).then(function () {
                        $scope.refreshingRecords = false;
                    });
            };


            var activate = function () {
                $log.info(ctrlName + ' Activated');
                loadPrivs();
            };

            activate();
        }
    ];


    angular
        .module('app')
            .controller(ctrlName, ctrl);


})();