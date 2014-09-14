/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("PostController", ["$scope", "$rootScope", "$location", "LdtApi", "NavApi", "auth", "FileUploader",
    function ($scope, $rootScope, $location, LdtApi, NavApi, auth, FileUploader) {

        //
        $rootScope.controller = "create";
        NavApi.Init($rootScope, $location);

        var uploader = $scope.uploader = new FileUploader({
            url: "/api/v1/file/upload"
        });

        $scope.ideaTitle    = "Test Title";
        $scope.ideaSummary  = "Test Summary";

        var pictureId     = null;

        $scope.IdeaCreate = function() {

            // If file set
            if ($("#fileUploadInput").val()) {
                console.log("SET");
            } else {
                LdtApi.IdeaCreate($scope.ideaTitle, $scope.ideaSummary, pictureId)
                    .success(function(data) {

                    })
                    .error(function(data) {

                    });
            }

        };

}]);