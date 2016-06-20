(function() {
    "use strict";

    var ctrlName = 'ApproveCaseInBandingController';

    var ctrl = [
        '$scope', 'CaseModel', '$http', '$modalInstance',
        function ($scope, caseModel, $http, $modalInstance) {

            var approveUrl = '~/api/Banding/Approve/';
            var assignBackUrl = '~/api/Banding/AssignBack/';

            var self = $scope;

            self.caseModel = caseModel;

            self.approve = function () {
                var param = {
                    Id: self.caseModel.ppId,
                    Description: self.initials + '-' + self.reason
                };

                return $http.post(approveUrl, param)
                    .success(function () {
                        $modalInstance.close();
                        self.caseModel.reLoadCase();
                    });
            }


            self.cancel = function() {
                $modalInstance.close();
            }

            self.assignBack = function () {
                var param = {
                    Id: self.caseModel.ppId,
                    Description: self.initials + '-' + self.reason
                };
                return $http.post(assignBackUrl, param)
                    .success(function() {
                        $modalInstance.close();
                        self.caseModel.reLoadCase();
                    });
            }

        }
    ];


    angular
        .module('app')
        .controller(ctrlName, ctrl);

})();