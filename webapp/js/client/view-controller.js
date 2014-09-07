app.controller("ViewController", ["$scope", "$location", "$sce", "ApiFactory", "auth",
    function ($scope, $location, $sce, ApiFactory, auth) {




jQuery(document).ready(function($) {


    // #####################################################################
    $("#header .search input[type='text']")
        .on("focusin", function(){
            $("#header .search-placeholder").hide();
        })
        .on("focusout", function(){
            if( !$(this).val() ) {
                $("#header .search-placeholder").show();
            }
        });

    // #####################################################################
    var hashtag = "#letsdoit ";

    checkValue($("#lets-do-it input[type='text']").val());

    $("#lets-do-it input[type='text']")
        .on("keyup", function(){
            checkValue($("#lets-do-it input[type='text']").val());
        })
        .on("focusin", function(){
            if( !$(this).val() ) {
                $(this).val(hashtag);
            }
        })
        .on("focusout", function(){
            if( !$(this).val() ) {
                $("#lets-do-it.comment")
                    .removeClass("comment")
                    .addClass("join")
                        .find("button")
                            .text("Lets do it");
            }
        });

    function checkValue(str){
        if(str) {
            if(str.indexOf(hashtag) >= 0) {
                $("#lets-do-it")
                    .removeClass("comment")
                    .addClass("join")
                        .find("button")
                            .text("Lets do it");
            } else {
                $("#lets-do-it")
                    .removeClass("join")
                    .addClass("comment")
                        .find("button")
                            .text("Comment");
            }
        } else {
            $("#lets-do-it")
                .removeClass("comment")
                .addClass("join")
                    .find("button")
                        .text("Lets do it");
        }
    }

});





        $scope.projectId = $location.search().projectId;
        $scope.projectData = undefined;


        console.log($scope.projectId);

        ApiFactory.View($scope.projectId).success(function(data) {

            $scope.projectData = data.data;

        });

        $scope.PostComment = function() {

            ApiFactory.PostComment(auth.profile.user_id, $scope.projectId,  $scope.commentText).success(function() {



        ApiFactory.View($scope.projectId).success(function(data) {

            $scope.projectData = data.data;
            $scope.commentText = "";

        });



            });

        }

}]);