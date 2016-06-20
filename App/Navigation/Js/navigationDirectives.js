(function() {

    'use strict';

    var module = angular.module('app');

    module.directive('leftNavView', function() {
        return {
            restrict: 'E',
            controller: "LeftNavigationController",
            templateUrl: '/App/Navigation/Views/LeftNavView.html'
        };
    });

    module.directive('leftNavHeader', [
        '$state', function() {
            return {
                restrict: 'E',
                scope: {
                    header: '=header'
                },
                templateUrl: '/App/Navigation/Template/LeftNavHeaderTemplate.html',
                controller: [
                    '$scope', 'currentUser', function ($scope, currentUser) {
                        
                        $scope.toggleSubNavItem = function () {
                            $scope.header.collapsed = !$scope.header.collapsed;
                        }

                        function hasPermission(navItem) {
                            return _.some(navItem.permissions, function (permission) {
                                return currentUser.hasPermission(permission);
                            });
                        };

                        function anySubNavVisible(navItem) {
                            return _.some(navItem.subNavItems, function (value) {
                                return value.isVisible;
                            });
                        }

                        function evaluateVisibility(header) {
                            _.forEach(header.subNavItems, function (navItem) {
                                if (angular.isArray(navItem.subNavItems)) {
                                    evaluateVisibility(navItem);
                                    navItem.isVisible = true;
                                } else {
                                    navItem.isVisible = true;
                                }
                            });
                        };

                        function initialize() {
                            evaluateVisibility($scope.header);
                            $scope.isVisible = true;
                        };

                        initialize();
                    }
                ]
            };
        }
    ]);

    module.directive('leftNavItem', [
        '$compile', function($compile) {
            return {
                restrict: 'E',
                scope: {
                    navItem: '=item'
                },
                link: function(scope, element) {

                    if (angular.isArray(scope.navItem.subNavItems)) {
                        element.append("<left-nav-header header='navItem' />");
                        $compile(element.contents())(scope);
                    } else {
                        element.append("<a class='list-group-item leftNavItem' href='{{navItem.href}}'>{{navItem.name}}</a>");
                        $compile(element.contents())(scope);
                    }
                }
            };
        }
    ]);

    module.directive('topNavView', function() {
        return {
            restrict: 'E',
            controller: "MainController",
            templateUrl: '/App/Navigation/Views/TopNavView.html'
        };
    });

    module.directive('masterPage', [
        'viewModelHelper', function(viewModelHelper) {
            return {
                restrict: 'A',
                transclude: true,
                templateUrl: '/App/Navigation/Template/MasterPageTemplate.html',
                link: function(scope) {
                    scope.now = new Date();
                    scope.showNavigation = viewModelHelper.showPageHeader;
                }
            }
        }
    ]);

    module.service('LeftNav', ['$cookieStore', function($cookieStore) {
        var self = this;
        var navElem = function() {
            return angular.element(document.querySelector('#wrapper'));
        }
        
        var updateCookie = function() {
            if (navElem().hasClass('toggled')) {
                $cookieStore.put('leftNavStatus', 'close');
            } else {
                $cookieStore.put('leftNavStatus', 'open');
            }
        }
        self.close = function() {
            navElem().addClass('toggled');
            updateCookie();
        }
        self.open = function() {
            navElem().removeClass('toggled');
            updateCookie();
        }
        self.toggle = function() {
            navElem().toggleClass('toggled');
            updateCookie();
        }

        self.restore = function () {
            var leftNavStatus = $cookieStore.get('leftNavStatus');
            if (leftNavStatus === 'open') {
                self.open();
            } else {
                self.close();
            }
        };
        
    }]);

})();