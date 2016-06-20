(function(myApp) {

    var viewModelHelper = function($http, $q, $window, $location) {

        var self = this;
        self.showPageHeader = true;

        self.getRootPath = function() { return myApp.rootPath; };
        self.goBack = function() {
            $window.history.back();
        };
        self.navigateTo = function(path) {
            $location.path(path.replace('~/', myApp.rootPath));
        };
        self.refreshPage = function(path) {
            $window.location.href = path.replace('~/', myApp.rootPath);
        };
        self.clone = function(obj) {
            return JSON.parse(JSON.stringify(obj));
        };
        return this;
    };

    myApp.viewModelHelper = viewModelHelper;

}(window.MyApp));