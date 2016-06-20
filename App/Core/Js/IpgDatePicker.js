(function () {
    "use strict";

    var appName = "app";
    var directiveName = "ipgDatePicker";
    var ctrlName = "ipgDatePickerController";


    var directive = function () {
        return {
            restrict: 'E', // this is an element
            replace: true,
            require: '?ngModel',
            scope: {
                ngModel: '=',
                name: '=name',
                disabled: '=disabled',
                greaterThan: '=greaterThan',
                lessThan: '=lessThan'
            },
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) return;

                ctrl.$validators.greaterThan = function (modelValue) {
                    return !attrs.greaterThan || (Date.parse(scope.greaterThan) < Date.parse(modelValue));
                };

                ctrl.$validators.lessThan = function (modelValue) {
                    return !attrs.lessThan || (Date.parse(scope.lessThan) > Date.parse(modelValue));
                };

                scope.$watch('greaterThan', function (newValue) {
                    if (attrs.greaterThan) {
                        if (Date.parse(newValue) > Date.parse(scope.ngModel)) {
                            ctrl.$setValidity('greaterThan', false);
                        } else {
                            ctrl.$setValidity('greaterThan', true);
                        }
                    }
                });

                scope.$watch('lessThan', function (newValue) {
                    if (attrs.lessThan) {
                        if (Date.parse(newValue) < Date.parse(scope.ngModel)) {
                            ctrl.$setValidity('lessThan', false);
                        } else {
                            ctrl.$setValidity('lessThan', true);
                        }
                    }
                });
            },
            controller: ctrlName,
            templateUrl: '~/App/Core/Views/IpgDatePicker.html'
        };
    };


    var ctrl = ['$scope', function ($scope) {
        $scope.isOpen = false;
        $scope.openDatePicker = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.isOpen = true;
        };
    }];

    angular.module(appName).directive(directiveName, directive);

    angular.module(appName).controller(ctrlName, ctrl);

})();

