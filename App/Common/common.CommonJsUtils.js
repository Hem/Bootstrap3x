(function() {

    "use strict";

    var serviceName = 'commonJsUtils';

    var service = [function() {
        var self = this;
        
		var s4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        self.generateGuid = function() {
            return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
        };
    }];

	angular.module('common').service(serviceName, service);




})();