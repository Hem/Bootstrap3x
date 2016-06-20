//(function() {
//    "use strict";

//    var ctrlName = 'ErrorController';

//    var ctrl = [
//        '$scope','viewModelHelper',  '$window', 'ERROR_CONSTANTS',
//        function ($scope, viewModelHelper, $window, ERROR_CONSTANTS) {
//            viewModelHelper.showPageHeader = !$window.opener;
//            console.log(ERROR_CONSTANTS.PermissionsRequired);
//        }
//    ];

//    angular.module('app').controller(ctrlName, ctrl);
//})();