(function () {
    'use strict';

    var module = 'app';
    var controllerName = 'PartsDetailController';

    var ctrl = ['$scope', '$state', 'PartModel', 
        function ($scope, $state, partModel) {

            var self = $scope;

            self.partModel = partModel;
            self.state = $state;
        }
    ];
    
    angular
        .module(module)
        .controller(controllerName, ctrl);

})();


