(function() {

    'use strict';

    angular.module('app')
        .config(function($urlMatcherFactoryProvider, $stateProvider) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);


            $stateProvider
                .state('estimate-history-view', {
                    url: '/:ppId',
                    templateUrl: '~/App/Case/Estimate/History/Views/EstimateCaseHistoryView.html',
                    controller: 'EstimateCaseHistoryController'
                })
                .state('estimate-history-snapshot-view', {
                    url: '/snapshot/:ppId/:snapshotId',
                    templateUrl: '~/App/Case/Estimate/History/Views/EstimateCaseSnapshotView.html',
                    controller: 'EstimateCaseSnapshotController'
                });
        });


})();