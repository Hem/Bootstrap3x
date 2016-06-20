
(function () {

    "use strict";

    angular.module('app')
        .config(function ($urlMatcherFactoryProvider, $stateProvider) {

            $urlMatcherFactoryProvider.caseInsensitive(true);
            $urlMatcherFactoryProvider.strictMode(false);

            $stateProvider
                .state('PriceBook', {
                    url: '',
                    templateUrl: '~/App/Admin/PriceBook/Views/PriceBookList.html',
                    controller: 'PriceBookListController',
                    onEnter: function () {
                        console.log('loaded price book list');
                    }
                })

                .state('PriceBook.Detail', {
                    url: '/:mode',
                    controller: 'PriceBookDetailController',
                    template: '<div ui-view></div>'
                })

                .state('PriceBook.Detail.Create', {
                    url: '/create',
                    controller: 'PriceBookAddController',
                    templateUrl: '~/App/Admin/PriceBook/Views/PriceBookCreate.html'
                })

                .state('PriceBook.Detail.Edit', {
                    url: '/edit/:id',
                    controller: 'PriceBookEditController',
                    templateUrl: '~/App/Admin/PriceBook/Views/PriceBookEdit.html'
                })
                .state('PriceBook.Detail.View', {
                    url: '/view/:id',
                    controller: 'PriceBookViewController',
                    templateUrl: '~/App/Admin/PriceBook/Views/PriceBookView.html'
                })
                .state('PriceBook.Detail.Parts', {
                    url: '/parts/:id',
                    controller: 'PriceBookPartsController',
                    templateUrl: '~/App/Admin/PriceBook/Views/PriceBookParts.html'
                })
                .state('PriceBook.Detail.FileUpload',
                {
                    url: '/fileupload/:id',
                    templateUrl: '~/App/Admin/PriceBook/Views/PricebookFileUpload.html',
                    controller: 'PriceBookFileUploadController'
                });

        });

})();