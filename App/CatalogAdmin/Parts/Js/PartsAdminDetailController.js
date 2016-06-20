(function () {
    'use strict';

    var ctrl = [
        '$scope', '$log', '$http', '$state', '$stateParams', 'Notification',
        function ($scope, $log, $http, $state, $stateParams, notification) {
            // local variable
            var masterPart = {};


            $scope.title = 'Details';
            $scope.partId = $stateParams.partId || null; // validate this is expected!
            $scope.dataLoadInProgress = false;
            $scope.part = {};


            $scope.save = function () {
                $log.info('save called on the form');

                // validate data entered!
                // call save#
                $http.post('~/api/Parts/CreateOrUpdate', $scope.part)
                    /*data, status, headers, config*/
                    .success(function (data) {

                        if (data.success) {
                            notification.success(data.message).then($state.go("parts-list"));
                        } else {
                            notification.error(data.message);
                        }

                        $log.info("Create or Update Response", data);

                    }).then(function ( /*response*/) {
                        $scope.dataLoadInProgress = false;
                    });
            };

            $scope.reset = function() {
                $scope.part = angular.copy(masterPart);
            };


            function loadPart(p) {
                masterPart = p;
                $scope.part = angular.copy(masterPart);
                $scope.$apply();
            }

            function loadData() {
                if (angular.hasValue($scope.partId)) {
                    $scope.dataLoadInProgress = true;
                    $http.get('~/api/Parts/' + $scope.partId)
                        /*data, status, headers, config*/
                        .success(function (data) {
                            loadPart(data);
                        }).then(function ( /*response*/) {
                            $scope.dataLoadInProgress = false;
                        });
                }

            }

            function activate() {
                $log.info("Loaded route:", $scope.title, " State:", $state, "with params:", $stateParams);
                loadData();
            }

            activate();
        }
    ];

    angular
        .module('app')
        .controller('PartsAdminDetailController', ctrl);

})();
