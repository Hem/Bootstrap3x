(function() {
    'use strict';

    var directiveName = 'maxDigits';

    var directive = [function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {
                    attrs.$set("ngTrim", "false");
                    var maxlength = parseInt(attrs.inputMax, 10);
                   
                    ctrl.$parsers.push(function (value) {
                        if (value != null) {
                            var stringValue = value.toString();
                            if (stringValue.length > maxlength) {
                                stringValue = stringValue.substr(0, maxlength);
                                value = stringValue;
                                ctrl.$setViewValue(value);
                                ctrl.$render();
                            }
                        }

                        return value;
                    });
                }
            };
        }
    ];


    angular.module('app').directive(directiveName, directive);

})();