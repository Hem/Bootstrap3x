(function () {
    "use strict";

    var ctrlName = 'ClaimPriceRuleGroupListController';


    var ctrl = [
        '$scope', '$log', '$http',
        function ($scope, $log, $http) {

            $scope.title = 'Claim Price Rule Groups';


            $scope.records = [];
            $scope.refreshingRecords = false;


            //$scope.onViewClick = function (item, mode){
            //    $state.go('claimPriceRuleGroups.detail', { id: item.id, mode: mode });
            //};


            var activate = function () {
                $log.info(ctrlName + ' Activated');

                $scope.refreshingRecords = true;
                $http.post("~/api/ClaimPriceRules/RuleGroups")
                    .success(function (data) {
                        $scope.records = data;
                    }).error(function (err) {

                    }).then(function () {
                        $scope.refreshingRecords = false;
                    });

            };


            activate();


        }
    ];


    angular
        .module('app')
            .controller(ctrlName, ctrl);


})();