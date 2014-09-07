/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("LoginController", ["$scope", "$location", "$sce", "ApiFactory", "auth",
    function ($scope, $location, $sce, ApiFactory, auth) {

        console.log(auth);

        $scope.login = function() {
            auth.signin({
                popup: true
              }, function() {

                ApiFactory.NewUser(auth.profile.user_id,
                                   auth.profile.name,
                                   auth.profile.screen_name,
                                   auth.profile.picture).success(function(data) {


                });

              }, function(data) {
                console.log(data);
            });
        }

}]);