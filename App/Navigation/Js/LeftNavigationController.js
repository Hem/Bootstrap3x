(function() {
    "use strict";

    var ctrlName = 'LeftNavigationController';

    var ctrl = [
        '$scope', 'LeftNav', '$location',
        function($scope, leftNav, $location) {

            var self = $scope;
            self.baseUrl = $location.protocol() + '://' + $location.host();

            self.toggleLeftNavPanel = function() {
                leftNav.toggle();
            };

            self.mainNavItems = [
                {
                    name: 'Case',
                    subNavItems: [
                        { name: 'Case Search', href: '/Case#/Search', permissions: ['VIEW_CASE'] }
                    ]
                },
                {
                    name: 'Materials Mgmt',
                    subNavItems: [
                        { name: 'Parts', href: '/Admin/Catalog#/Parts', permissions: ['PARTS_VIEW', 'PARTS_MANAGE'] },
                        { name: 'Price Books', href: '/Admin/PriceBook#/', permissions: ['PRICE_BOOK_VIEW', 'PRICE_BOOK_MANAGE'] }
                    ]
                },
                {
                    name: 'Billing',
                    subNavItems: [
                        {
                            name: 'Claim',
                            backgroundColor: '#42586B',
                            subNavItems: [
                                { name: 'Claim Pricing Rule', href: '/Admin/ClaimPriceRules#/RuleGroupList', permissions: ['MANAGE_CLAIM_CONTRACTS'] }
                            ]
                        },
                        { name: 'Carrier', subNavItems: [{ name: 'Carrier Pricing Rule', href: '/Admin/carrier#/CarrierRuleGroups', permissions: ['MANAGE_CLAIM_CONTRACTS'] }] }
                    ]
                },
                {
                    name: 'Security',
                    subNavItems: [{ name: 'Roles', href: '/Admin/Security#/Roles', permissions: ['SYS_ADMIN', 'MANAGE_USERS'] }]
                }
            ];
        }
    ];

    angular
        .module('app')
        .controller(ctrlName, ctrl);

})();