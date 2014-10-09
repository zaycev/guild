/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("EditProfileController", ["$scope", "$rootScope", "$location", "LdtApi", "NavApi", "auth", "ngProgress",
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
        ngProgress.start();
        LdtApi.ProfileGet($scope.profileId)
            .success(function(profileData) {
                $scope.profile = profileData;
                ngProgress.complete();
                console.log(profileData);
            })
            .error(function() {
                $rootScope.ShowError("Load Profile");
            });


        // Update Profile
        ngProgress.start();
        $scope.UpdateProfile = function() {
            LdtApi.ProfileUpdate($scope.profile.tagline)
                .success(function(profileData) {
                    $scope.profile = profileData;
                    ngProgress.complete();
                    $location.path("profile");
                })
                .error(function() {
                    $rootScope.ShowError("Update Profile");
                });
        };

}]);
