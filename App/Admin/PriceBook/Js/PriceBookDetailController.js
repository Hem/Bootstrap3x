(function () {
    'use strict';

    var module = 'app';
    var controllerName = 'PriceBookDetailController';

    var ctrl = [ '$scope', '$stateParams', 'PriceBookModel',
        function ($scope, $stateParams, priceBookModel) {

            var self = $scope;

            self.model = priceBookModel;

        }
    ];
    
    angular
        .module(module)
        .controller(controllerName, ctrl);

})();


