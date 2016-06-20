(function () {

    'use strict';

    var module = 'app';

    var ctrl = [
        '$scope', '$log',
        function ($scope, $log) {

            $scope.title = 'Catalog Home';

            function activate() {
                $log.info('Catalog Home Controller Activated');
            }

            activate();
        }
    ];

    angular
        .module(module)
        .controller('CatalogHomeController', ctrl);

})();
