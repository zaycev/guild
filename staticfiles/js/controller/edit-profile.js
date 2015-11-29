/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("EditProfileController", ["$scope", "$rootScope", "$location", "$window", "$cookies", "LdtApi", "NavApi", "auth", "ngProgress",
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
        ngProgress.start();
        LdtApi.ProfileGet($scope.profileId)
            .success(function(profileData) {
                $scope.profile = profileData;
                console.log(profileData);
                ngProgress.complete();
            })
            .error(function() {
                $rootScope.ShowError("Load Profile");
            });


        // Update Profile
        ngProgress.start();
        $scope.UpdateProfile = function() {
            LdtApi.ProfileUpdate($scope.profile.tagline, $scope.profile.email)
                .success(function(profileData) {
                    $scope.profile = profileData;

                    $cookies.dissmissWarning = false;
                    $cookies.emailSet = Boolean(profileData.email);
                    $rootScope.showEmailWarning = auth.isAuthenticated && !Boolean($cookies.dissmissWarning) && !Boolean($cookies.emailSet);

                    ngProgress.complete();



                    $location.path("profile");
                })
                .error(function() {
                    $rootScope.ShowError("Update Profile");
                });
        };

}]);
