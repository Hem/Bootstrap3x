(function () {
    "use strict";

    angular.module('app').filter("maicEnumToText", function () {

           var maicEnums = {
               "-100" : "DisabledByUser",
               "-10"  : "DisabledPayFacilityFlag",
               "-9"   : "DisabledCarrier",
               "-6"   : "DisabledFacilityCarrier",
               "-5"   : "DisabledPart",
               "-4"   : "DisabledPartCategory",
               "-3"   : "DisabledFacilityManufacturer",
               "-2"   : "DisabledFacility",
               "-1"   : "DisabledManufacturer",
               "0"    : "Unknown",
               "1"    : "EnabledCarrier",
               "2"    : "EnabledCarrierState",
               "100"  : "EnabledByUser"
           };

           return function (input) {
                
               var maicArray = (input || '').split(",");
               var maicArrayText = [];
               _(maicArray).forEach(function (m) {
                   maicArrayText.push(maicEnums[m]);
               }).value();

               return maicArrayText.join(", ");
           }
       });




    angular.module('app').filter("maicDisabledReasonsEnumToText", function () {

        var maicDisabledReasons = {
            "0": "Enabled",
            "1": "DisabledManufacturer",
            "2": "DisabledFacility",
            "3": "DisabledFacilityMfr",
            "4": "DisabledPartCategory",
            "5": "DisabledPart",
            "6": "DisabledFacilityCarrier"
        };

        return function (input) {

            var maicArray = angular.isArray(input) ? input.split(",") : [input] ;
            var maicArrayText = [];
            _(maicArray).forEach(function (m) {
                maicArrayText.push(maicDisabledReasons[m]);
            }).value();

            return maicArrayText.join(", ");
        }
    });



})();