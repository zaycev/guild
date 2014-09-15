/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("PostController", ["$scope", "$rootScope", "$location", "LdtApi", "NavApi", "auth", "FileUploader", "ngProgress",
    function ($scope, $rootScope, $location, LdtApi, NavApi, auth, FileUploader, ngProgress) {

        //
        $rootScope.controller = "create";
        NavApi.Init($rootScope, $location);


        //
        var pictureId       = null;
        $scope.ideaTitle    = "";
        $scope.ideaSummary  = "";
        var uploader = $scope.uploader = new FileUploader({
            url: "/api/pic/upload/"
        });

        // CreateIdea
        var createIdea = function() {
            if ($scope.ideaTitle.length == 0)
                return;
            ngProgress.start();
            LdtApi.IdeaCreate($scope.ideaTitle, $scope.ideaSummary, pictureId)
                .success(function(response) {
                    $location.path("idea").search("i", response.iid);
                })
                .error(function(data) {
                    $rootScope.ShowError("PostIdea");
                });
        };


        // Post Idea
        $scope.IdeaCreate = function() {
            if ($scope.ideaTitle.length == 0)
                return;
            if ($("#fileUploadInput").val()) {

                ngProgress.start();
                uploader.uploadAll();

            } else {

                createIdea();
            }
        };


        // Upload Callbacks
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            if (response.pid) {
                pictureId = response.pid;
                ngProgress.set(50);
                createIdea();
            } else {
                $rootScope.ShowError("UploadImage");
            }
        };

}]);