/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("ListController", ["$scope", "$rootScope", "$location", "LdtApi", "NavApi", "auth", "ngProgress",
    function ($scope, $rootScope, $location, LdtApi, NavApi, auth, ngProgress) {

        //
        $rootScope.controller = "list";
        NavApi.Init($rootScope, $location);


        //
        $scope.ideas = null;


        // Load List
        ngProgress.start();
        var LoadList = function () {
            LdtApi.IdeaList($rootScope.skipSize, $rootScope.textQuery)
                .success(function(ideasList) {
                    $scope.ideas = ideasList;
                    ngProgress.complete();
                })
                .error(function() {
                    $rootScope.ShowError("IdeaList");
                });
        };
        LoadList();

        // Up Vote
        $scope.UpVote = function(iid) {
            ngProgress.start();
            LdtApi.IdeaVote(iid)
                .success(function(data) {
                    LoadList();
                })
                .error(function() {
                    $rootScope.ShowError("IdeaVote");
                });
        };


}]);