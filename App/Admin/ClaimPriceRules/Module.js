(function() {

    "use strict";

    angular.module('app')
        .config(function ($urlMatcherFactoryProvider, $stateProvider /*, $urlRouterProvider, $locationProvider*/) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);


            // when the route is /parts redirect to list!  
            // $urlRouterProvider.when('/CatalogAdmin/Index', '/CatalogAdmin');

            $stateProvider
                .state('claimPriceRuleGroups', {
                    url: '/RuleGroupList',
                    templateUrl: '~/App/Admin/ClaimPriceRules/Views/ClaimPriceRuleGroupListView.html',
                    controller: 'ClaimPriceRuleGroupListController'
                })

                .state('claimPriceRuleGroups.detail', {
                    url: '/:mode/:id', // #/RuleGroupList/view/1234565 OR #/RuleGroupList/edit/1234565
                    templateUrl: '~/App/Admin/ClaimPriceRules/Views/ClaimPriceRuleGroupDetailView.html',
                    controller: 'ClaimPriceRuleGroupDetailViewController'
                });
        });
        

})();