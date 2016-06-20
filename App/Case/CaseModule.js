(function() {

    'use strict';

    angular.module('app')
        .config(function ($urlMatcherFactoryProvider, $stateProvider) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);


            $stateProvider
                .state('case-search', {
                    url: '/search',
                    templateUrl: '~/App/Case/Search/Views/CaseSearch.html',
                    controller: 'CaseSearchController'
                })
                .state('case-intake', {
                    url: '/intake',
                    templateUrl: '~/App/Case/Intake/Views/CaseIntakeView.html',
                    controller: 'CaseIntakeController'
                });

        });


})();