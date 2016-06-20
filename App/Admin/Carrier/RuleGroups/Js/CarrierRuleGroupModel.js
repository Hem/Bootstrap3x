(function () {

    "use strict";

    var componentName = 'CarrierRuleGroupModel';


    var component = ['$http',
        function ($http) {

            var self = this;
            
            self.records = [];

            self.refreshingRecords = false;

            self.params = {
                filterText: '',
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0,
                totalPages: 1 
            };


            self.search = function () {
                // reset if called from ui
                self.params.pageIndex = 1;
                self.params.totalCount = 0;
                return self.loadRecords();
            };

            self.loadRecords = function () {
                self.refreshingRecords = true;
                return $http.post("~/api/Carriers/PricingRuleGroups", {
                    pageSize: self.params.pageSize,
                    pageIndex: self.params.pageIndex,
                    filterText: self.params.filterText
                }).success(function (data) {
                    self.records = data.data;
                    self.params.pageIndex = data.pageIndex;
                    self.params.pageSize = data.pageSize;
                    self.params.totalCount = data.totalCount;
                    self.params.totalPages = data.totalPages;
                });
            };


            self.removeById = function(id) {
                _.remove(self.records, { id: id });
            };

        }
    ];


    angular.module('app').service(componentName, component);

})();