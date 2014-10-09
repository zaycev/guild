/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("ProfileController", ["$scope", "$rootScope", "$location", "LdtApi", "NavApi", "auth", "ngProgress",
    function ($scope, $rootScope, $location, LdtApi, NavApi, auth, ngProgress) {

        //
        $rootScope.controller = "profile";
        NavApi.Init($rootScope, $location);


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

}]);
