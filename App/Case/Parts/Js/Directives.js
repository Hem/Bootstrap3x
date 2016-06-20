(function () {
    "use strict";


    angular.module('app').directive('addPartsSaveCancelButtons', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '~/app/Case/Parts/Views/AddPartsView_SaveCancelButtons.html'
        };
    });

    angular.module('app').directive('addPartsSearchSection', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '~/app/Case/Parts/Views/AddPartsView_SearchSection.html'
        }
    });
})();