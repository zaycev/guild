/**
 * Author: Vova Zaytsev <zaytsev@usc.edu>
 */


app.controller("EditIdeaController", ["$scope", "$rootScope", "$location", "LdtApi", "NavApi", "auth", "FileUploader", "ngProgress",
    function ($scope, $rootScope, $location, LdtApi, NavApi, auth, FileUploader, ngProgress) {

        //
        $rootScope.controller = "edit-idea";
        NavApi.Init($rootScope, $location);


        //
        $scope.auth = auth;
        $scope.idea = {
            "title": "",
            "summary": ""
        };
        $scope.ideaId = $location.search().i;
        var pictureId = null;
        var uploader = $scope.uploader = new FileUploader({
            url: "/api/pic/upload/"
        });


        // Load Idea
        ngProgress.start();
        var LoadIdea = function() {
            LdtApi.IdeaGet($scope.ideaId)
                .success(function(ideaData) {
                    $scope.idea = ideaData;
                    ngProgress.complete();
                })
                .error(function() {
                    $rootScope.ShowError("Load Idea");
                });
        };
        LoadIdea();

        // Update Idea
        var UpdateIdea = function() {
            if ($scope.idea.title.length == 0)
                return;
            ngProgress.start();
            LdtApi.IdeaUpdate($scope.idea.iid, $scope.idea.title, $scope.idea.summary, pictureId)
                .success(function(response) {
                    $location.path("idea").search("i", response.iid);
                })
                .error(function(data) {
                    $rootScope.ShowError("UpdateIdea");
                });
        };



        // Update Idea button event
        $scope.IdeaUpdate = function() {
            if ($scope.idea.title.length == 0)
                return;
            if ($("#fileUploadInput").val()) {
                ngProgress.start();
                uploader.uploadAll();
            } else {
                UpdateIdea();
            }
        };


        // Upload Callbacks
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            if (response.pid) {
                pictureId = response.pid;
                ngProgress.set(50);
                UpdateIdea();
            } else {
                $rootScope.ShowError("UploadImage");
            }
        };


}]);
