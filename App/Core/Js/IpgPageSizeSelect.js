(function () {
    var controllerName = "ipgPageSizeSelectController";
    var directiveName = 'ipgPageSizeSelect';

    var partCtr = ['$scope', function ($scope) {
        var self = $scope;
            
            self.pageSizes = [10, 15, 20, 25, 50];

            self.onChange = function (pageSize) {
                self.ngModel = pageSize;
            };

        }
    ];

    var pageSizeDirective = function () {
        return {
            restrict: 'E',
            replace: false,
            require: ['ui.select'],
            scope: {
                ngModel: '='
            },

            controller: controllerName,
            templateUrl: '~/App/Core/Views/IpgPageSizeSelect.html'
        };
    };

    angular.module('app').controller(controllerName, partCtr);
    angular.module('app').directive(directiveName, pageSizeDirective);
})();