(function() {

    "use strict";

    angular.module('app')
        .config(function ($urlMatcherFactoryProvider, $stateProvider /*, $urlRouterProvider, $locationProvider*/) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);

            console.log("Part module created");

            $stateProvider
                .state('Part', {
                    url: '/Parts',
                    templateUrl: '~/App/Admin/Catalog/Views/PartsListView.html',
                    controller: 'PartsListController'
                })
                .state('Part.Detail', {
                    url: '',
                    template: '<div ui-view></div>',
                    constoller: 'PartsDetailController'
                })
                .state('Part.Detail.Create', {
                    url: '/create',
                    params: {
                        mode: 'detail'
                    },
                    templateUrl: '~/App/Admin/Catalog/Views/PartEdit.html',
                    controller: 'PartCreateController'
                })
                .state('Part.Detail.View', {
                    url: '/view/:partId',
                    templateUrl: '~/App/Admin/Catalog/Views/PartView.html',
                    controller: 'PartViewController',
                    params: {
                        mode: 'detail'
                    }
                })
                .state('Part.Detail.Edit', {
                    url: '/edit/:partId',
                    templateUrl: '~/App/Admin/Catalog/Views/PartEdit.html',
                    controller: 'PartEditController',
                    params: {
                        mode: 'detail'
                    }
                });


        });
        

})();