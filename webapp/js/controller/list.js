/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("ListController", ["$scope", "$rootScope", "$location", "LdtApi", "NavApi", "auth",
    function ($scope, $rootScope, $location, LdtApi, NavApi, auth) {

        $rootScope.controller = "list";
        NavApi.Init($rootScope, $location);

}]);