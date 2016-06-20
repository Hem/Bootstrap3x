(function () {

    'use strict';

    var appName = 'app';
    var ctrlName = 'ipgPrivilegeSelectCtrl';
    var directiveName = 'ipgPrivilegeSelect';
    var placeHolderText = 'Please select an Privilege';

    var directive = function () {
        return {
            restrict: 'E', // this is an element
            replace: false,
            require: ['ui.select'],
            scope: {
                  ngModel: '='
                  , ngChange: '&'
                , privilegeId: '=privilegeId'
            },
            controller: ctrlName,
            templateUrl: '~/App/Core/Views/IpgPrivilegeSelect.html'
        };
    };

    var ctrl = [
        '$scope', '$http', 
        function ($scope, $http) {

            var lookupUrl = "~/api/Privileges";
            
            // data list
            $scope.list = [];

            $scope.placeHolderText = placeHolderText;

            $scope.getGroupByName = function(item) {
                return " **** " + item.module.name + " **** ";
            }

            $scope.onSelect = function (item) {
                $scope.ngModel = item;
                $scope.privilegeId = item.id;
            };

            $scope.$watch("ngModel", function (newValue, oldValue) {
                //This is a temporary hack, right now a clone of ngModel is created in the child scope which is not getting
                //updated when user reset the model on actual UI controller(For example PartsAdminDetailController). That is why we are 
                //updating child scoper ngModel.
                if ($scope.$$childHead.hasOwnProperty("ngModel"))
                    $scope.$$childHead.ngModel = newValue;
            });

            var activate = function () {
                $http.get(lookupUrl).success(function(data) {
                    $scope.list = data;
                });
            };

            activate();
        }
    ];

    

    angular.module(appName).directive(directiveName, directive);
    angular.module(appName).controller(ctrlName, ctrl);

})();