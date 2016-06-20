(function() {

    'use strict';

    angular.module('app')
        .config(function ($urlMatcherFactoryProvider, $stateProvider) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);


            $stateProvider
                .state('home', {
                    url: '',
                    templateUrl: '/Views/Home/Home.html'
                });

        });


})();