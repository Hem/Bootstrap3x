(function(angular, myApp) {

    'use strict';

    var module = angular.module('common', []);


    module.config(function($provide, $httpProvider) {
        /// rewrite the url
        $httpProvider.interceptors.push(function ($q, $log, APP_CONSTANTS) {
            return {

                'request': function (config) {

                    var jsVersion = APP_CONSTANTS.app_version_number;
                    var url = config.url;
                    
                    if (config.url.startsWith('~/App')) {
                        if (config.url.endsWith('.html'))
                            config.url = config.url.replace('.html', '.html?' + jsVersion);
                        if (config.url.endsWith('.js'))
                            config.url = config.url.replace('.js', '.js?' + jsVersion);
                    }

                    config.url = config.url.replace('~/', myApp.rootPath);

                    //$log.info("URL:", url, config.url);

                    return config;
                },

                //, 'response': function(response) {
                //    return response;
                //}

                // global error logging!
                'responseError': function(rejection) {
                    $log.error("HTTP ERROR", rejection);
                    return $q.reject(rejection);
                }

            };
        });
    });


    // -------------------------------------------------- //
    // -------------------------------------------------- //


    // I define an asynchronous wrapper to the native alert() method. It returns a 
    // promise that will be resolved in a future tick of the event loop.
    // --
    // NOTE: This promise will never be "rejected" since there is no divergent 
    // behavior available to the user with the alert() method.
    module.factory(
        "alert",
        function ($window, $q) {

            // Define promise-based alert() method.
            function alert(message) {

                var defer = $q.defer();

                $window.alert(message);

                defer.resolve();

                return (defer.promise);

            }

            return (alert);

        }
    );


    // I define an asynchronous wrapper to the native prompt() method. It returns a
    // promise that will be "resolved" if the user submits the prompt; or will be
    // "rejected" if the user cancels the prompt.
    module.factory(
        "prompt",
        function ($window, $q) {

            // Define promise-based prompt() method.
            function prompt(message, defaultValue) {

                var defer = $q.defer();

                // The native prompt will return null or a string.
                var response = $window.prompt(message, defaultValue);

                if (response === null) {

                    defer.reject();

                } else {

                    defer.resolve(response);

                }

                return (defer.promise);

            }

            return (prompt);

        }
    );


    // I define an asynchronous wrapper to the native confirm() method. It returns a
    // promise that will be "resolved" if the user agrees to the confirmation; or 
    // will be "rejected" if the user cancels the confirmation.
    module.factory(
        "confirm",
        function ($window, $q) {

            // Define promise-based confirm() method.
            function confirm(message) {

                var defer = $q.defer();

                // The native confirm will return a boolean.
                if ($window.confirm(message)) {

                    defer.resolve(true);

                } else {

                    defer.reject(false);

                }

                return (defer.promise);

            }

            return (confirm);

        }
    );




    // vmHelpers!
    module.factory('viewModelHelper', function($http, $q, $window, $location) {
        return myApp.viewModelHelper($http, $q, $window, $location);
    });



    module.directive('convertToNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(val) {
                    return parseInt(val, 10);
                });
                ngModel.$formatters.push(function(val) {
                    return '' + val;
                });
            }
        };
    });


    
    module.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter, { $event: event });
                    });
                    event.preventDefault();
                }
            });
        };
    });

    module.directive('dateField', function ($filter) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelController) {
                ngModelController.$parsers.push(function (data) {
                    //View -> Model
                    var date = Date.parseExact(data, 'yyyy-MM-dd');
                    ngModelController.$setValidity('date', date != null);
                    return date;
                });
                ngModelController.$formatters.push(function (data) {
                    //Model -> View
                    return $filter('date')(data, "yyyy-MM-dd");
                });
            }
        }
    });


    // needs 
    module.filter('sumByProperty', function() {
        return function(records, varName) {
            return _.sum(records, varName);
        }
    });



    module.filter('asYesNo', function () {
        return function (text, yesText, noText) {

            if (!angular.hasValue(text)) return '-';

            if (text) {
                return yesText || 'Yes';
            }
            return noText || 'No';
        }
    });

    module.filter('productType', function() {
        return function (text) {
            if (!text) return text;
            return text.replace("Commercial", "Com");
        }
    });

    module.filter('greaterThan', function() {
        return function(value, greaterThanValue) {
            return value > greaterThanValue;
        };
    });

   module.directive('ignoreDirty', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$setPristine = function () { };
                ctrl.$pristine = false;
            }
        }
    }]);

    /**
     * A convenience method for detecting a legitimate non-null value.
     * Returns false for null/undefined/NaN/Infinity, true for other values,
     * including 0/false/''
     * @method isValue
     * @static
     * @param o The item to test.
     * @return {boolean} true if it is not null/undefined/NaN || false.
     */
    angular.hasValue = function (val) {
        return !(val === null || !angular.isDefined(val) || (angular.isNumber(val) && !isFinite(val)));
    };


})(angular, window.MyApp);