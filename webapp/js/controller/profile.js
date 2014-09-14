/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("ProfileController", ["$scope", "$rootScope", "$location", "LdtApi", "NavApi", "auth", "ngProgress",
    function ($scope, $rootScope, $location, LdtApi, NavApi, auth, ngProgress) {

        //
        $rootScope.controller = "profile";
        NavApi.Init($rootScope, $location);

        $scope.auth = auth;
        $scope.profile = null;
        $scope.profileId = $location.search().u;
        $scope.Logout = $rootScope.Logout;

        console.log($scope.profileId);

        //
        ngProgress.start()
        LdtApi.ProfileGet($scope.profileId)
            .success(function(profileData) {
                console.log(profileData);
                ngProgress.stop();
                $scope.profile = profileData;
            })
            .error(function() {
                ngProgress.stop();
                $rootScope.ShowError();
            });

}]);