(function() {
    
    "use strict";

    angular.module('app')
        .config(function ($urlMatcherFactoryProvider, $stateProvider /*, $urlRouterProvider, $locationProvider*/) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);


            // when the route is /parts redirect to list!  
            // $urlRouterProvider.when('/CatalogAdmin/Index', '/CatalogAdmin');

            $stateProvider
                .state('carrierRuleGroups', {
                    url: '/CarrierRuleGroups',
                    templateUrl: '~/App/Admin/Carrier/RuleGroups/Views/ListView.html',
                    controller: 'CarrierRuleGroupListController'
                })

                .state('carrierRuleGroups.detail', {
                    url: '/:mode/:id', 
                    templateUrl: '~/App/Admin/Carrier/RuleGroups/Views/DetailView.html',
                    controller: 'CarrierRuleGroupDetailController'
                });
        });



})();