(function() {

    'use strict';

    angular.module('app')
        .config(function($urlMatcherFactoryProvider, $stateProvider) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);

            $stateProvider
                .state('estimate-view', {
                    url: "/:ppId",
                    templateUrl: '~/App/Case/Estimate/Views/CalcRevEstimateView.html',
                    controller: "EstimatedCalcRevController"
                });
        });
})();