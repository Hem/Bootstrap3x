(function() {

    "use strict";

    var ctrlName = 'CarrierRuleGroupDetailController';


    var ctrl = [
        '$scope', '$log', '$http', '$state', '$stateParams', 'Notification', 'CarrierRuleGroupModel',
        function($scope, $log, $http, $state, $stateParams, notification, model) {

            var self = $scope;

            self.record = []; // lists the current carrier rule
            self.carrierRecords = []; // all pricing rule association by carrier
            self.refreshingRecords = false;

            self.id = $stateParams.id;
            self.mode = angular.lowercase($stateParams.mode);
            self.inViewMode = (self.mode === 'view' || self.mode === 'delete');
            self.inAddMode = (self.mode === 'add');
            self.inDeleteMode = (self.mode === 'delete');

            self.openDatePicker = function($event, item, key) {
                $event.preventDefault();
                $event.stopPropagation();
                item[key] = true;
            };

            self.confirmDeleteRecord = function() {
                if (self.inDeleteMode) {
                    $http.post("~/api/Carriers/DeleteCarrierPricingRuleGroups/" + self.id).success(function() {
                        notification.success("The carrier - pricing rule mapping was deleted!");
                        model.loadRecords();
                        $state.go("^");
                    });
                }
            };

            self.onSaveClick = function() {

                $http.post("~/api/Carriers/PricingRuleGroup/" + self.id, self.record)
                    .success(function() {
                        model.search().then(function() {
                            notification.success("Record saved!");
                            self.refreshingRecords = false;
                            self.form.$setPristine();
                        });
                    });

            };

            self.loadCarrierRules = function(carrierId) {
                if (!carrierId) return;
                $http.get("~/api/Carriers/CarrierPricingRuleGroups/" + carrierId)
                    .success(function(data) {
                        self.carrierRecords = data;
                    });
            };

            var loadRecordDetail = function(id) {
                self.refreshingRecords = true;
                $http.get("~/api/Carriers/PricingRuleGroup/" + id)
                    .success(function(data) {
                        self.record = data;
                        self.record.startDate = Date.parse(self.record.startDate.substring(0, 10));
                        self.record.endDate = Date.parse(self.record.endDate.substring(0, 10));
                        self.loadCarrierRules(self.record.carrierId);
                    }).then(function() {
                        self.refreshingRecords = false;
                    });
            };

            var addRecordDetails = function() {
                self.record = {
                    "id": 0,
                    "carrierId": "",
                    "ruleGroupId": 0,
                    "startDate": "",
                    "endDate": "",
                    "carrier": null,
                    "priceRuleGroup": null
                };
            };

            self.cancel = function() {
                if (self.inAddMode) {
                    addRecordDetails();
                } else {
                    loadRecordDetail(self.id);
                }
            }
            var activate = function() {
                $log.info(ctrlName + ' Activated');

                if (self.mode !== 'add') loadRecordDetail(self.id);
                if (self.mode === 'add') addRecordDetails();
            };
            activate();
        }
    ];


    angular
        .module('app')
        .controller(ctrlName, ctrl);


})();