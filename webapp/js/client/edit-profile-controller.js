app.controller("EditProfileController", ["$scope", "$location", "$sce", "ApiFactory", "auth",
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


    ApiFactory.Profile(auth.profile.user_id).success(function(data) {
        $scope.userData = data.data;
        console.log($scope.userData);
    });


    $scope.SaveProfile = function() {
        ApiFactory.SaveProfile($scope.userData).success(function(){
            window.location = "#/profile?userId=" + $scope.userData.userId;
        });
    };


}]);