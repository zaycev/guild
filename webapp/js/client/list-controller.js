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

        $scope.UpVote = function(projectId) {

            ApiFactory.UpVote(auth.profile.user_id, projectId).success(function() {

                ApiFactory.List().success(function(data) {
                    $scope.projectList = data.data;
                });

            });
        }

}]);