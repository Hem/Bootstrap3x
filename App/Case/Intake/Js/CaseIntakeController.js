(function () {
    'use strict';


    var ctrlName = 'CaseIntakeController';


    var ctrl = [
        '$scope', '$http', 
        function ($scope, $http) {

            $scope.relationToInsured = ['Self', 'Spouce', 'Child', 'Other'];

            $scope.carrierPlanTypes = [ "Workers Comp", "Commercial", "Commercial-HMO",
                                        "Commercial-PPO", "Commercial-POS", "DME Supply",
                                        "Govt", "HSA", "Indemnity", "Network",
                                        "Auto-No Fault", "Self Insured", "Other"];

            $scope.title = 'Catalog Home';

            $scope.procedure = {  };

            $scope.wizardMode = true;

            $scope.isWorkersCompensation = false;


            $scope.onRelatedToChanged = function(to) {

                if (to === 'Self') {
                    var p = $scope.procedure;
                    p.InsuredFirstName = p.PatFirstName;
                    p.InsuredMiddleName = p.PatMiddleName;
                    p.InsuredLastName = p.PatLastName;
                    p.InsuredDob = p.PatDob;
                    p.InsuredGender = p.PatGender;
                    p.InsuredSsn = p.PatSsn;
                    p.InsuredPhone = p.PatHomePhone;
                    p.InsuredAddress = p.PatAddress;
                    p.InsuredCity = p.PatCity;
                    p.InsuredState = p.PatState;
                    p.InsuredZipCode = p.PatZipCode;
                }
            };

            $scope.onPlanTypeChanged = function(planType) {
                $scope.isWorkersCompensation = planType === "Workers Comp";
            };



            $scope.wizardFinished = function() {

                var procedure = $scope.procedure;

                // TODO :validate model!
                $http.post("~/api/CaseIntake", procedure)
                    .success(function(data, status, headers, config) {
                        console.info(data, status, headers, config);
                    }).error(function(data, status, headers, config) {
                        console.error(data, status, headers, config);
                    }).then(function(response) {
                        console.info(response);
                    });

            }

            var activate = function() {
                // $log.info(ctrlName + 'Activated');
            };

            activate();
        }
    ];


    angular
        .module('app')
            .controller(ctrlName, ctrl);

})();