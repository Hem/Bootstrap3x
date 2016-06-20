(function() {
    "use strict";

    var ctrlName = 'EstimatedCalcRevController';

    var ctrl = [
        '$scope', '$stateParams', 'CaseModel', 'viewModelHelper', '$window', 'EstimatedCaseModel', '$http',
        function($scope, $stateParams, caseModel, viewModelHelper, $window, estimatedCaseModel, $http) {

            var self = $scope;
            self.estimatedCaseModel = estimatedCaseModel;
            self.case = caseModel;
            self.ppId = $stateParams.ppId;
            viewModelHelper.showPageHeader = !$window.opener;

            var activate = function() {
                self.case.ppId = self.ppId;
                self.case.reLoadCase();
                estimatedCaseModel.loadParts(self.ppId);
                estimatedCaseModel.loadEstimatedResponsibility();
                estimatedCaseModel.loadEstimatedPrice();
            };

            activate();
        }
    ];

    angular.module('app').controller(ctrlName, ctrl);

})();