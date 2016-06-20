(function () {
    "use strict";

    angular.module('app')
        .config(function ($urlMatcherFactoryProvider, $stateProvider /*, $urlRouterProvider, $locationProvider*/) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);


            // when the route is /parts redirect to list!  
            // $urlRouterProvider.when('/CatalogAdmin/Index', '/CatalogAdmin');

            $stateProvider

                .state('roleList', {
                    url: '/Roles',
                    templateUrl: '~/App/Admin/Security/Roles/Views/RoleListView.html',
                    controller: 'RoleListController'
                })

                .state('roleList.detail', {
                    url: '/:mode/:roleId',
                    templateUrl: '~/App/Admin/Security/Roles/Views/RoleDetailView.html',
                    controller: 'RoleDetailController'
                })

                .state('roleList.detail.privs', {
                    url: '/privs',
                    templateUrl: '~/App/Admin/Security/Roles/Views/RolePrivsView.html',
                    controller: 'RolePrivsController'
                })

                .state('roleList.detail.users', {
                    url: '/users',
                    templateUrl: '~/App/Admin/Security/Roles/Views/RoleUsersView.html',
                    controller: 'RoleUsersController'
                })
                

                .state('userList', {
                    url: '/Users',
                    templateUrl: '~/App/Admin/Security/Users/Views/UserListView.html',
                    controller: 'UserListController',
                    data: {
                        authorizedRole: 'MANAGE_USERS'
                    }
                }).state('userList.detail', {
                    url: '/:mode/:userId',
                    templateUrl: '~/App/Admin/Security/Users/Views/UserDetailView.html',
                    controller: 'UserDetailController'
                }).state('userList.detail.roles', {
                    url: '/roles',
                    templateUrl: '~/App/Admin/Security/Users/Views/UserRolesView.html',
                    controller: 'UserRolesController'
                });

        });

    angular.module('app').run(['$rootScope', 'currentUser', 'Notification', function ($rootScope, userPermissions, notification) {
        $rootScope.$on('$stateChangeStart', function (event, next) {
            if (next.data && next.data.authorizedRole) {
                var authorizedRole = next.data.authorizedRole;
                if (!userPermissions.hasPermission(authorizedRole)) {
                    event.preventDefault();
                    notification.warning("You do not have sufficient privilege.");
                }
            }
        });
    }]);



})();