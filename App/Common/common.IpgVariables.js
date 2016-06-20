(function() {
    'use strict';

    var serviceName = 'IpgVariables';

    var serviceCtrl = [function() {
            var model = {
                hasUnsavedData: false
            };

            return model;
        }
    ];

    angular.module('app').service(serviceName, serviceCtrl);
})();