/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("EditIdeaController", ["$scope", "$rootScope", "$location", "LdtApi", "NavApi", "auth", "ngProgress",
    function ($scope, $rootScope, $location, LdtApi, NavApi, auth, ngProgress) {

        //
        $rootScope.controller = "edit-idea";
        NavApi.Init($rootScope, $location);

        //
        $scope.auth = auth;


}]);