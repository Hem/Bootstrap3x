(function () {
    "use strict";

    var ctrlName = 'RoleDetailController';


    var ctrl = [
        '$scope', '$state', '$stateParams', 'Notification', 'RolesAdminModel',
        function ($scope, $state, $stateParams, notification, model) {

            var self = $scope;
            var mode = $stateParams.mode; // view, edit, add
            var roleId = $stateParams.roleId;


            self.model = model;
            

            $scope.onClickSave = function () {
                model.onRoleSave()
                    .then(function(response) {
                        if (mode === 'add') {
                            notification.success("Created!" + response.data.name);
                            $state.go("roleList.detail.privs", { roleId: response.data.id, mode: "edit" });
                        } else {
                            notification.success("Updated! " + response.data.name);
                        }
                    });
            };

            $scope.onClickDelete = function() {
                
            }




            var activate = function () {
                model.setMode(mode);
                model.loadRole(roleId);
            };

            activate();
        }
    ];


    angular
        .module('app')
            .controller(ctrlName, ctrl);


})();