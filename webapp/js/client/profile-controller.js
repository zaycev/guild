app.controller("ProfileController", ["$scope", "$location", "$sce", "ApiFactory", "auth",
    function ($scope, $location, $sce, ApiFactory, auth) {

    var userId = $location.search().userId;

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

    ApiFactory.Profile(userId).success(function(data) {

        $scope.userData = data.data;

    });

    $scope.LogOut = function() {
        auth.signout();
        window.location="/app/#";
    }


}]);