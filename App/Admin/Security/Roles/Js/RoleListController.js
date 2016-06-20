(function () {
    "use strict";

    var ctrlName = 'RoleListController';


    var ctrl = [ '$scope', 'RolesAdminModel',
        function ($scope, model) {
            $scope.model = model;
            
            var activate = function () {
                $scope.model.loadRoles();
            };

            activate();
        }
    ];


    angular
        .module('app')
            .controller(ctrlName, ctrl);


})();