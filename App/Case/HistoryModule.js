(function() {

    'use strict';

    angular.module('app')
        .config(function($urlMatcherFactoryProvider, $stateProvider) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);


            $stateProvider
                .state('history-view', {
                    url: '/:ppId',
                    templateUrl: '~/App/Case/History/Views/CaseHistoryView.html',
                    controller: 'CaseHistoryController'
                })
                .state('history-snapshot-view', {
                    url: '/snapshot/:ppId/:snapshotId',
                    templateUrl: '~/App/Case/History/Views/CaseSnapshotView.html',
                    controller: 'CaseSnapshotController'
                });
        });


})();