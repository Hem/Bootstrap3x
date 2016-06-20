(function () {

    'use strict';

    angular.module('app')
        .config(function ($urlMatcherFactoryProvider, $stateProvider) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);

            // when the route is /parts redirect to list!  
            $stateProvider
                .state('CatalogAdmim', {
                    url: '/',
                    templateUrl: '~/App/CatalogAdmin/Catalog/Views/CatalogHomeView.html',
                    controller: 'CatalogHomeController'
                })
                .state('parts-list', {
                    url: '/parts',
                    templateUrl: '~/App/CatalogAdmin/Parts/Views/PartsAdminListView.html',
                    controller: 'PartsAdminListController'
                })
                .state('part-new', {
                    url: '/parts/newpart',
                    templateUrl: '~/App/CatalogAdmin/Parts/Views/PartsAdminEditView.html',
                    controller: 'PartsAdminDetailController',
                    params: {mode:'new'}
                })
                .state('part-view', {
                    url: '/parts/view/:partId',
                    templateUrl: '~/App/CatalogAdmin/Parts/Views/PartsAdminDisplayView.html',
                    controller: 'PartsAdminDetailController',
                    params: {
                        mode:'view'
                    }
                }).state('part-edit', {
                    url: '/parts/edit/:partId',
                    templateUrl: '~/App/CatalogAdmin/Parts/Views/PartsAdminEditView.html',
                    controller: 'PartsAdminDetailController',
                    params: {
                        mode: 'edit'
                    }
                });

            // $locationProvider.html5Mode(true);
        });


})();
