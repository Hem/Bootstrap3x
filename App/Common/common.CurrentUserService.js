(function() {

    angular.module('common')
        .service('currentUser', [
            'APP_USER',
            function(appUser) {
                var self = this;
                self.getDisplayName = function() {
                    return appUser.displayName;
                    },
                    self.hasPermission = function(permission) {
                        permission = permission.trim();
                        return _.some(appUser.roles, function(item) {
                            return item.trim() === permission;
                        });
                    };
            }
        ]);

    angular.module('common').directive('authorize', [
        'currentUser',
        function(userPermissions) {
            return {
                restrict: 'A',
                scope: {},
                link: function(scope, element, attrs) {
                    if (!_.isString(attrs.authorize)) {
                        throw 'authorize value must be a string!';
                    }

                    var perm = attrs.authorize;
                    var isRestriction = perm[0] === '!';

                    if (isRestriction)
                        perm = perm.slice(1).trim();

                    //console.info('Authorizing based on permission', perm);
                    //console.info('Scope:', scope);

                    function toggleVisibilityBasedOnPermission() {
                        var hasPermission = userPermissions.hasPermission(perm);

                        if (hasPermission && !isRestriction || !hasPermission && isRestriction) {
                            element.removeClass('hidden');
                        } else {
                            element.addClass('hidden');
                        }

                    }

                    toggleVisibilityBasedOnPermission();
                }
            };

        }
    ]);

})();