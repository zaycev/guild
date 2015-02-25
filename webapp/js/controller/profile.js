/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("ProfileController", ["$scope", "$rootScope", "$location", "$window", "$cookies", "LdtApi", "NavApi", "auth", "ngProgress",
    function ($scope, $rootScope, $location, $window, $cookies, LdtApi, NavApi, auth, ngProgress) {

        //
        $rootScope.controller = "profile";
        NavApi.Init($rootScope, $location, $cookies, $window);


        //
        $scope.auth = auth;
        $scope.profile = null;
        $scope.profileId = $location.search().u;
        $scope.Logout = $rootScope.Logout;


        // Load Profile
        var LoadProfile = function() {
            ngProgress.start();
            LdtApi.ProfileGet($scope.profileId)
                .success(function(profileData) {
                    $scope.profile = profileData;
                    ngProgress.complete();
                })
                .error(function() {
                    $rootScope.ShowError("Load Profile");
                });
        };
        LoadProfile();


        // Delete Idea
        $scope.DeleteIdea = function(iid) {
            var deleteIdea = window.confirm("Are you absolutely sure you want to delete?");
            if (deleteIdea) {
                LdtApi.IdeaRemove(iid)
                    .success(function(response) {
                        console.log(response);
                        ngProgress.complete();
                        LoadProfile();
                    })
                    .error(function() {
                        $rootScope.ShowError("Load Profile");
                    });
            }
        };


        // Up Vote
        $scope.UpVote = function(iid) {
            if (!auth.isAuthenticated) {
                $rootScope.Login();
                return;
            }
            ngProgress.start();
            LdtApi.IdeaVote(iid)
                .success(function(data) {
                    LoadProfile();
                })
                .error(function() {
                    $rootScope.ShowError("IdeaVote");
                });
        };


        // Search for hashtag
        $scope.SearchHashtag = function(hashtag) {
            $rootScope.textQuery = hashtag;
            $location.path("list").search({"q": $rootScope.textQuery});
            $rootScope.tQ = $rootScope.textQuery;
        };

}]);
