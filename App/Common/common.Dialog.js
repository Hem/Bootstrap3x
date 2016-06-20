(function() {
    'use strict';

    var serviceName = 'IpgDialog';

    var serviceCtrl = [
        '$mdDialog', function($mdDialog) {
            var model = {};
            
            model.showConfirm = function(title, message) {
                var confirm = $mdDialog.confirm()
                    .title(title)
                    .textContent(message)
                    .ok('Yes')
                    .cancel('No');

                return $mdDialog.show(confirm);
            };

            model.showAlert = function(title, message) {
                var alert = $mdDialog.alert({
                    title: title,
                    textContent: message,
                    ok: 'OK'
                });
                $mdDialog
                  .show(alert)
                  .finally(function () {
                      alert = undefined;
                  });
            }
            return model;
        }
    ];

    angular.module('app').service(serviceName, serviceCtrl);

})();