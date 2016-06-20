(function() {
    'use strict';

    var serviceName = 'ArrayHelper';

    var serviceCtrl = [function() {
            var model = {};
            
            model.joinToNameString = function (list) {
                
                var nameArray = [];
                angular.forEach(list, function(value, key) {
                    nameArray.push(value.name);
                });

                return nameArray.join(', ');
            };

            model.joinToFullNameString = function (list) {

                var nameArray = [];
                angular.forEach(list, function (value, key) {
                    nameArray.push(value.firstName + ' ' + value.lastName);
                });

                return nameArray.join(', ');
            };

            return model;
        }
    ];

    angular.module('app').service(serviceName, serviceCtrl);

})();