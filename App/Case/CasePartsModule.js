(function() {

    'use strict';
    angular.module('app')
        .config(function($stateProvider) {
            $stateProvider.state('case-add-part-view', {
                    url: "/:ppId",
                    params: { partsToAdd: null },
                    templateUrl: '/App/Case/Parts/Views/AddPartsToCaseView.html',
                    controller: "AddPartToCaseController",
                    data: {
                        css: "/App/Case/Parts/Styles/CasePartsStyle.css"
                    }
                })
                .state('case-debit-readd-part-view', {
                    url: "/:mode/:ppId",
                    templateUrl: '/App/Case/Parts/Views/DebitPartsFromCaseView.html',
                    controller: "DebitPartsFromCaseController"
                });
        });
})();