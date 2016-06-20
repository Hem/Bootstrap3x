(function() {

    'use strict';

    angular.module('app').controller('MainController', [
        '$scope', '$log', 'viewModelHelper', 'currentUser','APP_CONSTANTS', '$location', 'LeftNav',
        function($scope, $log, viewModelHelper, userPermissions, appConstants, $location, leftNav) {

            var self = $scope;
            self.currentUser = userPermissions;
            self.APP_CONSTANTS = appConstants;
            self.applicationName = "Insight NextGen";
            self.applicationVersion = "0.0.1";
            self.viewModelHelper = viewModelHelper;
            self.baseUrl = $location.protocol() + '://' + $location.host();

            self.refreshPage = function(url) {
                viewModelHelper.refreshPage(url);
            };

            self.toggleLeftNavPanel = function() {
                leftNav.toggle();
            };

            function activate() {
                $log.info("Main View Model created!");
                leftNav.restore();
            };

            $('#insightNavBar').on('hidden.bs.collapse', function() {
                $('#wrapper').removeClass('wrapper-margin-expanded'); 
            });

            $('#insightNavBar').on('show.bs.collapse', function() {
                $('#wrapper').addClass('wrapper-margin-expanded');
            });

            activate();
        }
    ]);


})();