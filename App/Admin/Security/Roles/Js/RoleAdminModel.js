(function() {
"use strict"; 

var componentName = 'RolesAdminModel';

var component = ['$http',
   function ($http) {

       var self = this;

       self.refreshingRecords = false;
       
       self.roles = [];
       self.mode = "";
       self.selectedRoleId = 0;
       self.selectedRole = {};


       self.loadRoles = function () {
           self.refreshingRecords = true;
           $http.get("~/api/Roles")
               .success(function (data) {
                   self.roles = data;
               }).then(function () {
                   self.refreshingRecords = false;
               });
       };


       self.setMode = function (mode) {
           self.mode = mode;
       };

       self.loadRole = function(roleId) {
           self.selectedRoleId = roleId;
           self.selectedRole = {};

           if (roleId > 0) {
               $http.get("~/api/Roles/" + roleId).success(function (data) {
                   self.selectedRole = data;
               });
           }
       };

       self.onRoleSave = function() {
           return $http.post("~/api/Roles", self.selectedRole).success(function(role) {
               self.selectedRoleId = role.id;
               self.selectedRole = role;
               self.loadRoles();
           });
       };

       self.onRoleDelete = function() {
           return $http.delete( "~/api/Roles/" + roleId ).success(function (data) {
               self.selectedRoleId = 0;
               self.selectedRole = null;
               self.loadRoles();
           });
       }

   }
];

angular.module('app').service(componentName, component);

})();