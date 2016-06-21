(function() {

    'use strict';

    angular.module('app')
        .config(function($urlMatcherFactoryProvider, $stateProvider) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);

            $stateProvider
                .state('calc-rev-view', {
                    url: "",
                    templateUrl: '~/App/Case/CalcRev/Views/CalcRevView.html',
                    controller: "CaseController",
                    data: {
                        css: '/App/Case/CalcRev/Style/CalcRevView.css'
                    }
                });
        });
})();