(function () {

    'use strict';

    var app = angular.module('app',
        ['common', 'ui.router', 'ngSanitize', 'ui.bootstrap', 'ui.select', 'mgo-angular-wizard', 'ui-notification', 'uiRouterStyles', 'angular-flippy', 'ngMessages', 'ngAnimate', 'ngCookies', 'fiestah.money', 'ngMaterial', 'angular.filter', 'angularFileUpload']
    );
    // needs 
    app.filter('ipgReplaceConstants', ['APP_CONSTANTS',
        function (constants) {
            return function (text) {
                for (var key in constants) {
                    if (constants.hasOwnProperty(key)) {
                        var value = constants[key];
                        text = text.replace("{" + key + "}", value);
                    }
                }
                return text;
            }
        }
    ]);

    //Due to github issue https://github.com/angular-ui/bootstrap/issues/3633 in 1.4.0
    //we need to disable animation for modal provider.
    //Source: http://stackoverflow.com/questions/30653416/modalinstance-dialog-box-closes-but-screen-remains-grayed-out-and-inaccessible
    app.config([
        '$modalProvider', '$httpProvider', function ($modalProvider, $httpProvider) {
            $modalProvider.options.animation = false;
            $httpProvider.interceptors.push('HttpInterceptor');
        }
    ]);


    app.factory('HttpInterceptor',
        function () {
            var httpInterceptor = {
                'responseError': function (rejection) {
                    console.log(rejection);
                    if (rejection.status === 500) {
                        //window.alert("An Error Occured, Please Contact an Administrator!!!");
                    }
                },

                'request': function (request) {

                    if (request.url.contains('undefinedapi')) {
                        request.url = request.url.replace('undefinedapi', '/api');

                    }
                    if (request.url.contains('undefinedapp')) {
                        request.url = request.url.replace('undefinedapp', '/App');

                    }

                    if (request.url.contains('undefinedApp')) {
                        request.url = request.url.replace('undefinedApp', '/App');

                    }

                    return request;
                }
            };

            return httpInterceptor;
        }
    );

})();