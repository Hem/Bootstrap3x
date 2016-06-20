(function() {

    'use strict';

    var appName = 'app';
    var ctrlName = 'ipgErrorTooltipCtrl';
    var directiveName = 'ipgErrorTooltip';

    var directive = [
        '$compile', '$timeout',
        function($compile, $timeout) {
            return {
                restrict: 'A',
                require: 'ngModel',
                controller: ctrlName,
                transclude: 'true',
                scope: {},
                link: function($scope, $element, $attrs, ngModel, transclude) {
                    $element.addClass('ipg-error-tooltip');
                    $element.removeAttr('ipg-error-tooltip');

                    transclude(
                        $scope,
                        function() {
                            var tooltip = angular.element('<div ng-show="$field.$error.required">Required field</div>' +
                                '<div ng-show="$field.$error.number">Number only</div>' +
                                '<div ng-show="$field.$error.min">Minimum value is: {{$attrs.min}}</div>' +
                                '<div ng-show="$field.$error.max">Maximum value is: {{$attrs.max}}</div>');

                            $element.append(tooltip);
                            $scope.$field = ngModel;
                            $scope.$attrs = $attrs;

                            $timeout(function() {
                                $($element).tooltip({
                                    placement: 'right',
                                    html: true,
                                    title: tooltip
                                });

                            });
                        }
                    );

                    $compile($element.contents())($scope);
                }
            };
        }
    ];

    var ctrl = [
        '$scope', '$element',
        function($scope, $element) {

            $scope.$watch(function() { return $scope.$field.$invalid }, function(invalid) {
                $element.toggleClass('ipg-error-tooltip-hidden', !invalid);
            });
        }
    ];

    angular.module(appName).controller(ctrlName, ctrl);
    angular.module(appName).directive(directiveName, directive);

})();