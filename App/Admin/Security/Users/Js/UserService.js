(function () {
    'use strict';

    var userService = [
        '$http', '$q', function ($http, $q) {
            var service = {};

            service.getUsers = function (filter) {
                var deferred = $q.defer();
                var usersUrl = "~/api/Users/GetList";
                $http.post(usersUrl, filter).then(function (response) {
                    deferred.resolve(response.data);
                }, function (reason) { deferred.reject(reason) });

                return deferred.promise;
            };

            service.getUserDetail = function (id) {
                var deferred = $q.defer();
                var detailUrl = "~/api/Users/GetDetail/" + id;
                $http.get(detailUrl).then(function (response) {
                    deferred.resolve(response.data);
                }, function (reason) { deferred.reject(reason) });

                return deferred.promise;
            };

            service.createUserRoles = function (userRoles, userId) {
                var deferred = $q.defer();
                var saveUrl = '~/api/Users/SaveRoles/' + userId;
                $http.post(saveUrl, userRoles).then(function (response) {
                    deferred.resolve(response.data);
                }, function (reason) {
                    deferred.reject(reason);
                });

                return deferred.promise;
            };

            service.deleteUserRoles = function(userRoles) {
                var deferred = $q.defer();
                var deleteUrl = '~/api/Users/DeleteRoles';

                $http.put(deleteUrl, userRoles).then(function (response) {
                    deferred.resolve(response.data);
                }, function(reason) { deferred.reject(reason) });

                return deferred.promise;
            };

            service.updateUserRoles = function(userRoles) {
                var deferred = $q.defer();
                var updateUrl = '~/api/Users/UpdateRoles';

                $http.put(updateUrl, userRoles).then(function (response) {
                    deferred.resolve(response.data);
                }, function (reason) { deferred.reject(reason) });

                return deferred.promise;
            }

            return service;
        }
    ];

    angular.module('app').factory('userService', userService);
})();