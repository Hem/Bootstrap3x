(function () {

    'use strict';
    var appName = 'app';
    var ctrlName = 'IpgPersonsViewController';
    var directiveName = 'ipgPersonsView';

    var ctrl = ['$scope',
        function ($scope) {
            var self = $scope;
            self.list = [];
            self.ngModel = [];

            self.$watchCollection('ngModel', function () {
                self.list = self.ngModel;
            });

        }
    ];

    var directive = function () {
        return {
            restrict: 'E', // this is an element
            replace: false,
            require: ['ui.select'],
            scope: {
                ngModel: '='
            },

            controller: ctrlName,
            templateUrl: '~/App/Core/Views/IpgPersonsView.html'
        };
    };

    angular.module(appName).directive(directiveName, directive);
    angular.module(appName).controller(ctrlName, ctrl);

})();