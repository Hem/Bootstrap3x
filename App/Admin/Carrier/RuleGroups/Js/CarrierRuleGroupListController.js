(function() {

    "use strict";

    var ctrlName = 'CarrierRuleGroupListController';


    var ctrl = [
        '$scope', 'CarrierRuleGroupModel', '$state',
        function ($scope, model, $state) {
            var self = $scope;

            self.model = model;

            self.$state = $state;

            $scope.onPageIndexChange = function () {
                self.model.loadRecords();
            };

            $scope.search = function () {
                self.model.search();
            };

            var activate = function () {
                console.info(ctrlName + ' Activated');
                self.model.loadRecords();
            };


            activate();
        }
    ];


    angular
        .module('app')
            .controller(ctrlName, ctrl);




})();