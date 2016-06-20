 (function () {
    "use strict";

    var ctrlName = 'RolePrivsController';


    var ctrl = [
        '$scope', '$log', '$http', '$state', '$stateParams', 'Notification',
        function ($scope, $log, $http, $state, $stateParams, notification) {
            var loadPrivsInRole = null;
            var setRolePrivs = null;

            var mode = $stateParams.mode; // view, edit, add
            var roleId = $stateParams.roleId;


            var newRecord = function() {
                return {
                    "id": 0,
                    "roleId": roleId,
                    "privilegeId": 0,
                    "startDateTime": "01/01/2000",
                    "endDateTime": "12/31/2999",
                    "privilege": null,
                    "createdById": "",
                    isActive : true
                };
            };

            
            $scope.record = newRecord();
            $scope.records = [];
            $scope.refreshingRecords = false;
            $scope.anyPrivAdded = false;

            $scope.onAddPrivToRole = function() {
                $scope.records.push($scope.record);
                $scope.record = newRecord();
                $scope.anyPrivAdded = true;
            };

            $scope.onClickDelete = function (item) {
                item.isActive = false;
                if (item.id === 0) {
                    var i = $scope.records.indexOf(item);
                    if (i > -1) $scope.records.splice(i, 1);
                }
                $scope.anyPrivDeleted = true;
            };

            $scope.onClickUndelete = function (item) {
                item.isActive = true;
            };

            $scope.isSaveDisabled = function () {
                var isDirty = $scope.anyPrivAdded || $scope.anyPrivDeleted || $scope.privListForm.$dirty;
                return !isDirty || $scope.privListForm.$invalid;
            };

            $scope.onSavePrivsToDatabase = function () {
                // call save or delete routine..
                $scope.refreshingRecords = true;

                $http.post("~/api/Roles/" + roleId + "/Privileges", $scope.records)
                    .success(function (data) {
                        setRolePrivs(data);
                    }).then(function () {
                        $scope.refreshingRecords = false;
                        $scope.anyPrivAdded = false;
                        $scope.anyPrivDeleted = false;
                        notification.success("Updated! privileges were assigned to the role");
                    });;
            };

            // normalize data
            setRolePrivs = function (data) {
                data.forEach(function (i) {
                    i.isActive = true;
                    i.startDateTime = Date.parse(i.startDateTime.substring(0, 10));
                    i.endDateTime = Date.parse(i.endDateTime.substring(0, 10));
                });
                $scope.records = data;
            };

            // normalize data
            loadPrivsInRole = function (id) {
                $scope.refreshingRecords = true;
                $http.get("~/api/Roles/" + id + "/Privileges")
                    .success(function (data) {
                        setRolePrivs(data);
                    }).then(function () {
                        $scope.refreshingRecords = false;
                    });
            };


            var activate = function () {
                $log.info(ctrlName + ' Activated');
                loadPrivsInRole(roleId);
            };

            activate();
        }
    ];


    angular
        .module('app')
            .controller(ctrlName, ctrl);


})();