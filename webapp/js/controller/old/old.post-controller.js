app.controller("PostController", ["$scope", "$location", "$sce", "ApiFactory", "FileUploader", "auth",
    function ($scope, $location, $sce, ApiFactory, FileUploader, auth) {

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

        $scope.newProject = {
            description: "",
            title: ""
        };

        var uploader = $scope.uploader = new FileUploader({
            url: "/api/v1/upload/"
        });

        $scope.Post = function() {
            uploader.uploadAll();
        };


        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            // console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            // console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            // console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            // console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            // console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            // console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            // console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            // console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            // console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            // console.info('onCompleteAll');
        };



        uploader.onCompleteItem = function(fileItem, response, status, headers) {

            ApiFactory.Post(auth.profile.user_id, $scope.newProject.title, $scope.newProject.description, response.data.newName)
            .success(function(data) {
                window.location = "/app/#/view?projectId=" + data.data.projectId;
            });

        };


}]);