(function () {
    "use strict";

    var ctrlName = 'TestPageController';

    var pageController = ['$scope', function($scope) {
        
        var self = $scope;

        self.selectedItem = {};

    }];

    angular.module('app').controller(ctrlName, pageController);


    // <print-test-records>
    angular.module('app').directive('printTestRecords',
        function () {
            return {
                restrict: 'E', // this is an element
                replace: true,
                controller: ['$scope', function ($scope) {
                    var self = $scope;

                    self.records = [];

                    self.noOfRecords = self.noOfRecords || -1;

                    self.selectMe = function(item) {
                        self.ngModel = item;
                    };

                    var activate = function () {

                        for (var i = 0; i < self.noOfRecords; i++) {
                            self.records.push({ id: i, name: 'Test Name' + i });
                        }
                    };
                    activate();

                }],
                scope: {
                    ngModel: '=',
                    noOfRecords: '='
                },
                templateUrl: '~/app/Test/Views/TestView_View.html'
            };
        }
    );


})();