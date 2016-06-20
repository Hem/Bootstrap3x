(function () {
    'use strict';

    var directiveName = 'checkDuplicateName';
    var controllerName = 'checkDuplicateNameController';


    var ctrl = [
    '$scope', '$http', '$q', function ($scope, $http, $q) {
        var self = $scope;

        self.validateName = function () {
            var url = '~/api/Validate/DuplicateName/PRICE_BOOK/' + self.name;
            var deffered = $q.defer();

            $http.get(url).then(function (response) {
                deffered.resolve(response.data);
            });

            return deffered.promise;
        };
    }
    ];

    var directive = [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            controller: controllerName,
            link: function (scope, elem, attrs, ctrl) {
                attrs.$set("ngTrim", "false");
                scope.name = elem.val();

                elem.on('blur', function (event) {
                    scope.name = elem.val();
                    ctrl.$setValidity('duplicate', true);

                    if (scope.name !== '') {
                        scope.validateName().then(function(response) {
                            if (response === true) {
                                ctrl.$setValidity('duplicate', false);
                                event.preventDefault();
                            } 
                        });
                    }

                });

            }
        };
    }
    ];




    angular.module('app').controller(controllerName, ctrl);
    angular.module('app').directive(directiveName, directive);

})();