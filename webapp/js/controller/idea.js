/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("IdeaController", ["$scope", "$rootScope", "$location", "$window", "$cookies", "LdtApi", "NavApi", "auth", "ngProgress",
    function ($scope, $rootScope, $location, $window, $cookies, LdtApi, NavApi, auth, ngProgress) {

        //
        $rootScope.controller = "idea";
        NavApi.Init($rootScope, $location, $cookies, $window);


        //
        $scope.auth = auth;
        $scope.idea = null;
        $scope.ideaId = $location.search().i;
        $scope.commentText = "";


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


        // Post Comment
        $scope.PostComment = function() {
            if (!auth.isAuthenticated) {
                $rootScope.Login();
                return;
            }
            if (!$scope.commentText)
                return;
            ngProgress.start();
            LdtApi.CommentCreate($scope.idea.iid, $scope.commentText)
                .success(function(response) {
                    LoadIdea();
                    $scope.commentText = "";
                })
                .error(function() {
                    $rootScope.ShowError("Load Idea");
                });
        };


        // UpVote
        ngProgress.start();
        $scope.UpVote = function() {
            if (!auth.isAuthenticated) {
                $rootScope.Login();
                return;
            }
            LdtApi.IdeaVote($scope.idea.iid)
                .success(function(data) {
                    LoadIdea();
                })
                .error(function() {
                    $rootScope.ShowError("IdeaVote");
                });
        };



}]);
