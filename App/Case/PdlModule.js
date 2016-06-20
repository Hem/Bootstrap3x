(function() {

    'use strict';

    angular.module('app')
        .config(function ($urlMatcherFactoryProvider, $stateProvider) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);

            $stateProvider               
                .state('pdl-view', {
                    url: '/:ppId/:pdlMode',
                    templateUrl: '~/App/Case/Pdl/Views/CasePdlView.html',
                    controller: 'CasePdlController',
                    data: {
                        css: '/App/Case/Pdl/Style/CasePdlStyle.css'
                    }
                });
        });


})();