(function() {

    'use strict';

    var appName = 'app';
    var ctrlName = 'ipgSortableTableHeaderCtrl';
    var directiveName = 'ipgSortableTableHeader';

    var directive = [
        function() {
            return {
                restrict: 'AE',
                replace: true,
                controller: ctrlName,
                scope: {
                    headerText: '@headerText',
                    fieldName: '@fieldName',
                    sortBy: '=',
                    reverse: '='
                },
                templateUrl: '~/App/Core/Views/IpgSortableTableHeader.html'
            };
        }
    ];

    var ctrl = [
        '$scope', '$element',
        function($scope, $element) {
            $element.on('click', function() {
                if ($scope.sortBy !== $scope.fieldName) {
                    $scope.reverse = false;
                } else {
                    $scope.reverse = !$scope.reverse;
                }
                $scope.sortBy = $scope.fieldName;
                $scope.$apply();
            });
        }
    ];

    angular.module(appName).controller(ctrlName, ctrl);
    angular.module(appName).directive(directiveName, directive);

})();