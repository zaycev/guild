/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("ListController", ["$scope", "$location", "$sce", "ApiFactory", "auth",
    function ($scope, $location, $sce, ApiFactory, auth) {

        $(document).ready(function($) {
                $("#header .search input[type='text']")
            .on("focusin", function(){
                $("#header .search-placeholder").hide();
            })
            .on("focusout", function(){
                if( !$(this).val() ) {
                    $("#header .search-placeholder").show();
                }
            });
        });

        $scope.auth = auth;
        $scope.projectList = [];

        ApiFactory.List().success(function(data) {
            $scope.projectList = data.data;
        });

        $scope.GoPost = function() {
            if (auth.isAuthenticated) {
                window.location = "#/post"
            } else {
                $scope.login();
            }
        };

        $scope.UpVote = function(projectId) {

            if (auth.isAuthenticated) {
                ApiFactory.UpVote(auth.profile.user_id, projectId).success(function() {

                    ApiFactory.List().success(function(data) {
                        $scope.projectList = data.data;
                    });

                });
            } else {
                $scope.login();
            }

        }

        $scope.List = function() {
            ApiFactory.List(50, 0, $scope.query).success(function(data) {
                $scope.projectList = data.data;
            });
        };


        $scope.login = function() {
            auth.signin({
                popup: true
              }, function() {

                ApiFactory.NewUser(auth.profile.user_id,
                                   auth.profile.name,
                                   auth.profile.screen_name,
                                   auth.profile.picture).success(function(data) {
                });
               location.reload();
              }, function(data) {
                console.log(data);
            });
        };

}]);