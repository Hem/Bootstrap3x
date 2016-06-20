(function() {
    "use strict";

    var ctrlName = 'CaseHistoryController';

    var ctrl = [
        '$scope', '$http', '$stateParams','viewModelHelper', '$window',
        function ($scope, $http, $stateParams, viewModelHelper, $window) {

            var patientProcHistoryUrl = '~/api/PatientProcedureHistory/list/';
            var headerLoadUrl = '~/api/PatientProcedure/header/';
            viewModelHelper.showPageHeader = !$window.opener;

            var self = $scope;

            self.print = function() {
                $window.print();
            };

            self.close = function () {
                if ($window.opener) {
                    $window.close();
                } else {
                    //Go to case search page.
                    $window.location.href = '/Case#/Search';
                }
            };

            var loadHeader = function() {
                self.header = {};
                return $http.get(headerLoadUrl + $stateParams.ppId)
                    .success(function(data) {
                        self.header = data;
                    });
            };

            var initialize = function() {
                return $http.get(patientProcHistoryUrl + $stateParams.ppId)
                    .success(function(response) {
                        self.history = response;
                    });
            };

            loadHeader();
            initialize();
        }
    ];


    angular
        .module('app')
        .controller(ctrlName, ctrl);

})();