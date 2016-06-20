(function () {
    'use strict';

    var directiveName = 'ipgWholeNumber';

    var directive = [
        function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attrs, ctrl) {
                    if (!ctrl) {
                        return;
                    }

                    ctrl.$parsers.push(function (value) {
                        if (value == null) {
                            value = '';
                        }
                        var clean = value.toString().replace(/[^0-9]+/g, '');

                        if (value !== clean) {
                            ctrl.$setViewValue(clean);
                            ctrl.$render();
                        }
                        return clean;

                    });

                    elem.bind('keypress', function (event) {
                        if (event.keyCode === 32) {
                            event.preventDefault();
                        }
                    });
                }
            };
        }
    ];


    angular.module('app').directive(directiveName, directive);

})();