/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("ListController", ["$scope", "$rootScope", "$location", "$cookies", "LdtApi", "NavApi", "auth", "ngProgress",
    function ($scope, $rootScope, $location, $cookies, LdtApi, NavApi, auth, ngProgress) {

        //
        $rootScope.controller = "list";
        NavApi.Init($rootScope, $location, $cookies);


        //
        $scope.ideas = null;
        $scope.nextSkip = 0;


        // Load List
        ngProgress.start();
        var LoadList = function () {
            LdtApi.IdeaList(0, $rootScope.textQuery)
                .success(function(ideasList) {
                    $scope.ideas = ideasList;
                    $scope.nextSkip = ideasList.length;
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
                .success(function(ideasList) {

                    console.log(ideasList);

                    if(ideasList.length == 0)
                        alert("FIXME: No more ideas to load :-(")

                    for (var i in ideasList) {
                        $scope.ideas.push(ideasList[i]);
                        $scope.nextSkip += 1;
                    }
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
                    for (var i in $scope.ideas)
                        if ($scope.ideas[i].iid == idea.iid)
                            $scope.ideas[i] = idea;
                    ngProgress.complete();

                })
                .error(function() {
                    $rootScope.ShowError("IdeaVote");
                });
        };


        // Search Hashtag
        $scope.SearchHashtag = function(hashtag) {
            $rootScope.textQuery = hashtag;
            $location.path("list").search({"q": $rootScope.textQuery});
            $rootScope.tQ = $rootScope.textQuery;
        };


}]);
