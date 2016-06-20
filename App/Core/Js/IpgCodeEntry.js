(function () {

    'use strict';

    var appName = "app";
    var directiveName = "ipgCodeEntry";
    var ctrlName = "ipgCodeEntryController";
    

    var directive = function () {
        return {
            restrict: 'E', // this is an element
            replace: true,
            scope: {
                ngModel: '='
                , codeDescription: '=codeDescription' // code-name=""
                , codeLookupUrl: '=codeLookupUrl'
                , placeHolderText: '@placeHolderText'
            },
            controller: ctrlName,
            templateUrl: '~/App/Core/Views/IpgCodeEntry.html'
        };
    };


    var ctrl = [
        '$scope', '$http',
        function ($scope, $http) {

            $scope.onCodeChange = function (code) {
                $scope.Name = "";

                if (angular.hasValue(code)) {

                    $http.post( $scope.codeLookupUrl , { code: code })

                        .success(function (data) {
                            if (angular.isObject(data) && angular.hasValue(data.code)
                                    && data.code.toLowerCase() === code.toLowerCase()) {
                                $scope.ngModel = data.code;
                                $scope.codeDescription = data.description;
                            } else {
                                $scope.ngModel = null;
                                $scope.codeDescription = "Please check the diagnostic code [" + code + "]";
                            }
                        }).then(function () {

                        });
                }
            };

            var activate = function () {
                // $log.info(ctrlName + ' Activated', $scope);
            };

            activate();
        }];


    angular.module(appName).directive(directiveName, directive);

    angular.module(appName).controller(ctrlName, ctrl);
})();