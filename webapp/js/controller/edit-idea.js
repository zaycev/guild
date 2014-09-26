/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("EditIdeaController", ["$scope", "$rootScope", "$location", "LdtApi", "NavApi", "auth", "ngProgress",
    function ($scope, $rootScope, $location, LdtApi, NavApi, auth, ngProgress) {

        //
        $rootScope.controller = "edit-idea";
        NavApi.Init($rootScope, $location);

        //
        //
        $scope.auth = auth;
        $scope.idea = null;
        $scope.ideaId = $location.search().i;

        // Load Idea
        ngProgress.start();
        var LoadIdea = function() {
            LdtApi.IdeaGet($scope.ideaId)
                .success(function(ideaData) {
                    $scope.idea = ideaData;
                    ngProgress.complete();
                })
                .error(function() {
                    $rootScope.ShowError("Load Idea");
                });
        };
        LoadIdea();


}]);
