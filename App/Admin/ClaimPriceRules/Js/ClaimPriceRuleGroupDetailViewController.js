(function () {
    "use strict";

    var ctrlName = 'ClaimPriceRuleGroupDetailViewController';


    var ctrl = [
        '$scope', '$log', '$http', '$stateParams', 'Notification',
        function ($scope, $log, $http, $stateParams, notification ) {
            var self = $scope;
            self.anyRuleAddedOrDeleted = false;


            var onDetailRecordsReceived = function (data) {
                data.forEach(function (i) {
                    i.startDate = Date.parse(i.startDate.substring(0, 10));
                    i.endDate = Date.parse(i.endDate.substring(0, 10));
                });
                self.detailRecords = data;
            };


            var loadRuleGroupDetails = function (id) {
                $http.get("~/api/ClaimPriceRules/RuleGroupDetails/" + id)
                    .success(onDetailRecordsReceived);
            };

            var loadRuleGroup = function (id) {
                $http.get("~/api/ClaimPriceRules/RuleGroup/" + id)
                    .success(function (data) {
                        self.ruleGroup = data;
                    });
            };

            var loadRules = function () {
                $http.get("~/api/ClaimPriceRules/Rules")
                    .success(function (data) {
                        self.rule.rules = data;
                    });
            };

            var activate = function () {
                $log.info(ctrlName + ' Activated');

                loadRules();
                loadRuleGroup(self.id);
                loadRuleGroupDetails(self.id);
            };


            self.id = $stateParams.id;
            self.mode = angular.lowercase($stateParams.mode);
            self.inViewMode = self.mode === 'view';

            self.rule = {};
            self.rule.rules = [];
            self.rule.selectedRule = {};


            // groupBy filter for rules dropdown
            self.ruleTypeGroupByName = function (item) {
                switch (item.ruleType) {
                    case 10: return '*** Pre Evaluation Rules ***';
                    case 20: return '*** Line Pricing Rules ***';
                    case 30: return '*** Procedure Pricing Rules ***';
                    case 50: return '*** Post Pricing Rules ***';
                    default: return item.ruleType;
                };
            }


            // flag identifying that records refresh is in progress...
            self.refreshingRecords = false;

            // rule group... allows editing the rule group name.
            self.ruleGroup = {};

            // list of claim price rule group rule
            self.detailRecords = [];


            self.onClickAddRuleToSet = function (r) {

                self.detailRecords.push({
                    "id": 0,
                    "ruleGroupName" : self.ruleGroupName,
                    "ruleGroupId": self.id,
                    "ruleId": r.id,
                    "startDate": "01/01/2000",
                    "endDate": "12/31/2999",
                    "executionOrder": 0,
                    "isActive": true,  // will be active by default 
                    "rule": r
                });
                self.anyRuleAddedOrDeleted = true;
            };

            
            self.onClickDelete = function (item) {
                item.isActive = false;
                if (item.id === 0) {
                    var i = self.detailRecords.indexOf(item);
                    if (i > -1) self.detailRecords.splice(i, 1);
                }
                self.anyRuleAddedOrDeleted = true;
            };

            self.onClickUndelete = function(item) {
                item.isActive = true;
                self.anyRuleAddedOrDeleted = true;
            };

            self.openDatePicker = function ($event, item, key) {
                $event.preventDefault();
                $event.stopPropagation();
                item[key] = true;
            };

            self.onClickSave = function() {
                $http.post("~/api/ClaimPriceRules/RuleGroupDetails/" + self.id, self.detailRecords)
                    .success(function (data) {
                        self.anyRuleAddedOrDeleted = false;
                        notification.success("Rules saved!").then(onDetailRecordsReceived(data));
                    });
            };

            self.isSaveDisabled = function() {
                var isDirty = self.anyRuleAddedOrDeleted || self.pricingRuleListForm.$dirty;
                return !isDirty || self.pricingRuleListForm.$invalid;
            };

            self.filterRecords = function(item) {
                return !self.inViewMode || item.isActive;
            }



            activate();
        }
    ];


    angular
        .module('app')
            .controller(ctrlName, ctrl);


})();