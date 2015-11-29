/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("ListController", ["$scope", "$rootScope", "$location", "$window", "$cookies", "LdtApi", "NavApi", "auth", "ngProgress",
    function ($scope, $rootScope, $location, $window, $cookies, LdtApi, NavApi, auth, ngProgress) {

        //
        $rootScope.controller = "list";
        NavApi.Init($rootScope, $location, $cookies, $window);


        //
        $scope.ideas = [];
        $scope.nextSkip = 0;

        // Load List
        ngProgress.start();
        var LoadList = function () {
            LdtApi.IdeaList(0, $rootScope.textQuery)
                .success(function(data) {

                    $scope.ideas = data.ideas;
                    $scope.nextSkip = data.ideas.length;
                    $scope.loadMore = data.loadMore;
                    ngProgress.complete();

                })
                .error(function() {
                    $rootScope.ShowError("IdeaList");
                });
        };
        LoadList();


        // Load More
        $scope.LoadMore = function () {
            ngProgress.start();
            LdtApi.IdeaList($scope.nextSkip, $rootScope.textQuery)
                .success(function(data) {

                    for (var i in data.ideas) {
                        var idea = data.ideas[i];
                        $scope.ideas.push(idea);
                        $scope.nextSkip += 1;
                    }
                    $scope.loadMore = data.loadMore;
                    ngProgress.complete();


                })
                .error(function() {
                    $rootScope.ShowError("IdeaList");
                });
        };


        // Up Vote
        $scope.UpVote = function(iid) {
            if (!auth.isAuthenticated) {
                $rootScope.Login();
                return;
            }
            ngProgress.start();
            LdtApi.IdeaVote(iid)
                .success(function(idea) {
                    console.log(["idea", idea]);
                    for (var i in $scope.ideas)
                        if ($scope.ideas[i].iid == idea.iid)
                            $scope.ideas[i] = idea;
                    ngProgress.complete();

                })
                .error(function() {
                    $rootScope.ShowError("IdeaVote");
                });
        };


        // Search Hash-Tag.
        $scope.SearchHashtag = function(hashtag) {
            $rootScope.textQuery = hashtag;
            $location.path("list").search({"q": $rootScope.textQuery});
            $rootScope.tQ = $rootScope.textQuery;
        };


}]);
