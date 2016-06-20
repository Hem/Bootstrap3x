(function () {
    "use strict";

    angular
       .module('app').filter("ruleTypeToName", function () {

           return function (input) {

                switch (input) {
                    case 10: return 'Pre';
                    case 20: return 'Line';
                    case 30: return 'Procedure';
                    case 50: return 'Post';
                    default: return 'Unknown';
                };

           }

       });



})();